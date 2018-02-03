/**
 * Title:
 * @author Mr Denzel
 * @create Date 2018-02-03 10:17
 * @version 1.0
 * Description:
 */
(function () {
    var _option = {
        theme: "",
        title: "请选择",
        mode: null,
        initGrand: "",
        initParent: "",
        initChild: "",
        attatchObject: "",
        rows: 3,
        clientWidth:0,
        show: false,
        source: [],
        maxDay: 31,
        beginyear: 2000,                 //日期--年--份开始
        endyear: 2020                  //日期--年--份结束
    };
    var util = {};
    util.createUI = function (title, rows, pos) {
        var link = document.createElement('link');
        link.type ='text/css';
        link.rel = 'stylesheet';
        link.href = './index.css';
        link.id = 'dynamicCreation';
        var lineHeight = '2em';
        var str =
        ' <div class="widget-box">  <div class="select-event">' +
        '       <span class="select-sure">确认</span> 地址选择' +
        '       <span class="select-cancel">取消</span>' +
        '   </div><section class="select-box">' +
        '  <div class="widget-block">' +
        '    <ul class="shadow-line"><li></li><li></li><li class="select-line"></li><li></li><li></li>\n' +
        '    </ul> <ul top="0" class="select-scroll select-grand">' +
        '    </ul></div> ' +
        '  <div class="widget-block">' +
        '    <ul class="shadow-line"><li></li><li></li><li class="select-line"></li><li></li><li></li>\n' +
        '</ul><ul top="0" class="select-scroll select-parent">' +
        '    </ul></div> ' +
        '   <div class="widget-block">' +
        '    <ul class="shadow-line"><li></li><li></li><li class="select-line"></li><li></li><li></li>\n' +
        '</ul><ul top="0" class="select-scroll select-child">' +
        '    </ul></div> ' +
        '        <div class="shadow-line"></div>' +
        '        <div class="shadow-line"></div>' +
        '        <div class="shadow-line"></div>' +
        '        <div class="shadow-line"></div>' +
        '        <div class="shadow-line"></div>' +
        '    </section></div>';
        var wid = document.createElement('div');
        wid.classList.add('select-widget');
        wid.innerHTML = str;
        wid.querySelectorAll('.shadow-line').item((rows-1)/2).classList.add('select-line');
//      document.getElementsByTagName('head')[0].appendChild(styleDom); //加载样式文件
        document.body.appendChild(wid); //加载dom框架
    };
    util.getPos =(e)=>{
        return {
            x:e.screenX || e.changedTouches[0].pageX,
            y:e.screenY || e.changedTouches[0].pageY,
        }
    };
    util.createParent = function (options, selector, rows) {
        var i = 0, str = "";
        for (i = 0; i < (rows - 1) / 2; i++) {
            str += "<li>&nbsp;</li>";
        }
        selector.innerText = '';
        for (i = 0; i < options.length; i++) {
            str += '<li>' + i + '</li>';
        }
        for (i = 0; i < (rows - 1) / 2; i++) {
            str += "<li>&nbsp;</li>";
        }
        selector.setAttribute('maxtop',((options.length-1)*28).toString());
        selector.innerHTML = str;
    }
    util.scrollTo= function (pointer) {
        if(!eve.status){
            return ;
        }
        var nth =Math.floor(pointer.xPos / _option.blockWidth)+1;
        var target =document.querySelector('.widget-block:nth-child('+nth+') .select-scroll');
        var md =pointer.start - pointer.end,top=0,originTop=0;
        originTop = top = Number(target.getAttribute('top'));
        if( Math.abs(md)<5){                                                                                                                                                                                                                                                   
            return ;
        }
        top= top - md;
        var val = top + Number(target.getAttribute('maxtop'));
        if(val< 0){
            top = -1* Number(target.getAttribute('maxtop'));
        }
        if(top>0){
            top = 0;
        }
        top = Math.round(top/28)*28;
      //  this.animate(originTop,top,500,function(t){
        target.style.transform = 'translateY('+top+'px)';
       // });
        target.setAttribute('top',top.toString());
    }
    util.animate=function(start,end,length,tweenFun) {
        var arr = [],count=0,arrLength = 50*length/1000,step = (end-start)/arrLength;
        for (var i=0;i<=arrLength;i++){
            arr.push(start+step*i);
        }
        animate();
        function animate() {
            if(count>arrLength){
                return ;
            }
            tweenFun(arr[count]);
            count++;
            requestAnimationFrame(animate);
        }
    }
    var eve = {};
    eve.status = false; //false：未按状态，true，按下状态;
    eve.type = 'none';
    eve.pointer={
        start:0,
        end:0,
        xPos:0
    };
    eve.getPos =function(e){
        return {
            x:e.screenX || e.changedTouches[0].pageX,
            y:e.screenY || e.changedTouches[0].pageY,
        }
    };
    eve.listen = function (e) {
        var type = e.type;
        if(type === 'mousedown' || type === 'touchstart' ){
            var pos =  eve.getPos(e);
            eve.status = true;
            eve.pointer.end =pos.y;
            eve.pointer.xPos =pos.x;
            eve.pointer.start =eve.pointer.end =pos.y;
        }
        if(type === 'mouseup' || type === 'touchend'  ){
            eve.pointer.end =eve.getPos(e).y;
            util.scrollTo(eve.pointer);
            eve.status = false;
        }
    };
    var iSelect = function () {
        _option.blockWidth =  document.body.scrollWidth/3;
        this.init();
    }
    iSelect.prototype.init = function () {
        var rows = 5;
        util.createUI('时间选择器', rows);
        opt = [1, 2, 3, 4, 5, 6, 7, 8];
        util.createParent(opt, document.querySelector('.select-grand'),rows );
        util.createParent(opt, document.querySelector('.select-parent'),rows);
        util.createParent(opt, document.querySelector('.select-child'), rows);
        var tar = document.querySelector('.select-box');
        
        tar.addEventListener('mousedown',function(e){
            tar.onselectstart = function(){  //取消元素的默认选中事件
                return false;
            };
            eve.listen(e);
        });
        tar.addEventListener('touchstart',function(e){
             tar.onselectstart = function(){  //取消元素的默认选中事件
                return false;
            }; 
            eve.listen(e);
        });
        document.addEventListener('mouseup',eve.listen);
        document.addEventListener('touchend',eve.listen);

    }
    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = iSelect;
    } else if (typeof define === 'function' && define.amd) {
        define(function () {
            return iSelect;
        });
    } else {
        this.iSelect = iSelect;
    }
}).call(function () {
    return this || (typeof window !== 'undefined' ? window : global);
}());