/**
 * Title:
 * @author Mr Denzel
 * @create Date 2017-12-25 14:07
 * @version 1.0
 * Description:
 */
function SpecialScrollList(selector, data) {
    this.$selector = $(selector);
    this.data = data;
    this.scrollLength =4 ;
    this.width = this.$selector.width();
    this.height = this.$selector.height();
    this.moduleHeight = 0;
    this.headHeight = 35;
    this.lineHeight = 60;
    this.intervalTime = 5000;
    this.currentPage = 1;
    this.init();
}

SpecialScrollList.prototype = {
    init: function () {
        this.appendClass = '';
        if(this.height<=220){
            this.appendClass +=' small-height';
            this.lineHeight = 50;
        }
        this.scrollLength = Math.floor((this.height-35-this.headHeight)/this.lineHeight);
        this.moduleHeight = this.headHeight + this.lineHeight*this.scrollLength;

        this._initData();
        this._initDomBg();
        this._renderList(1);
        this._bindEvent();
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
    _initDomBg:function () {
        this.pageSize = Math.ceil(data.length / this.scrollLength);
        var html = ' <div class="special-list-module '+this.appendClass+'"><div class="scroll-list-special" style="height: '+this.moduleHeight+'px"> <div class="special-list-bg">\n' +
            '<table class="special-chart-bg">';
        var trStr = '';
        for(var i=0;i<this.scrollLength;i++){
            trStr =trStr + '            <tr>\n' +
                '                <td></td>\n' +
                '                <td></td>\n' +
                '                <td></td>\n' +
                '                <td class="red"></td>\n' +
                '                <td></td>\n' +
                '            </tr>';
        }
        html = html + trStr + '        </table>\n' +
            '        <div class="special-show-percent">\n' +
            '            <span >0</span>\n' +
            '            <span >20%</span>\n' +
            '            <span >40%</span>\n' +
            '            <span >60%</span>\n' +
            '            <span class="split-red">80%</span>\n' +
            '        </div>        <div class="page_btn_prev"></div>\n' +
            '        <div class="page_btn_next"></div>' +
            '    </div><ul class="special-list-body" style="height: '+(this.moduleHeight-this.headHeight)+'px"></ul></div></div>';
        this.$selector.empty().append(html);
      //  this.renderList();
    },
    _renderList:function () {
        var listStr ='',$self=this.$selector.find('.special-list-body'),pageNo=this.currentPage;
        if (this.data.length>0) {
            for(var i=pageNo*this.scrollLength-this.scrollLength;i<pageNo*this.scrollLength&&i<this.data.length;i++){
                var t=this.data[i];
                listStr = listStr + '        <li>\n' +
                    '            <h4 class="special-scenic-name" title="'+t.name+'">'+t.name+'</h4>\n' +
                    '            <div class="special-scenic-info"><span class="special-scenic-fl">非常舒适：'+t.formatPer +'</span><span class="special-scenic-fr">最大承载量：'+ t.formatNum +'</span></div>\n' +
                    '            <div class="progress-bar">\n' +
                    '                <span class="progress-bar-bg"></span>\n' +
                    '                <span class="progress-percent '+t.level+'" data-percent="'+t.formatPer+'"></span>\n' +
                    '            </div>\n' +
                    '        </li>';
            }
        } else {
            listStr = '<span class="no-data">暂无数据</span>'
        }
        $self.empty().append(listStr);
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
    _bindEvent:function () {
        var _this = this;
        this.$selector.on('click','.page_btn_prev',function () {
            if(_this.currentPage <2){
                return ;
            }
            _this.currentPage = _this.currentPage-1;
            _this._renderList();
        });
        this.$selector.on('click','.page_btn_next',function () {
            if(_this.currentPage === _this.pageSize){
                return ;
            }
            _this.currentPage = _this.currentPage+1;
            _this._renderList();
        })
    },
    _watchSize:function () {
        var _this = this ;
        this.timeOutId = setTimeout( _this._watchSize.bind(_this),100);
        var height = this.height = this.$selector.height(),
            lineHeight = this.lineHeight,
            appendClass =this.appendClass;
        if(height <= 220){
            lineHeight = 50;
            appendClass = ' small-height';
        }
        if(height >= 310){
            lineHeight = 60;
            appendClass = '';
        }
        var scrollSize = Math.floor((height-35-this.headHeight)/this.lineHeight);
        if(scrollSize !== this.scrollLength || this.lineHeight !==lineHeight){
            this.lineHeight =lineHeight;
            this.scrollLength = scrollSize;
            this.appendClass = appendClass;
            this.moduleHeight = this.headHeight + this.lineHeight*this.scrollLength;
            this.update();
        }
    },
    update:function () {
        this.currentPage = 1;
        clearTimeout(this.timeOutId);
        this._initDomBg();
        this._renderList();
        this._bindEvent();
        this._watchSize();
    }
};