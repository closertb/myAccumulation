/**
 * Title:
 * @author Mr Denzel
 * @create Date 2017-12-26 22:01
 * @version 1.0
 * Description:
 */
var PI = Math.PI;
function Clock(size) {
    this.height = size || 400;
    this.width  = size || 400;
    this.canvas = document.createElement('canvas');
    this.canvas.height = this.height;
    this.canvas.width = this.width;
    this.count = 0;
    this.ctx = this.canvas.getContext('2d');
    this.angle = 2*PI/60;
    this.init();
}
Clock.prototype = {
    init:function () {
        var ctx = this.ctx;
        this.drawBg();
        this.draw();
    },
    drawBg:function () {
        this.bgCanvas =document.createElement('canvas');
        this.bgCanvas.height = this.height;
        this.bgCanvas.width = this.width;
        var ctx = this.bgCanvas.getContext('2d');
        ctx.fillStyle = 'orange';
        ctx.fillRect(0,0,this.width,this.height);
        ctx.translate(this.width/2,this.height/2);
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.lineWidth = 3;
        ctx.arc(0,0,this.width/2-20,0,2*PI);
        ctx.fill();
        ctx.stroke();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'orange';
        for(var i=0;i<12;i++){
            ctx.moveTo(0,40-this.width/2);
            ctx.lineTo(0,25-this.width/2);
            ctx.rotate(-1*PI/6);
        }
        ctx.stroke();
        this.ctx.clearRect(0,0,this.width,this.height);
        this.ctx.drawImage(this.bgCanvas,0,0)
    },
    draw:function () {
        var nowTime = new Date();
        var hou=nowTime.getHours(),min=nowTime.getMinutes(),sec=nowTime.getSeconds();
        var ctx = this.ctx;
        ctx.translate(this.width/2,this.height/2);
        var angle = this.angle;
        var horAngle =(hou + min/60)*5*angle;
        var minAngle = (min + sec/60)*angle;
        var secAngle = sec*angle;
        ctx.beginPath();
        ctx.rotate(horAngle);
        ctx.fillStyle = 'black';
        ctx.moveTo(0,0);
        ctx.fillRect(-5,20,10,40-this.width/2);
        ctx.rotate(minAngle-horAngle);
        ctx.fillStyle = 'black';
        ctx.moveTo(0,0);
        ctx.fillRect(-3,25,6,15-this.width/2);
        ctx.rotate(secAngle-minAngle);
        ctx.moveTo(0,0);
        ctx.fillStyle = 'red';
        ctx.fillRect(-2,35,4,-10-this.width/2);
        ctx.rotate(secAngle*-1);
        ctx.beginPath();
        ctx.strokeStyle ='orange';
        ctx.moveTo(3,0);  //圆环开始绘制的点；
        ctx.lineWidth = 3;
        ctx.arc(0,0,3,0,2*PI);
        ctx.stroke();
        ctx.translate(0-this.width/2,0-this.height/2);
    },
    update:function () {
        this.count++;
        if(this.count>=60){
            this.count ===0;
            this.ctx.drawImage(this.bgCanvas,0,0);
            this.draw();
        }
    }
};