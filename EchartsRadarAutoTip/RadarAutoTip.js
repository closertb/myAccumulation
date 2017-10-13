;(function(){
    var m =Math,radar ={};
    var style ={
        color:'#fff',
        border:'0px solid rgb(51,51,51)',
        borderRadius:'4px',
        backgroundColor:'rgba(0,0,0,0.8)'
    };
    /**给初始化后的echarts对象绑定一个自动轮播的属性
     * @parame chart ：初始化后的echarts对象
     * @parame target ：echarts对象挂载的dom元素
     * @parame option ： echarts对象的option配置
     * @parame autoOption ：配置你自己的autoOption
     */
    var RadarAutoTip =function(chart,target,option,autoOption){
        if(!chart.hasOwnProperty('radarAutoTip')){
            chart.radarAutoTip = new addAutoTip(target,option,autoOption)
        }else{
            chart.radarAutoTip.reset(option);
        }
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
        label.style.left=point.x+'px';
        label.style.border=style.border;
        label.style.font ='normal 14px 微软雅黑';
        label.style.boxSizing='border-box';
        label.style.padding= "5px";
        label.style.color =style.color;
        label.style.borderRadius=style.borderRadius;
        label.style.backgroundColor = style.backgroundColor;
        label.style.transition ='left 0.4s cubic-bezier(0.23,1,0.32,1),top 0.4s cubic-bezier(0.23,1,0.32,1)';
        label.style.transform='translate(-50%, 0)';
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

    var addAutoTip =function(target,option,autoOption){
        radar.target = target;
        radar.option = option;
        radar.formatter =autoOption.formatter || function (v) {
            return v.text+':'+v.value;
        };
        this.autoOption = autoOption;
        this.autoOption.intervalId = undefined;
        this.init();
        autoOption.autoShow&&(this.autoStart());
    };
    addAutoTip.prototype.init =function () {
        radar.hovering =false;
        radar.autoTipState =true;
        radar.center ={
            pointx:(option.radar.center&&Number(option.radar.center[0].substr(0,option.radar.center[0].length-1))/100)||0.5,
            pointy:(option.radar.center&&Number(option.radar.center[1].substr(0,option.radar.center[1].length-1))/100)||0.5
        };
        var x=target.offsetWidth*radar.center.pointx;
        var y=target.offsetHeight*radar.center.pointy;
        radar.pointZero ={
            x:x,
            y:y
        };
        var indicator =radar.indicator = radar.option.radar.indicator;
        var data = option.series[0].data[0].value;
        indicator = indicator.map(function (t,index) {
            t.value = data[index];
            return t;
        });
        var length = indicator.length;
        radar.radius= radar.option.radar.radius;
        var pointData=radar.pointData=[];
        var single = 2*m.PI /length*(-1);
        for(var i = 0;i<length;i++){
            var ratio = data[i]/indicator[i].max;
            pointData.push([radar.radius*m.sin(i*single)*ratio,radar.radius*m.cos(i*single)*ratio]);
        }
        createLabel();
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
                var tag =indicator[index];
                var text =radar.formatter(tag);    //tag.text+':'+m.round(tag.value*100/tag.max)+"%";
                radar.hovering =true;
                hoverLabel(radar.hoverLabel,mouse,text,style);
            }else{
                radar.hovering =false;
                removeLabel(radar.hoverLabel);
            }
        }))
    }
    /**以下部分用于消除图表刷新重置数据后，销毁以前创建的label显示dom元素和定时器*/
    addAutoTip.prototype.reset=function () {
        radar.hovering =false;
        radar.autoTipState =true;
        if(radar.target.getElementsByClassName('hoverLabel').length){  //图表刷新重置时
            radar.target.removeChild(radar.target.getElementsByClassName('hoverLabel')[0]);
        }
        this.autoOption.intervalId&&clearInterval(this.autoOption.intervalId);
        createLabel();
        this.autoStart();
    }
    /**停止自动轮播*/
    addAutoTip.prototype.stop=function () {
        radar.autoTipState =false;
    };
    /**开启自动轮播*/
    addAutoTip.prototype.start=function () {
        /**以下部分用于消除图表刷新重置数据后，销毁以前创建的label显示dom元素和定时器*/
        radar.autoTipState =true;
    };
    /**手动开启自动轮播*/
    addAutoTip.prototype.autoStart=function () {
        var step=-1;
        var length = radar.indicator.length;
        this.autoOption.intervalId=setInterval(function () {
            step = (step+1)%length;
            var showPoint={
                x:radar.pointData[step][0]+ radar.pointZero.x,
                y:radar.pointZero.y-radar.pointData[step][1]
            };
            var tag =radar.indicator[step];
            var text =radar.formatter(tag);   //tag.text+':'+m.round(tag.value*100/tag.max)+"%";
            radar.autoTipState&&(!radar.hovering)&&hoverLabel(radar.hoverLabel,showPoint,text,style);
        },this.autoOption.time||1000)
    };
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