/**
 * Title:
 * @author Mr Denzel
 * @create Date 2017-12-25 14:07
 * @version 1.0
 * Description:
 */
function SimpleList(selector, data,option) {
    var defaultOption={
        rankColor:'#3e98ff',
        highRankColor:'#9364ff',
        fillColor:'background-image: linear-gradient(to right,#1f88ff,#a664ff)',  //css 语句
    };
    option&&Object.keys(option).map(function (t) {
        console.log(t);
       if(defaultOption.hasOwnProperty(t)&&option[t]){
           defaultOption[t] = option[t];
       }
    });
    this.option = defaultOption;
    console.log(this.option);
    this.$selector = $(selector);
    this.unit = data.unit;
    this.data = data.datas;
    this.scrollLength =5 ;
    this.baseLength =5;
    this.width = this.$selector.width();
    this.height = this.$selector.height();
    this.moduleHeight = 0;
    this.headHeight = 59; //33的padding 24的单位高度
    this.lineHeight = 50;
    this.intervalTime = 5000;
    this.currentPage = 1;
    this.init();
}
SimpleList.prototype = {
    init: function () {
        this.appendClass = '';
        if(this.height<=220){
            this.appendClass +=' small-height';
            this.headHeight = 53;
            this.lineHeight = 41;  //33的padding 20的单位高度
            this.baseLength =4;
        }
        this.scrollLength = Math.floor((this.height-this.headHeight)/this.lineHeight/this.baseLength)*this.baseLength;
        this.moduleHeight = this.lineHeight*this.scrollLength;

        this._initData();
        this._renderList();
        this._autoScroll();
        this._watchSize();
    },
    _initData:function () {
        var data = this.data ;
        this.data = data.map(function (t) {
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
            return t;
        });
    },
    _renderList:function () {
        var _this=this,
            totalLength = Math.ceil(this.data.length / this.scrollLength)*this.scrollLength,
            fillExpression=this.option.fillColor;
        var html='<div class="simple-list-module '+this.appendClass+'">\n' +
            '    <div class="simple-list-unit">\n' +
            '        单位：' +this.unit+
            '    </div>\n' +
            '<div class="simple-list-shadow" style="height:'+this.moduleHeight+'px"><ul class="simple-list-body">';
        if (this.data.length>0) {
            this.data.forEach(function (t,index) {
                var rank = index<9 ? ('No.0'+(index+1)):'No.'+(index+1);
                var rankColor = index<3 ? _this.option.highRankColor:_this.option.rankColor;
                html = html +'        <li>\n' +
                    '            <div class="simple-list-info">\n' +
                    '                <span class="fl">'+t.name+'</span>\n' +
                    '                <span class="fr">'+t.formatNum+'</span>\n' +
                    '            </div>\n' +
                    '            <div class="simple-list-rank">\n' +
                    '                <i class="rank-num" style="color: '+rankColor+'">'+rank+'</i>\n' +
                    '                <div class="progress-bar">\n' +
                    '                    <span class="progress-percent" style="'+fillExpression+'" data-percent="'+t.percent+'"></span>\n' +
                    '                </div>\n' +
                    '            </div>\n' +
                    '        </li>';
            })
        } else {
            html = html +'<span class="no-data">暂无数据</span>'
        }
        //特殊情况，填充空白li标签，保证滚动正常；
        if(this.data.length< totalLength){
            for(var i= this.data.length;i<totalLength;i++){
                html = html + '<li></li>';
            }
        }
        html = html +'</ul></div></div>';
        this.$selector.empty().append(html);
        this._render();
    },
    /**
     * 填充柱数据加载：分可视区域加载和隐藏区域加载
     * params ： [boolean]   是否是可视区域加载
     * 区别： 可视区域加载有加载动画
     *        非可视区域加载无动画，直接加载
     * */
    _render: function () {
        var that = this, delay = 20, time = 500;
        this.$selector.find('.progress-percent').each(function () {
            var perNum = $(this).data("percent");
            $(this).delay(delay).animate({
                "width": perNum
            }, time);
        });
    },
    _watchSize:function () {
        var _this = this ;
        this.timeOutId = setTimeout( _this._watchSize.bind(_this),100);
        var height = this.height = this.$selector.height(),
            lineHeight = this.lineHeight,
            appendClass =this.appendClass;
        if(height <= 220){
            lineHeight = 41;
            appendClass = ' small-height';
        }
        if(height >= 310){
            lineHeight = 50;
            appendClass = '';
        }
        var scrollSize = Math.floor((this.height-this.headHeight)/lineHeight/this.baseLength)*this.baseLength;
        if(scrollSize !== this.scrollLength){
            this.lineHeight =lineHeight;
            this.scrollLength = scrollSize;
            this.appendClass = appendClass;
            this.moduleHeight = this.lineHeight*this.scrollLength;
            this.update();
        }
    },
    update:function () {
        clearTimeout(this.timeOutId);
        this._renderList();
        this._autoScroll();
        this._watchSize();
    },
    _autoScroll: function () {
        var _this = this,num = this.scrollLength,scrollHeight = "-"+this.lineHeight*this.scrollLength+"px";
        var $self = this.$selector.find('.simple-list-body');
        if(this.data.length <=this.scrollLength ){  //列表过短，就不需要滚动了
            return ;
        }
        this.intervalId&&clearInterval(this.intervalId);
        function setAutoScroll() {
            _this.intervalId = setInterval(function () {
                $self.stop(true).animate({
                    "margin-top": scrollHeight
                }, 1000, function () {
                    $self.css({
                        "margin-top": "0px"
                    }).find('li:lt('+num+')').appendTo($self);
                });
            }, _this.intervalTime);
        }
        setAutoScroll();
        $self.find('li').hover(function () {
            (_this.intervalId !== undefined) && clearInterval(_this.intervalId);
        }, function () {
            setAutoScroll();
        });
    }
}