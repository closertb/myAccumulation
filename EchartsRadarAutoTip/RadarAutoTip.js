;(function () {
    var m = Math;
    var style = {
        color: '#fff',
        border: '0px solid rgb(51,51,51)',
        borderRadius: '4px',
        backgroundColor: 'rgba(0,0,0,0.8)'
    };
    var RadarAutoTip = function (target, option, autoOption) {
        this.config = {};
        this.config.target = target;
        this.config.option = option;
        this.config.formatter = autoOption.formatter || function (v) {
            var tag = v.name ? 'name' : 'text';
            return v[tag] + ':' + v.value;
        };
        this.autoOption = autoOption;
        this.autoOption.intervalId = undefined;
        this.init(this.config);
        autoOption.autoShow && (this.autoStart(this.config));
        /**hover相关设置*/
        autoOption.hoverEnable && (this.enableHover(this.config));
    };
    /**给初始化后的echarts对象绑定一个自动轮播的属性
     * @parame chart ：初始化后的echarts对象
     * @parame target ：echarts对象挂载的dom元素
     * @parame option ： echarts对象的option配置
     * @parame autoOption ：配置你自己的autoOption
     */
    RadarAutoTip.create=function (chart, target, option, autoOption) {
        if (!chart.hasOwnProperty('radarAutoTip')) {
            chart.radarAutoTip = new RadarAutoTip(target, option, autoOption);
        } else {
            chart.radarAutoTip.reset(option);
        }
    };
    RadarAutoTip.prototype = {
        init: function (opt) {
            opt.hovering = false;
            opt.autoTipState = true;
            opt.center = {
                pointx: (opt.option.radar.center && Number(opt.option.radar.center[0].substr(0, opt.option.radar.center[0].length - 1)) / 100) || 0.5,
                pointy: (opt.option.radar.center && Number(opt.option.radar.center[1].substr(0, opt.option.radar.center[1].length - 1)) / 100) || 0.5
            };
            var x = opt.target.offsetWidth * opt.center.pointx;
            var y = opt.target.offsetHeight * opt.center.pointy;
            opt.pointZero = {
                x: x,
                y: y
            };
            var indicator = opt.indicator = opt.option.radar.indicator;
            var data = opt.option.series[0].data[0].value;
            indicator = indicator.map(function (t, index) {
                t.value = data[index];
                return t;
            });
            var length = indicator.length;
            opt.radius = opt.option.radar.radius;
            var pointData = opt.pointData = [];
            var single = 2 * m.PI / length * (-1);
            for (var i = 0; i < length; i++) {
                var ratio = data[i] / indicator[i].max;
                pointData.push([opt.radius * m.sin(i * single) * ratio, opt.radius * m.cos(i * single) * ratio]);
            }
            this.createLabel();
        },
        /**
         * 辅助函数:
         *     获取鼠标在canvas画布上的位置(**不是浏览器窗口的鼠标位置)
         * clientX获取的相对浏览器窗口左上角的位置，适用于所有浏览器
         * 在chrome浏览器中，有一个zrX属性，是相对于元素本身的相对位置
         * getBoundingClientRect()函数是获取元素边框相对于浏览器窗口的位置
         * */
        getMousePos: function (canvas, event) {
            var rect = canvas && canvas.getBoundingClientRect();
            if (rect) {
                return {
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top
                }
            } else {
                return {
                    x: event.clientX,
                    y: event.clientY
                }
            }
        },
        /**自动轮播hoverLabel Dom 元素的生成*/
        createLabel: function () {
            var label = document.createElement('div');
            label.setAttribute('class', 'hoverLabel');
            label.style.position = 'absolute';
            label.style.display = 'none';
            this.config.target.appendChild(label);
            this.config.hoverLabel = label;
        },
        /**动态设置单轴显示标签的样式和数据
         * @param：参数
         * @label：要动态修改的dom元素
         * @point：label元素相对于canvas画布的位置
         * @text：label元素要显示的值
         * @style：label元素文字的显示样式
         * */
        hoverLabel: function (label, point, text, style) {
            var cssText = "position: absolute; display: inline-block; top: " + (point.y - 37) + "px; left:" + point.x + "px; border:" + style.border + "; font-variant: normal;" +
                "font-stretch: normal; font:normal 14px; line-height: normal  '微软雅黑'; box-sizing: border-box; padding: 5px;" +
                " color:" + style.color + "; border-radius: 4px; background-color:" + style.backgroundColor + "; transition: left 0.4s cubic-bezier(0.23, 1, 0.32, 1), top 0.4s cubic-bezier(0.23, 1, 0.32, 1);" +
                " transform: translate(-50%, 0px); z-index: 999;";
            label.innerHTML = text;
            label.style.cssText = cssText;
            var triangle = document.createElement('label');
            cssText = "width: 0px; height: 0px; position: absolute; left: 50%; top: 99%; margin-left: -5px;" +
                " border-left: 5px solid transparent; border-right: 5px solid transparent;" +
                " border-top: 5px solid " + style.backgroundColor + ";";
            triangle.style.cssText = cssText;
            label.appendChild(triangle);
        },
        removeLabel: function (dom) {
            dom.style.display = 'none';
        },
        reset: function () {
            this.config.hovering = false;
            this.config.autoTipState = true;
            if (this.config.target.getElementsByClassName('hoverLabel').length) {  //图表刷新重置时
                this.config.target.removeChild(config.target.getElementsByClassName('hoverLabel')[0]);
            }
            this.autoOption.intervalId && clearInterval(this.autoOption.intervalId);
            this.createLabel();
            this.autoStart();
        },
        /**停止自动轮播*/
        stop: function () {
            this.config.autoTipState = false;
        },
        /**开启自动轮播*/
        start: function () {
            /**以下部分用于消除图表刷新重置数据后，销毁以前创建的label显示dom元素和定时器*/
            this.config.autoTipState = true;
        },
        /**手动开启自动轮播*/
        autoStart: function () {
            var step = -1;
            var length = this.config.indicator.length;
            var that = this;
            this.autoOption.intervalId = setInterval(function () {
                step = (step + 1) % length;
                var showPoint = {
                    x: that.config.pointData[step][0] + that.config.pointZero.x,
                    y: that.config.pointZero.y - that.config.pointData[step][1]
                };
                var tag = that.config.indicator[step];
                var text = that.config.formatter(tag);   //tag.text+':'+m.round(tag.value*100/tag.max)+"%";
                that.config.autoTipState && (!that.config.hovering) && that.hoverLabel(that.config.hoverLabel, showPoint, text, style);
            }, this.autoOption.time || 1000)
        },
        enableHover:function (opt) {
            var that = this;
            opt.target.addEventListener('mousemove', function (event) {
                var canvas = opt.target.querySelector('canvas');
                var mouse = that.getMousePos(canvas, event);
                var point = {};
                var index = -1;
                var r = 5; //hover 捕捉的精度
                point.x = mouse.x - opt.pointZero.x;
                point.y = opt.pointZero.y - mouse.y;
                for (var i = 0; i < opt.pointData.length; i++) {
                    var item = opt.pointData[i];
                    if (point.x > (item[0] - r) && point.x < (item[0] + r) && point.y > (item[1] - r) && point.y < (item[1] + r)) {
                        index = i;
                        break;
                    }
                }
                if (index !== -1) {
                    var tag = opt.indicator[index];
                    var text = opt.formatter(tag);    //tag.text+':'+m.round(tag.value*100/tag.max)+"%";
                    opt.hovering = true;
                    that.hoverLabel(opt.hoverLabel, mouse, text, style);
                } else {
                    opt.hovering = false;
                    that.removeLabel(opt.hoverLabel);
                }
            })
        }
    };
    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = RadarAutoTip;
    } else if (typeof define === 'function' && define.amd) {
        define(function () {
            return RadarAutoTip;
        });
    } else {
        this.RadarAutoTip = RadarAutoTip;
    }

}).call(function () {
    return this || (typeof window !== 'undefined' ? window : global);
}());
