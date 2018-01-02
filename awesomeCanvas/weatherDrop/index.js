/**
 * Title:canvas动态画颗粒背景
 * @author Mr Denzel
 * @create Date 2017-09-27 13:40
 * @version 1.0
 * Description:canvas动态画颗粒背景
 */
;(function $() {
    /*
     * @var star_r：star半径系数，系数越大，半径越大
     * @var star_alpha：生成star的透明度，star_alpha越大，透明度越低
     * @var initStarsPopulation：初始化stars的个数
     *
     * */
    var config = {
        radius : 3,
        alpha : 10,
        initCount : 100,
        move_distance : 10,
        wind_speed:0
    };
    var initSingle = Math.PI/360;
    var SIN = Math.sin;
    console.log(SIN(initSingle*20));
    //判断是否有requestAnimationFrame方法，如果有则使用，没有则大约一秒30帧
    window.requestAnimFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000/60);
        };

    var particles = [],
        ctx,
        WIDTH,
        HEIGHT;
    function initCanvas() {
        const canvas = document.createElement('canvas'); //创建一个canvas元素
        /*根据挂载点的长宽，初始化画布的样式*/
        WIDTH = document.documentElement.clientWidth;
        HEIGHT = document.documentElement.clientHeight;
        canvas.style.position = 'absolute';
        canvas.style.left = 0;
        canvas.style.top = 0;

        canvas.width  = WIDTH;
        canvas.height = HEIGHT;
        ctx = canvas.getContext('2d');
        document.body.appendChild(canvas);
    }
    var WeatherDrop =function (option) {
        initCanvas();
        var typeId = 0;
        ctx.strokeStyle = "white";
        ctx.shadowColor = "white";
        config.wind_speed = SIN(initSingle*20)*10;
/*        if(option.speed){
            config.move_distance = option.speed;
        }*/
        if(option.type==='snow'){
            config.move_distance = 0.3;
            for (var i = 0; i < config.initCount; i++) {
                particles.push( new Particle(i, Math.floor(Math.random()*WIDTH+200), Math.floor(Math.random()*HEIGHT-30),true));
            }
        }else{
            config.move_distance = 6;
            for (var i = 0; i < config.initCount; i++) {
                particles.push( new Rain(i, Math.floor(Math.random()*WIDTH+200), Math.floor(Math.random()*HEIGHT),true));
            }
        }

        ctx.shadowBlur = 0;
        animate();
    };
    function animate() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        particles.map(function (t) {
            t.move();
        });
        requestAnimationFrame(animate);
    }

    function Particle(id, x, y,useCache) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.useCache = useCache;
        this.cacheCanvas = document.createElement("canvas");
        this.cacheCtx = this.cacheCanvas.getContext("2d");
        this.speed_y = config.move_distance;
        this.speed_x = config.wind_speed;
        this.init();
        if (useCache) {
            this.cache()
        }
    }
    Particle.prototype = {
        init:function () {
            this.r = Math.floor(Math.random() * config.radius) + config.radius;
            this.cacheCtx.width = 6 * this.r;
            this.cacheCtx.height = 6 * this.r;
            var alpha = ( Math.floor(Math.random() * 10) + 1) / config.alpha;
            this.color = "rgba(255,255,255,.9)"; //"rgba(255,255,255," + alpha + ")"
        },
        draw : function () {
            if (!this.useCache) {
                ctx.save();
                ctx.fillStyle = this.color;
                ctx.shadowBlur = this.r * 2;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            } else {
                ctx.drawImage(this.cacheCanvas, this.x - this.r, this.y - this.r);
            }
        },
        cache : function () {
            this.cacheCtx.save();
            this.cacheCtx.fillStyle = this.color;
            this.cacheCtx.beginPath();
            this.cacheCtx.arc(this.r * 3, this.r * 3, this.r, 0, 2 * Math.PI);
            this.cacheCtx.closePath();
            this.cacheCtx.fill();
            this.cacheCtx.restore();
        },
        setPosition:function () {
            this.speed_y +=config.move_distance/30;
            this.x -= this.speed_x;
            this.y += this.speed_y;
        },
        move : function () {
            this.setPosition();
            if (this.y >=HEIGHT + 1 || this.x < -10) {
                this.reset();
            }
            this.draw();
        },
        reset:function () {
            if(this.x<-10){
                this.x = WIDTH+20;
                this.y = this.y-20;
            }else{
                this.x = WIDTH*Math.random()+50;
                this.y =-30;
                this.speed_y=config.move_distance;
            }
        },
        die : function () {
            particles[this.id] = null;
            delete particles[this.id]
        }
    };
    function Snow() {
        this.type = 'snow';
        Particle.call(this);
    }
    Snow.prototype = new Particle();

   function Rain(id, x, y,useCache) {
        this.type = 'rain';
        this.r = 2;
        this.color = "rgba(166,166,255,.9)";
        Particle.call(this,id,x,y,useCache);
    }
    Rain.prototype = Object.create(Particle.prototype);
    Rain.prototype.init =function () {
            this.r =2; // Math.floor(Math.random() * config.radius) + 1;
            this.cacheCtx.width = 10 * this.r;
            this.cacheCtx.height = 12 * this.r;
       //     var alpha = ( Math.floor(Math.random() * 10) + 1) / config.alpha;
            var alpha =0.2;
            this.color = "rgba(255,255,255," + alpha + ")";
    }
    Rain.prototype.cache = function () {
        this.cacheCtx.save();
        this.cacheCtx.fillStyle = this.color;
        this.cacheCtx.shadowColor = "white";
        this.cacheCtx.shadowBlur = 0;
        this.cacheCtx.rotate(initSingle*20);
        this.cacheCtx.beginPath();
        this.cacheCtx.fillRect(this.r*5,0,this.r,this.r*10);
        this.cacheCtx.closePath();
        this.cacheCtx.fill();
        this.cacheCtx.restore();
    }
    /*雨滴的回弹效果*/
    var Bounce = function(x, y) {
        var dist = Math.random() * 7;
        var angle = Math.PI + Math.random() * Math.PI;

        this.pos = new Vector(x, y);
        this.radius =  0.2+ Math.random()*0.8;
        this.vel = new Vector(
            Math.cos(angle) * dist,
            Math.sin(angle) * dist
        );
    };

    Bounce.prototype.update = function() {
        var gravity = 0.2;
        this.vel.y += gravity;
        this.vel.x *= 0.95;
        this.vel.y *= 0.95;
        this.pos.add(this.vel);
    };

    Bounce.prototype.draw = function() {

        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

    };
    var Vector = function(x, y) {
        //私有属性  横向速度x ,纵向速度y
        this.x = x || 0;
        this.y = y || 0;
    };
//公有方法- add : 速度改变函数,根据参数对速度进行增加
//由于业务需求，考虑的都是下落加速的情况，故没有减速的，后期可拓展
    /*
    * @param v  object || string
    */
    Vector.prototype.add = function(v) {
        if (v.x != null && v.y != null) {
            this.x += v.x;
            this.y += v.y;
        } else {
            this.x += v;
            this.y += v;
        }
        return this;
    };
//公有方法- copy : 复制一个vector，来用作保存之前速度节点的记录
    Vector.prototype.copy = function() {
        //返回一个同等速度属性的Vector实例
        return new Vector(this.x, this.y);
    };

    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = WeatherDrop;
    } else if (typeof define === 'function' && define.amd) {
        define(function() { return WeatherDrop; });
    } else {
        this.WeatherDrop = WeatherDrop;
    }
}).call(function() {
    return this || (typeof window !== 'undefined' ? window : global);
}());