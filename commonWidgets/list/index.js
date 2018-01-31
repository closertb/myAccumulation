/**
 * Title:
 * @author Mr Denzel
 * @create Date 2017-12-25 14:07
 * @version 1.0
 * Description:
 */
function ScrollList(selector, data) {
    this.$selector = $(selector);
    this.data = data;
    this.scrollLength =4 ;
    this.width = this.$selector.width();
    this.height = this.$selector.height();
    this.moduleHeight = 0;
    this.headHeight = 53;
    this.lineHeight = 45;
    this.intervalTime = 5000;
    this.init();
    this.render(true);  //渲染可视的列表
    this.autoScroll();
    this.render(false,this.scrollLength);   //渲染被隐藏的列表
    this.watchSize();
}

ScrollList.prototype = {
    init: function () {
        var headHeight = 53 ;
        this.appendClass = '';
        if(this.width<405){
            this.appendClass =' small-width';
        }
        if(this.height<233){
            this.appendClass +=' small-height';
            this.lineHeight = 35;
            headHeight = 40;
            if(this.height<175){
                this.scrollLength = 3;
            }
        }
        this.moduleHeight = headHeight + this.lineHeight*this.scrollLength;
        this.initData();
        this.initDom();
    },
    watchSize:function () {
        var _this = this ;
        this.timeOutId = setTimeout( _this.watchSize.bind(_this),100);
        var width = this.$selector.width();
        var height = this.$selector.height(),
            scrollSize = this.scrollLength,
            headHeight = this.headHeight,
            lineHeight = this.lineHeight,
            appendClass =this.appendClass,
            isResize=false;

        //挂载节点显示窗口变
        if(width >420){
            if(this.appendClass.indexOf('small-width')>-1){
                this.appendClass=this.appendClass.replace('small-width','');
                this.$selector.find('.scroll-list').removeClass('small-width');
                isResize = true;
            }
        }else{
            if( width <400 && this.appendClass.indexOf('small-width')===-1 ){
                this.appendClass=this.appendClass + ' small-width';
                this.$selector.find('.scroll-list').addClass('small-width');
                isResize = true;
            }
        }

        //挂载节点显示窗口变大
        if(height >= 233){
            if(this.appendClass.indexOf('small-height')>-1){
                this.appendClass=this.appendClass.replace('small-height','');
                this.$selector.find('.scroll-list').removeClass('small-height');
            }
            headHeight= 53;
            lineHeight= 45;
        }else if(height <=180){
            if( this.appendClass.indexOf('small-height')===-1 ){
                this.appendClass=this.appendClass + ' small-height';
                this.$selector.find('.scroll-list').addClass('small-height');
            }
            headHeight= 39;
            lineHeight= 35;
        }
        scrollSize = Math.floor((height-this.headHeight)/this.lineHeight);
        isResize = this.scrollLength !==scrollSize || lineHeight !== this.lineHeight || headHeight !==this.headHeight ;
        if(isResize){
            this.scrollLength =scrollSize;
            this.lineHeight=lineHeight;
            this.headHeight = headHeight;
        }
        if(this.data.length<this.scrollLength){
            return ;
        }
        isResize && this.update(scrollSize);
    },
    initData:function () {
        var data = this.data ;
        data.forEach(function (t) {
            var num = t.percent + '';
            if(num.indexOf('%')>0){  //如果传递过来的数据带百分比；
                num = t.percent.substr(0,num.length-1)-0;
            }
            if(num<0 || num >100){
                num = Math.abs(num%100);
            }
            t.formatNum = t.limit.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1' + ',');
            t.formatPer = num + '%';
            t.level = 'level-'+Math.ceil( num/20 );
        });
        data.length<this.scrollLength &&(this.scrollLength = data.length) ;
    },
    initDom:function () {
        var html = '<div class="scroll-list '+this.appendClass+'" style="height: '+this.moduleHeight+'px">\n' +
            '        <table class="list-head">\n' +
            '            <tr>\n' +
            '            <td class="list-name">景点名称</td>\n' +
            '            <td class="list-limit">最大承载</td>\n' +
            '            <td class="list-percent">拥挤指数</td>\n' +
            '            </tr>\n' +
            '        </table>\n' +
            '        <table class="list-body"></table></div>';
        this.$selector.append(html);
        this.renderList();
    },
    renderList:function () {
        var listStr ='',$self=this.$selector.find('.list-body');
        if (this.data.length) {
            this.data.forEach(function (t) {
                listStr = listStr + '<tr><td class="list-name">' + t.name + '</td><td class="list-limit">' + t.formatNum + '</td><td class="list-percent list-body-percent">\n' +
                    '                <span class="progress-number">' + t.formatPer + '</span>\n' +
                    '                <span class="progress-bar"><label  class="progress-percent '+t.level+'" data-percent="' + t.formatPer + '"></label></span>\n' +
                    '            </td>\n' +
                    '            </tr>';
            });
        } else {
            listStr = '<tr class="no-data">暂无数据</tr>'
        }
        $self.empty().append(listStr);
    },
    /**
     * 填充柱数据加载：分可视区域加载和隐藏区域加载:后面取消了，性能消耗区别不大
     * params ： [boolean]   是否是可视区域加载
     * 区别： 可视区域加载有加载动画
     *        非可视区域加载无动画，直接加载
     * */
    render: function (loadRender,startNum) {
        var delay = 20, time = 500;
        this.$selector.find('.progress-percent').each(function () {
            var perNum = $(this).data("percent");
            $(this).delay(delay).animate({
                "width": perNum
            }, time);
        });
    },

    update:function (scrollSize) {
        var $self = this.$selector.find('.list-body tr');
        (this.data.length<scrollSize)&&(scrollSize=this.data.length);
        this.scrollLength =scrollSize || 4;
     //   if(this.data.length<=this.scrollLength && this.data.length !== $self.length){
            this.renderList(true);
            this.render(false,0);
    //    }
        clearInterval(this.intervalId);
        this.$selector.find('.scroll-list').css({height:this.headHeight+this.lineHeight*scrollSize});
        this.autoScroll();
    },
    autoScroll: function () {
        var _this = this,num = this.scrollLength,scrollHeight = "-"+this.lineHeight*this.scrollLength+"px";
        var $self = this.$selector.find('.list-body');
        var currentLength = this.data.length;
        if(currentLength <=this.scrollLength ){  //列表过短，就不需要滚动了
            return ;
        }
        //特殊情况，列表需要克隆一次，保证滚动正常；
        if(currentLength < 2*this.scrollLength ){
            $self.append($self.find('tr').clone());
        }
        function setAutoScroll() {
            _this.intervalId = setInterval(function () {
                $self.stop(true).animate({
                    "margin-top": scrollHeight
                }, 1000, function () {
                    $self.css({
                        "margin-top": "0px"
                    }).find('tr:lt('+num+')').appendTo($self);
                });
            }, _this.intervalTime);
        }
        setAutoScroll();
        $self.find('tr').hover(function () {
            (_this.intervalId !== undefined) && clearInterval(_this.intervalId);
        }, function () {
            setAutoScroll();
        });
    }
};