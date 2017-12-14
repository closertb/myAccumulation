/**
 * Title:
 * @author Mr Denzel
 * @create Date 2017-12-14 17:06
 * @version 1.0
 * Description:
 */
var PI = Math.PI, sin = Math.sin, cos = Math.cos, tan = Math.tan, random = Math.random,option = {}, stars = [], mets = [];
/**
 * 背景绘制
 * */
function drawBg(point, starCount, meteorCount) {
    this.count = 0;
    this.append = point;
    option.count = 0;
    option.length = starCount;
    option.meteorLength = meteorCount;
    option.width = point.offsetWidth;
    option.height = point.offsetHeight;
    this.init();
    update();
}

/**
 * 对外暴露绘制接口
 * point：dom挂载点 类似 doucument.getElementById('point')
 * starCount:星星个数
 * meteorCount:流星个数
 * */
drawBg.create = function (point, starCount, meteorCount) {
    return new drawBg(point, starCount, meteorCount);
}
drawBg.prototype = {
    init: function () {
        var canvas = document.createElement('canvas'), size;
        canvas.width = option.width;
        canvas.height = option.height;
        option.ctx = canvas.getContext('2d');
        for (var i = 0; i < option.length; i++) {
            size = random() * 3 + 3;  //设置星星半径大小，最小半径，最大半径，这里为3~6
            var st = new Star(size, {x: random() * option.width, y: random() * option.height});
            stars.push(st);
            option.ctx.drawImage(st.canvas, st.position.x, st.position.y);
        }
        for (i = 0; i < option.meteorLength; i++) {
            //设置流星起点的x坐标，如果超出屏幕，则取余
            var xpoint = 400 + 600 * i + 100 * random();
            xpoint = (xpoint > option.width) ? (xpoint % option.width) : xpoint;
            var met = new Meteor(random() * 0.5 + 0.7, {x: xpoint, y: 200 * random()}, PI / 4);
            mets.push(met);
        }
        option.ctx.drawImage(mets[0].canvas, mets[0].position.x, mets[0].position.y);
        mets[0].setStart = true;
        this.append.appendChild(canvas);
/*        setTimeout(function () {
            option.ctx.drawImage(mets[1].canvas, mets[1].position.x, mets[1].position.y);
            mets[1].setStart = true;
            setTimeout(function () {
                option.ctx.drawImage(mets[2].canvas, mets[2].position.x, mets[2].position.y);
                mets[2].setStart = true;
            }, 1000);
        }, 1000)*/
        var metiorCount = 0;
        function addMetior() {
            metiorCount++;
            if(metiorCount>option.meteorLength){
                return ;
            }
            var met = mets[metiorCount-1]
            option.ctx.drawImage(met.canvas, met.position.x, met.position.y);
            met.setStart = true;
            setTimeout(function () {
                addMetior();
            },1000)
        }

    }
}

function update() {
    option.count = (option.count + 1) % option.length;
    var star = stars[option.count];
    star.update();
    option.ctx.clearRect(star.position.x, star.position.y, star.domSize, star.domSize)
    option.ctx.drawImage(star.canvas, star.position.x, star.position.y);
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
    requestAnimationFrame(update);
}

/**
 * 生成星星
 * size:星星大小
 * position:星星在页面中的位置
 * */
function Star(size, position) {
    this.position = position;
    this.size = size;
    this.domSize = size * 3;
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.domSize;
    this.canvas.height = this.domSize;
    this.alpha = random() * 0.5 + 0.55; //保证值在0.35 到 1 之间
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
        this.alpha = (this.alpha + 0.1) % 1 + 0.1;
        this.ctx.clearRect(0, 0, this.domSize, this.domSize);
        this.draw();
    }
};

/**
 * 生成流星
 * size:流星大小
 * position:流星在页面中的位置
 * single：流星的偏转角度
 * */
function Meteor(size, position, single) {
    this.position = position;
    this.xStart = position.x;
    this.size = size;
    this.radius = this.size * 1.5;
    this.rotateAngle = -1 * single;
    this.moveDis = 8;
    this.setStart = false;
    this.moveDisHight = this.moveDis * tan(-1 * this.rotateAngle);
    this.canvas = document.createElement('canvas');
    this.width = this.canvas.width = this.size * 150;
    var hei = (this.size > 1 ? this.size * 15 : 20);
    this.height = this.canvas.height = hei + this.width * sin(single);
    this.alpha = 0.60; //random() * 0.5 + 0.55保证值在0.35 到 1 之间
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
        this.alpha = 0.6;
    },
    update: function () {
        this.alpha = (this.alpha - 0.005);
        this.ctx.clearRect(0, 0, this.width, -1 * this.height);
        this.draw(false);
    }
}
var mergeFn = {
    ObjectisObject: function (value) {
        return value !== null && Object.prototype.toString.call(value) === '[object Object]';
    },
    clone: function (source) {
        if (Array.isArray(source)) {
            return source.map(this.clone);
        }
        if (this.ObjectisObject(source)) {
            var target = {};
            var keys = Object.keys(source);
            var klen = keys.length;
            var k = 0;
            for (; k < klen; ++k) {
                target[keys[k]] = this.clone(source[keys[k]]);
            }
            return target;
        }
        return source;
    },
    /**
     *target 合并后的新对象
     *source 原始对象
     *options 用户设定对象
     * */
    _merger: function (key, target, source, options) {
        var tval = options[key];
        var sval = source[key];

        if (this.ObjectisObject(tval) && this.ObjectisObject(sval)) {
            var res = {};
            target[key] = this.merge(res, sval, tval);
        } else {
            target[key] = tval ? this.clone(tval) : this.clone(sval);
        }
    },
    /*
    *target 合并后的新对象
    *source 原始对象
    *options 用户设定对象
    * */
    merge: function (target, source, options) {
        var sources = Array.isArray(source) ? source : [source];
        var ilen = sources.length;
        var i, keys, klen, k;
        options = options || {};
        for (i = 0; i < ilen; ++i) {
            source = sources[i];
            if (!this.ObjectisObject(source)) {
                continue;
            }
            keys = Object.keys(source);
            for (k = 0, klen = keys.length; k < klen; ++k) {
                this._merger(keys[k], target, source, options);
            }
        }
        return target;
    }
}
drawBg.create(document.getElementById('canvasPoint'), 100, 4);