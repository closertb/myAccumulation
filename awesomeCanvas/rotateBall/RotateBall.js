/**
 * Title:
 * @author Mr Denzel
 * @create Date 2017-09-25 22:45
 * @version 1.0
 * Description:画一个旋转球体
 */
;(function () {
    const option ={}; //用于存储于球体相关参数的全局存储，供后面计算使用
    var ctx={},  //存储画布
        balls =[],  //存储球体的点阵
        angleX = 0-Math.PI/10000,  //设定球体x轴旋转速度
        angleY = 0-Math.PI/10000;  //设定球体y轴旋转速度
    const m = Math;  //存储js math对象
    const PI = m.PI; //存储js常量PI
    function RotateBall(dom,longitudeAngle,latitudeAngle,radius){
        const canvas = document.createElement('canvas'); //创建一个canvas元素
        /*根据挂载点的长宽，初始化画布的样式*/
        var x=dom.offsetWidth,y=dom.offsetHeight;
        if(x===0||y===0){
            console.error('append Dom has no height or width');
            return ;
        }
        canvas.width  = option.width =  x;
        canvas.height = option.height = y;
        if(radius){   //如果初始化的时候设置了球体的半径，则以设定的半径为准
            option.radius = radius;
        }else{
            option.radius = ((x>y)?y:x)/2 -10;
        }
        if(!longitudeAngle){
            longitudeAngle = 15;
        }
        if(!latitudeAngle){
            latitudeAngle = 15;
        }
        option.longitudeNum = 360 / longitudeAngle;  //纬线条数
        option.latitudeNum = 360 / latitudeAngle;  //经线条数
        option.centerX = x/2;   //获取画布中心点
        option.centerY = y/2;
        option.scale = m.ceil(option.radius *2.5);
        ctx =canvas.getContext("2d");  //初始化画布
        dom.appendChild(canvas);  //将画布添加到挂载元素上
        this.init();
    }
    RotateBall.prototype.init = function () {
        this.animation = new Animation(); //初始化一个球体
        rotateX();  //由于球体初始化后，呈现出的样式是南北极朝向屏幕，所以沿x轴旋转了90度；
    }
    RotateBall.prototype.start = function () {
        this.animation.start(); //开始旋转
    }
    RotateBall.prototype.stop = function () {
        this.animation.stop();  //停止旋转
    }
    /**球体构造函数，init函数这一步画出了球体上所有的点
     * 分三步步：
     * 第一步：计算球体上所有的经线圆的大小；
     * 第二步：计算每条经线上与纬线所有的交点，并将这些点画出来
     * 第三步：获取 requestAnimationFrame对象，并执行动画函数,控制对象属性isRunning来控制球的转与停
     * */
    var Animation = function(){
        this.init();
    };
    Animation.prototype = {
        isRunning: false,
        init: function () {
            var num = option.longitudeNum / 2;         					//经线的数目
            for (var i = 0; i <=num/2; i++) {
                var l = new layer(i, 1);   //画南半球的经线
                l.draw();
                var l = new layer(i, -1); //画北半球的经线
                l.draw();
            }

        },
        start:function(){
            this.isRunning = true;
            animate(this.isRunning);
        },
        stop:function(){
            this.isRunning = false;
        }
    }
    function animate(isRunning){
        ctx.clearRect(0,0,option.width , option.height);
        //  rotateX();
        rotateY();
        //  rotateZ();
        for(var i=0;i<balls.length;i++){
            balls[i].paint(); //重新计算球体上各个点的位置，并重绘点
        }
        makeLines(option.longitudeNum/4,1);  //每一步重绘点了之后，需要给这些点重新连线，北半球的点
        makeLines(option.longitudeNum/4,-1);  //每一步重绘点了之后，需要给这些点重新连线，南半球的点

        function makeLines(layer,up) {
            function linesPoint(start,end){
                var length = start.length;
                var _vpx = option.centerX,_vpy = option.centerX;
                var point;
                ctx.beginPath();
                ctx.strokeStyle ="rgba(255,255,255,0.5)"; //设定线的颜色
                point = start[0];
                ctx.moveTo(point.x + _vpx, point.y + _vpy);
                ctx.lineTo(end[0].x + _vpx, end[0].y + _vpy);
                ctx.lineTo(end[length-1].x + _vpx, end[length-1].y + _vpy);
                for(var i=1;i<length;i++){
                    point = start[i];
                    ctx.moveTo(point.x + _vpx, point.y + _vpy);
                    ctx.lineTo(end[i].x + _vpx, end[i].y + _vpy);
                    ctx.lineTo(end[(i-1)%length].x + _vpx, end[(i-1)%length].y + _vpy);
                    ctx.lineTo(point.x + _vpx, point.y + _vpy);
                }
                ctx.stroke();
            }
            var flag = (up>0)?0:2;
            for(var i=0+layer*flag;i<layer+layer*flag;i++){
                var startPoint = balls.filter(function (t) {
                    return (t.num ===i);
                });
                var endPoint = balls.filter(function (t) {
                    return (t.num ===(i+1));
                });
                linesPoint(startPoint,endPoint);
            }
        }

        if(isRunning) {
            if("requestAnimationFrame" in window){
                requestAnimationFrame(animate);
            }
            else if("webkitRequestAnimationFrame" in window){
                webkitRequestAnimationFrame(animate);
            }
            else if("msRequestAnimationFrame" in window){
                msRequestAnimationFrame(animate);
            }
            else if("mozRequestAnimationFrame" in window){
                mozRequestAnimationFrame(animate);
            }
        }
    }
    /**
     * 根据经线的条数，画出每条经线和纬线的交点
     * @params num :球体上的第几条经线；
     * @params  up :位于北半球还是南半球；
     * */
    var layer = function (num, up) {
        var length  = option.longitudeNum / 4 ;  //取中值
        this.radius = option.radius * Math.sin(num * Math.PI/ length/2);
        this.up = up;
        this.num = num+length-up*length;
        this.x = 0;
        this.y = 0;
    }

    layer.prototype = {
        setBalls: function (radius) {
            var offsetAngle = 2*PI/option.longitudeNum*this.num;//设定一个交叉角，有利于画出的三角形为等腰三角形，较规则
            for(var i=0; i<option.latitudeNum/2; i++){
                var angle = offsetAngle+2 * Math.PI / option.latitudeNum *2*i;
                var b = new ball(this.num,radius * Math.cos(angle), radius * Math.sin(angle), this.up * Math.sqrt(Math.pow(option.radius, 2) - Math.pow(radius, 2)), 4);
                b.paint();
                balls.push(b);
            }

        },
        draw: function () {
            this.setBalls(this.radius);
        }
    }
    /**
     * 根据经线的条数，画出每条经线和纬线的交点
     * @params num :球体上的第几条经线,标记用于后面线的绘制；
     * @params  x,y,x :交点在球体上的空间位置；
     * @params  r : 点的默认大小
     * */
    var ball = function(num,x , y , z , r){
        this.num = num;
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
        this.width = 2*r;
    }

    ball.prototype = {
        paint:function(){
            var fl = option.scale; //焦距
            var radius = option.radius;
            ctx.save();
            ctx.beginPath();
            var scale = fl / (fl - this.z);   // scale 越大，点越大；换句话说，离我们肉眼越近，放大的越多
            var alpha = (this.z+radius)/(4*radius); // 离中心点越大，z越小，alpha越小，透明度越高
            var blurScale = (radius-Math.abs(this.y))/radius ;
            ctx.arc(option.centerX + this.x, option.centerX + this.y, this.r*scale , 0 , 2*Math.PI , true);
            ctx.fillStyle = "rgba(255,255,255,"+(alpha+0.5)+")"; //经纬线交点的样式，alpha越大，透明度越低。
            ctx.shadowColor = "rgba(255,255,255,"+(alpha*2)+")";  //经纬线交点的阴影样式
            ctx.shadowBlur = 20*scale*blurScale;   //经纬线交点的大小
            ctx.fill();
            ctx.restore();
        }
    }
    /**
     * 绕X旋转95度左右,绕90度，会造成同一纬度上前后经线的覆盖，大于90度,就能错开
     * 以下三个ratate都用到了一个三角定理，已知圆上一个点与12点方向的夹角为a,
     * 那么用a表示就是 x = sin a, y = cos a;那么此时a点又绕圆心旋转了角度b,得到角度c；
     * x1 = sin c = sin(a+b)，y1 = cos c = cos(a+b);
     * 那么以增量b,和已知的x，y来表现，得到的结果就是
     * y1 = y * cos b - x* sin b
     * x1 = x sinb + y*cos b
     * */
    function rotateX(){
        var angle = Math.PI/2.1;
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        for(var i=0;i<balls.length;i++){
            var y1 = balls[i].y * cos - balls[i].z * sin;
            var z1 = balls[i].z * cos + balls[i].y * sin;
            balls[i].y = y1;
            balls[i].z = z1;
        }
    }

    function rotateY(){
        var cos = Math.cos(angleX);
        var sin = Math.sin(angleY);
        for(var i=0;i<balls.length;i++){
            var x1 = balls[i].x * cos - balls[i].z * sin;
            var z1 = balls[i].z * cos + balls[i].x * sin;
            balls[i].x = x1;
            balls[i].z = z1;
        }
    }

    function rotateZ(){
        var cos = Math.cos(angleX);
        var sin = Math.sin(angleY);
        for(var i=0;i<balls.length;i++){
            var x1 = balls[i].x * cos - balls[i].y * sin;
            var y1 = balls[i].y * cos + balls[i].x * sin;
            balls[i].x = x1;
            balls[i].y = y1;
        }
    }
    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = RotateBall;
    } else if (typeof define === 'function' && define.amd) {
        define(function() { return RotateBall; });
    } else {
        this.RotateBall = RotateBall;
    }
}).call(function() {
    return this || (typeof window !== 'undefined' ? window : global);
}());