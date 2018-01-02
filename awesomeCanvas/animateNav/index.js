/**
 * Title:
 * @author Mr Denzel
 * @create Date 2017-12-09 11:32
 * @version 1.0
 * Description:
 */
var PI = Math.PI, sin = Math.sin, cos = Math.cos, tan = Math.tan, random = Math.random;

function cac(r, len) {
    var arr = [], single = 2 * PI / len;
    for (var i = 0; i < len; i++) {
        arr.push({x: r * sin(single * i), y: -1 * r * cos(single * i)});
    }
    return arr;
}

/*function draw() {
    var ctx = document.getElementById('canvas').getContext('2d');
    ctx.translate(325,325);
    ctx.beginPath();
    ctx.strokeStyle= 'white';
    ctx.arc(0,0,325,0,2*PI,false);
    var res = cac(325,10);
    ctx.moveTo(0,-325);
    res.forEach(function (t) {
        ctx.lineTo(t.x,t.y);
    })
    ctx.lineTo(res[0].x,res[0].y);
    ctx.stroke();
    console.log(res);
}*/
//draw()



/**
 * 背景绘制
 * */
function drawBg(point,opt) {
    this.stars = [];
    this.mets = [];
    /*以下所有参数都只能为正值*/
    this.option = {
            starCount:50,  //星星数量
            starMinSize:3, //星星最小半径，最小为0
            starMaxSize:6, //星星最大半径，最大为50
            starMinLux:0.1, //星星最小亮度，最小为0
            starMaxLux:0.8, //星星最大亮度，最大为1
            meteorCount:3, //流星数量,推荐数量在10以下，尽量不要下流星雨
            meteorAngle:45,//流星偏转角度，最大为60度.为0时是从屏幕右侧向左侧飞行
            meteorMaxLux:0.8, //流星最大亮度，最大为1
            meteorMoveSpeed:8,   //飞行速度
            meteorFadeSpeed:0.001,   //飞行速度
            meteorMaxSize:1.5, //流星半径,所有流星大小一样
            meterTime:1000 //每颗流星间隔出现时间
    };
    this.option.count = 0;
    this.append = point;
    var canvas = document.createElement('canvas')
    if(!canvas||!canvas.getContext){
        alert('浏览器版本太低');
        return false;
    }
    this.option.width = point.offsetWidth;
    this.option.height = point.offsetHeight;
    if(!(point.offsetWidth&&point.offsetHeight)){
        alert('画布宽高不能为0');
        return false;
    }
    this.initOption(opt,this.option);
    this.init();
    update(this.option,this.stars,this.mets);
}

/**
 * 对外暴露绘制接口
 * point：dom挂载点 类似 doucument.getElementById('point')
 * starCount:星星个数
 * meteorCount:流星个数
 * */
drawBg.create = function (point, option) {
    return new drawBg(point, option);
}
drawBg.prototype = {
    /*参数整合，并优化所有不合理的参数*/
    initOption:function (opt,option) {
        var that = this;
        //未传入任何参数,就直接返回不做任何处理；
        if(!opt){
            return;
        }
        opt&&Object.keys(opt).forEach(function (t) {
            option[t]&&(option[t] = opt[t]) ;  // 遍历传进来的opt所有键值，只改变option中预设属性的对应值
        });
        if(!option.starCount || !option.meteorCount){
            console.error('星星数量和流星属性不能同时为空');
            return;
        }
        this.starOption={
            minSize:option.starMinSize,
            maxSize:option.starMaxSize-option.starMinSize,
            minLux:option.starMinLux,
            maxLux:option.starMaxLux-option.starMinLux
        };
        this.meteorOption={
            size:option.meteorMaxSize,
            angle:PI*option.meteorAngle/180,
            maxLux:option.meteorMaxLux,
            moveSpeed:option.meteorMoveSpeed,   //飞行速度
            fadeSpeed:option.meteorFadeSpeed   //消逝速度
        }
    },
    init: function () {
        var canvas = document.createElement('canvas'), size, that = this;;
        canvas.width = this.option.width;
        canvas.height = this.option.height;
        this.option.ctx = canvas.getContext('2d');
        for (var i = 0; i < this.option.starCount; i++) {
            var st = new Star({x: random() * this.option.width, y: random() * this.option.height},this.starOption);
            this.stars.push(st);
            this.option.ctx.drawImage(st.canvas, st.position.x, st.position.y);
        }
        for (i = 0; i < this.option.meteorCount; i++) {
            //设置流星起点的x坐标，如果超出屏幕，则取余
            var xpoint = 400 + 600 * i + 100 * random();
            xpoint = (xpoint > this.option.width) ? (xpoint % this.option.width) : xpoint;
            var met = new Meteor({x: xpoint, y: 200 * random()}, this.meteorOption);
            this.mets.push(met);
        }
        this.append.appendChild(canvas);
        var metiorCount = 0;
        function addMeteor() {
            metiorCount++;
            if(metiorCount>that.option.meteorCount){
                return ;
            }
            var met =that.mets[metiorCount-1]
            that.option.ctx.drawImage(met.canvas, met.position.x, met.position.y);
            met.setStart = true;
            setTimeout(function () {
                addMeteor();
            },that.option.meterTime)
        }
        addMeteor();
    }
}

function update(option,stars,mets) {
    if(option.starCount){
        option.count = (option.count + 1) % option.starCount;
        var star = stars[option.count];
        star.update();
        option.ctx.clearRect(star.position.x, star.position.y, star.domSize, star.domSize)
        option.ctx.drawImage(star.canvas, star.position.x, star.position.y);
    }
    mets.forEach(function (t) {
        if (!t.setStart) {
            return;
        }
        option.ctx.clearRect(t.position.x, t.position.y, t.width, t.height);
        if (t.position.x + t.width <= 0 || t.position.y > 1950 || t.alpha < 0) {
            t.position.x = t.xStart + 100 * random();
            t.position.y = 200 * random();
            t.setAlphaDefault();
        }
        t.position.x = t.position.x - t.moveDis;
        t.position.y = t.position.y + t.moveDisHight;
        t.update();
        option.ctx.drawImage(t.canvas, t.position.x, t.position.y);
    });
    requestAnimationFrame(function () {
        update(option,stars,mets);
    });
}

/**
 * 生成星星
 * size:星星大小
 * position:星星在页面中的位置
 *         this.starOption={
            minSize:option.starMinSize,
            maxSize:option.starMaxSize-option.starMinSize,
            minLux:option.starMinLux,
            maxLux:option.starMaxLux-option.starMinLux
        };
 * */
function Star(position,option) {
    this.position = position;
    this.size =random() * option.maxSize + option.minSize;  //设置星星半径大小，最小半径，最大半径，这里为3~6;
    this.domSize = this.size * 3;
    this.maxLux = option.minLux+option.maxLux;
    this.minLux = option.minLux;
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.domSize;
    this.canvas.height = this.domSize;
    this.alpha = random() * (option.maxLux-0.3) + 0.35; //保证值在0.35 到 1 之间
    this.ctx = this.canvas.getContext('2d');
    this.draw();
}

Star.prototype = {
    draw: function () {
        this.color = 'rgba(255,255,255,' + this.alpha + ')';
        this.ctx.shadowBlur = this.size * 0.8;
        this.ctx.shadowColor = this.color;

        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.domSize / 2, this.domSize / 2, this.size * 0.4, 0, 2 * PI);
        this.ctx.fill();
    },
    update: function () {
        this.alpha = (this.alpha + 0.1) % this.maxLux + this.minLux;//增加到最高之后，变为最低亮度，设为0时，是会消失一会的
        this.ctx.clearRect(0, 0, this.domSize, this.domSize);
        this.draw();
    }
};

/**
 * 生成流星
 * position:流星在页面中的位置
 * meteorOption={
 *          size:option.meteorMaxSize,
            angle:PI*option.meteorAngle/180,
            maxLux:option.meteorMaxLux,
            moveSpeed:8,   //飞行速度
            fadeSpeed:0.001   //飞行速度
        }
 * */
function Meteor( position,option) {
    this.position = position;
    this.xStart = position.x;
    this.size = random() * (option.size-0.7) + 0.7 ;
    this.radius = this.size ;//*1.5,
    this.rotateAngle = -1 * option.angle;
    this.moveDis = option.moveSpeed;  //移动速度
    this.moveDisHight = this.moveDis * tan(-1 * this.rotateAngle);  //根据移动速度.计算纵向移动速度
    this.setStart = false;
    this.canvas = document.createElement('canvas');
    this.width = this.canvas.width = this.size * 150;
    var hei = (this.size > 1 ? this.size * 20 : 20);
    this.height = this.canvas.height = hei + this.width * sin(option.angle);
    this.maxLux =  option.maxLux;
    this.alpha = option.maxLux; //random() * 0.5 + 0.55保证值在0.35 到 1 之间
    this.fedeSpeed = option.fadeSpeed;
    this.ctx = this.canvas.getContext('2d');
    this.draw(true);
}

Meteor.prototype = {
    draw: function (first) {
        this.color = 'rgba(255,255,255,' + this.alpha + ')';
        if (first) {
            this.ctx.translate(5, this.height - 8);
            this.ctx.rotate(this.rotateAngle);
        }
        var grad = this.ctx.createLinearGradient(0, 0, this.canvas.width, -1 * this.canvas.height);
        grad.addColorStop(0, 'rgba(255,255,255,' + this.alpha + ')');
        grad.addColorStop(1, 'rgba(255,255,255,' + this.alpha * 0.1 + ')');
        this.ctx.shadowBlur = this.size * 0.4;
        this.ctx.shadowColor = grad;
        this.ctx.beginPath();
        this.ctx.fillStyle = grad;
        this.ctx.arc(this.size * 3 + 1, -4, this.radius, PI / 2, 3 * PI / 2, false);
        this.ctx.lineTo(this.width - 4, -4);
        this.ctx.lineTo(this.size * 3 + 1, 2 * this.radius - 4);
        this.ctx.fill();
    },
    setAlphaDefault: function () {
        this.alpha = this.maxLux;
    },
    update: function () {
        this.alpha = (this.alpha - this.fedeSpeed);
        this.ctx.clearRect(0, 0, this.width, -1 * this.height);
        this.draw(false);
    }
}
drawBg.create(document.getElementById('canvasPoint'), {starCount:200,meteorCount:3,meterTime:1000});
/**
 * 加载导航栏时hover效果停止显示的动画；
 **/
window.onload = function () {
    setTimeout(function () {
        var selectLists = document.querySelectorAll('.item-selected');
        selectLists.forEach(function (t) {
            t.classList.remove('item-selected');
        })
    }, 1800);
};
