;(function(){
    var m =Math,config ={};
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
        config.target.appendChild(label);
        config.hoverLabel = label;
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
        config.target = target;
        config.option = option;
        config.formatter =autoOption.formatter || function (v) {
            var tag = v.name?'name':'text';
            return v[tag]+':'+v.value;
        };
        this.autoOption = autoOption;
        this.autoOption.intervalId = undefined;
        this.init();
        autoOption.autoShow&&(this.autoStart());
    };
    addAutoTip.prototype.init =function () {
        config.hovering =false;
        config.autoTipState =true;
        config.center ={
            pointx:(config.option.radar.center&&Number(config.option.radar.center[0].substr(0,config.option.radar.center[0].length-1))/100)||0.5,
            pointy:(config.option.radar.center&&Number(config.option.radar.center[1].substr(0,config.option.radar.center[1].length-1))/100)||0.5
        };
        var x=config.target.offsetWidth*config.center.pointx;
        var y=config.target.offsetHeight*config.center.pointy;
        config.pointZero ={
            x:x,
            y:y
        };
        var indicator =config.indicator = config.option.radar.indicator;
        var data = config.option.series[0].data[0].value;
        indicator = indicator.map(function (t,index) {
            t.value = data[index];
            return t;
        });
        var length = indicator.length;
        config.radius= config.option.radar.radius;
        var pointData=config.pointData=[];
        var single = 2*m.PI /length*(-1);
        for(var i = 0;i<length;i++){
            var ratio = data[i]/indicator[i].max;
            pointData.push([config.radius*m.sin(i*single)*ratio,config.radius*m.cos(i*single)*ratio]);
        }
        createLabel();
        /**hover相关设置*/
        this.autoOption.hoverEnable&&(config.target.addEventListener('mousemove',function(event){
            var canvas= config.target.querySelector('canvas');
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
                var text =config.formatter(tag);    //tag.text+':'+m.round(tag.value*100/tag.max)+"%";
                config.hovering =true;
                hoverLabel(config.hoverLabel,mouse,text,style);
            }else{
                config.hovering =false;
                removeLabel(config.hoverLabel);
            }
        }))
    }
    /**以下部分用于消除图表刷新重置数据后，销毁以前创建的label显示dom元素和定时器*/
    addAutoTip.prototype.reset=function () {
        config.hovering =false;
        config.autoTipState =true;
        if(config.target.getElementsByClassName('hoverLabel').length){  //图表刷新重置时
            config.target.removeChild(config.target.getElementsByClassName('hoverLabel')[0]);
        }
        this.autoOption.intervalId&&clearInterval(this.autoOption.intervalId);
        createLabel();
        this.autoStart();
    }
    /**停止自动轮播*/
    addAutoTip.prototype.stop=function () {
        config.autoTipState =false;
    };
    /**开启自动轮播*/
    addAutoTip.prototype.start=function () {
        /**以下部分用于消除图表刷新重置数据后，销毁以前创建的label显示dom元素和定时器*/
        config.autoTipState =true;
    };
    /**手动开启自动轮播*/
    addAutoTip.prototype.autoStart=function () {
        var step=-1;
        var length = config.indicator.length;
        this.autoOption.intervalId=setInterval(function () {
            step = (step+1)%length;
            var showPoint={
                x:config.pointData[step][0]+ config.pointZero.x,
                y:config.pointZero.y-config.pointData[step][1]
            };
            var tag =config.indicator[step];
            var text =config.formatter(tag);   //tag.text+':'+m.round(tag.value*100/tag.max)+"%";
            config.autoTipState&&(!config.hovering)&&hoverLabel(config.hoverLabel,showPoint,text,style);
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
