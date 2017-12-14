/**
 * Title:
 * @author Mr Denzel
 * @create Date 2017-12-09 11:32
 * @version 1.0
 * Description:
 */
var PI = Math.PI, sin = Math.sin, cos = Math.cos, random = Math.random;

function cac(r, len) {
    var arr = [], single = 2 * PI / len;
    for (var i = 0; i < len; i++) {
        arr.push({x: r * sin(single * i), y: -1 * r * cos(single * i)});
    }
    return arr;
}

function draw() {
    var ctx = document.getElementById('canvas').getContext('2d');
    ctx.translate(151,151);
    ctx.beginPath();
    ctx.strokeStyle= 'blue';
    ctx.arc(0,0,150,0,2*PI,false);
    var res = cac(150,6);
    ctx.moveTo(0,-150);
    res.forEach(function (t) {
        ctx.lineTo(t.x,t.y);
    })
    ctx.lineTo(res[0].x,res[0].y);
    ctx.stroke();
    console.log(res);
}

//draw();
var option = {},stars=[];
function drawBg(point, length) {
    this.count = 0;
    this.append = point;
    option.count = 0;
    option.length=length;
    option.width= point.offsetWidth;
    option.height= point.offsetHeight;
    this.init();
    update();
}
drawBg.create = function (point, length) {
    return new drawBg(point, length);
}
drawBg.prototype = {
    init: function () {
        var canvas = document.createElement('canvas'), size;
        canvas.width  = option.width;
        canvas.height =option.height;
        option.ctx= canvas.getContext('2d');
        for (var i = 0; i < option.length; i++) {
            size = random() * 6 + 6;
            var st = new Star(size, {x: random() * option.width, y: random() * option.height});
            stars.push(st);
            option.ctx.drawImage(st.canvas, st.position.x, st.position.y);
        }
        this.append.appendChild(canvas);
    }
}
function update() {
    option.count = (option.count+1)%option.length;
    var star = stars[option.count];
    star.update();
    option.ctx.clearRect(star.position.x,star.position.y,star.domSize,star.domSize)
    option.ctx.drawImage(star.canvas,star.position.x,star.position.y);
    requestAnimationFrame(update);
}
function Star(size, position) {
    this.position = position;
    this.size = size;
    this.domSize = size * 2;
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.domSize;
    this.canvas.height =this.domSize;
    this.alpha = random() * 0.5 + 0.55; //保证值在0.35 到 1 之间
    this.ctx = this.canvas.getContext('2d');
    this.init();
}

Star.prototype = {
    init: function () {
        this.draw();
    },
    draw: function () {
        this.color = 'rgba(255,255,255,' + this.alpha + ')';
        this.ctx.shadowBlur = this.size * 0.4;
        this.ctx.shadowColor = this.color;
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.domSize/2, this.domSize/2, this.size * 0.4, 0, 2 * PI);
        this.ctx.fill();
    },
    update: function () {
        this.alpha = (this.alpha + 0.1) % 1 + 0.4;
        this.ctx.clearRect(0, 0, this.domSize, this.domSize);
        this.draw();
    }
}
drawBg.create(document.getElementById('canvasPoint'), 50);