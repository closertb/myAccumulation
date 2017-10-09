;(function(){
    var m =Math,radar ={} ; //控制hover与自动轮播冲突
    var style ={
        color:'#fff',
        border:'0px solid rgb(51,51,51)',
        borderRadius:'4px',
        backgroundColor:'rgba(0,0,0,0.8)'
    };
    /**获取鼠标在canvas画布上的位置(**不是浏览器窗口的鼠标位置)
     * clientX获取的相对浏览器窗口左上角的位置，适用于所有浏览器
     * 在chrome浏览器中，有一个zrX属性，是相对于元素本身的相对位置
     * getBoundingClientRect()函数是获取元素边框相对于浏览器窗口的位置
     * */
    function getMousePos(canvas, event) {
        var rect = canvas&&canvas.getBoundingClientRect();
        if(rect){
            return {
                x: event.clientX - rect.left ,
                y: event.clientY - rect.top
            }
        }else{
            return {
                x: event.clientX,
                y: event.clientY
            }
        }
    }
    function createLabel() {
        /**自动轮播hoverLabel Dom 元素的生成*/
        var label =document.createElement('div');
        label.setAttribute('class','hoverLabel');
        label.style.position='absolute';
        label.style.display='none';
        radar.target.appendChild(label);
        radar.hoverLabel = label;
    }
    /**动态设置单轴显示标签的样式和数据
     * @param：参数
     * @label：要动态修改的dom元素
     * @point：label元素相对于canvas画布的位置
     * @text：label元素要显示的值
     * @style：label元素文字的显示样式
     * */
    function hoverLabel(label,point,text,style){
        label.style.display ='none';
        label.style.top=(point.y-37)+'px';
        label.style.left=(point.x-36)+'px';
        label.style.border=style.border;
        label.style.font ='normal 14px 微软雅黑';
        label.style.boxSizing='border-box';
        label.style.padding= "5px";
        label.style.color =style.color;
        label.style.borderRadius=style.borderRadius;
        label.style.backgroundColor = style.backgroundColor;
        label.style.transition ='left 0.4s cubic-bezier(0.23,1,0.32,1),top 0.4s cubic-bezier(0.23,1,0.32,1)';
        label.style.zIndex = 999;
        label.innerHTML =text;
        label.style.display ='inline-block';
        var triangle = document.createElement('label');
        triangle.style.width = '0';
        triangle.style.height= '0';
        triangle.style.position='absolute';
        triangle.style.left ='50%';
        triangle.style.top ='99%';
        triangle.style.marginLeft = '-5px';
        triangle.style.borderLeft = '5px solid transparent';
        triangle.style.borderRight = '5px solid transparent';
        triangle.style.borderTop= '5px solid white';
        triangle.style.borderTopColor = style.backgroundColor;
        label.appendChild(triangle);
    }
    function removeLabel(dom) {
        dom.style.display ='none';
    }
    var RadarAutoTip =function(target,option,autoOption){
        radar.target = target;
        radar.option = option;
        this.autoOption = autoOption;
        this.init();
    };
    RadarAutoTip.prototype.init =function () {
        var step =-1,hovering =false;
        radar.center ={
            pointx:(option.radar.center&&Number(option.radar.center[0].substr(0,option.radar.center[0].length-1))/100)||0.5,
            pointy:(option.radar.center&&Number(option.radar.center[1].substr(0,option.radar.center[1].length-1))/100)||0.5
        };
        var x=target.offsetWidth*radar.center.pointx;
        var y=target.offsetHeight*radar.center.pointy;
        var indicator = radar.option.radar.indicator;
        var data = option.series[0].data[0].value;
        var length = indicator.length;
        radar.radius= radar.option.radar.radius;
        var pointData=[];
        var single = 2*m.PI /length*(-1);
        for(var i = 0;i<length;i++){
            var ratio = data[i]/indicator[i].max;
            pointData.push([radar.radius*m.sin(i*single)*ratio,radar.radius*m.cos(i*single)*ratio]);
        }
        createLabel();
        this.autoOption.autoShow&&(this.autoOption.intervalId=setInterval(function () {
            step = (step+1)%length;
            var showPoint={
                x:pointData[step][0]+x,
                y:y-pointData[step][1]
            };
            var tag =indicator[step];
            var text = tag.text+':'+m.round(data[step]*100/tag.max)+"%";
            (!hovering)&&hoverLabel(radar.hoverLabel,showPoint,text,style);
        },this.autoOption.time||1000));
        /**hover相关设置*/
        this.autoOption.hoverEnable&&(radar.target.addEventListener('mousemove',function(event){
            var canvas= radar.target.querySelector('canvas');
            var mouse = getMousePos(canvas, event);
            var point={};
            var index =-1;
            var r =5; //hover 捕捉的精度
            point.x=mouse.x-x;
            point.y=y-mouse.y;
            for(var i=0;i<pointData.length;i++) {
                var item = pointData[i];
                if (point.x > (item[0] - r) && point.x < (item[0] + r) && point.y > (item[1] - r) && point.y < (item[1] + r)) {
                    index = i;
                    break;
                }
            }
            if(index!==-1){
                var tag =indicator[index]
                var text = tag.text+':'+m.round(data[index]*100/tag.max)+"%";
                hovering =true;
                hoverLabel(radar.hoverLabel,mouse,text,style);
            }else{
                hovering =false;
                removeLabel(radar.hoverLabel);
            }
        }))
    }
    RadarAutoTip.prototype.reset=function () {
        /**以下部分用于消除图表刷新重置数据后，销毁以前创建的label显示dom元素和定时器*/
        if(this.target.getElementsByClassName('hoverLabel').length){  //图表刷新重置时
            this.target.removeChild(target.getElementsByClassName('hoverLabel')[0]);
        }
        this.autoOption.intervalId&&clearInterval(this.autoOption.intervalId);
    }
    RadarAutoTip.prototype.stop=function () {
        /**以下部分用于消除图表刷新重置数据后，销毁以前创建的label显示dom元素和定时器*/
        if(this.target.getElementsByClassName('hoverLabel').length){  //图表刷新重置时
            this.target.removeChild(target.getElementsByClassName('hoverLabel')[0]);
        }
        this.autoOption.intervalId&&clearInterval(this.autoOption.intervalId);
    }
    RadarAutoTip.prototype.start=function () {
        /**以下部分用于消除图表刷新重置数据后，销毁以前创建的label显示dom元素和定时器*/
        if(this.target.getElementsByClassName('hoverLabel').length){  //图表刷新重置时
            this.target.removeChild(target.getElementsByClassName('hoverLabel')[0]);
        }
        this.autoOption.intervalId&&clearInterval(this.autoOption.intervalId);
    }
    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = RadarAutoTip;
    } else if (typeof define === 'function' && define.amd) {
        define(function() { return RadarAutoTip; });
    } else {
        this.RadarAutoTip = RadarAutoTip;
    }

}).call(function() {
    return this || (typeof window !== 'undefined' ? window : global);
}());