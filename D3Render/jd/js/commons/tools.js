function autoShowToolTip(chart, option, interval, params) {
    var currentIndex = -1;
    var timeTicket = 0;
    function autoShowTip() {
        timeTicket = setInterval(function () {
            var series = option.series;
            var dataLen = series[0].data.length;
            var refreshed = false;
            var chartType = series[0].type;

            //数据轮播
            if(params && params.isRefresh && currentIndex === 0) {
                params.refreshOption();
                chart.setOption(option);
                refreshed = true;
            }

            //第一次
            if(currentIndex < 0) {
                currentIndex = 0;
            }

            var tipParams = {seriesIndex: 0};
            switch(chartType) {
                case 'map':
                case 'pie':
                case 'chord':
                    tipParams.name = series[0].data[currentIndex].name;
                    break;
                default:
                    tipParams.dataIndex = currentIndex;
                    break;
            }

            if(chartType === 'pie') {
                if (!refreshed) {
                    // 取消之前高亮的图形
                    chart.dispatchAction({
                        type: 'downplay',
                        seriesIndex: 0,
                        dataIndex: currentIndex === 0 ? dataLen - 1 : currentIndex - 1
                    });
                }

                // 高亮当前图形
                chart.dispatchAction({
                    type: 'highlight',
                    seriesIndex: 0,
                    dataIndex: currentIndex
                });
            }

            // 显示 tooltip
            tipParams.type = 'showTip';
            chart.dispatchAction(tipParams);

            currentIndex = (currentIndex + 1) % dataLen;
        }, interval);
    }

    autoShowTip();

    function chatMouseMove() {
        clearInterval(timeTicket);
        timeTicket = 0;
    }
    chart.on('mousemove', chatMouseMove);

    var zRender = chart.getZr();
    function zRenderMouseMove(param) {
        if (param.event) {
            //阻止canvas上的鼠标移动事件冒泡
            param.event.cancelBubble = true;
        }

        if (timeTicket) {
            clearInterval(timeTicket);
            timeTicket = 0;
        }
    }
    zRender.on('mousemove', zRenderMouseMove);

    function zRenderGlobalOut() {
        if (!timeTicket) {
            autoShowTip();
        }
    }
    zRender.on('globalout', zRenderGlobalOut);

    return {
        clearTimeTicket: function() {
            clearInterval(timeTicket);

            chart.off('mousemove', chatMouseMove);
            zRender.off('mousemove', zRenderMouseMove);
            zRender.off('globalout', zRenderGlobalOut);
        }
    };
};



/**
 * Created by chengwb on 2016/8/6.
 * 备注：
 *  命名规则：函数的名称应该使用动词+名词，变量名则最好使用名词。
 *      常量区变量请全部用大写字母,且单词间用下划线链接；
 *      方法名、普通变量名请使用小驼峰命名规则，即除了第一个单词的首字母外其余单词首字母大写。
 */
(function (global, $) {
    global.tools = global.tools || {};

    /***********************************************************
     *********************** 常量区 *****************************
     **********************************************************/
    //暂无数据
    global.tools.NO_DATA = '<p class="no_data">暂无数据！</p>';
    global.tools.NO_DATA1 = '<p class="no_data1">暂无数据！</p>';
    //获取数据失败，刷新页面
    global.tools.TRY_REFRESH = '<p class="try_refresh">获取服务器数据失败，请尝试刷新浏览器页面！</p>';
    //导航
    global.tools.NAVNO_DATA = '<p class="navError">暂无数据！</p>';
    global.tools.NAVERROR = '<p class="navError">获取服务器数据失败，请尝试刷新浏览器页面！</p>';

    //en
    global.tools.NO_DATA_EN = '<p class="no_data">No Data!</p>';
    global.tools.NO_DATA1_EN = '<p class="no_data1">No Data!</p>';
    //获取数据失败，刷新页面
    global.tools.TRY_REFRESH_EN = '<p class="try_refresh">Server Error! It is under repair, please try again later.</p>';
    //导航
    global.tools.NAVNO_DATA_EN = '<p class="navError">No Data!</p>';
    global.tools.NAVERROR_EN = '<p class="navError">Server Error! It is under repair, please try again later.</p>';

    //mongol
    global.tools.NO_DATA_MONG = '<p class="no_data">暂无数据！mongol</p>';
    global.tools.NO_DATA1_MONG = '<p class="no_data1">暂无数据！mongol</p>';
    //获取数据失败，刷新页面
    global.tools.TRY_REFRESH_MONG = '<p class="try_refresh">获取服务器数据失败，请尝试刷新浏览器页面！mongol</p>';
    //导航
    global.tools.NAVNO_DATA_MONG = '<p class="navError">暂无数据！</p>';
    global.tools.NAVERROR_MONG = '<p class="navError">获取服务器数据失败，请尝试刷新浏览器页面！mongol</p>';

    /***********************************************************
     *********************** 方法区 *****************************
     **********************************************************/
    /**
     * 正在加载中提示
     * @param option
     *  可以是对象
     *  {
     *      selector: '',//选择器
     *      position: ''//插入的位置（相对于选择器而言）before/in/after,前、中、后
     *      lang: 'en/cn/mongol'
    *  }
     *  也可以是字符串(表示selector，插入位置默认为in)
     * @param custom 回调函数，可以加工loadTip也可以自定义提示
     * @returns {{clean: clean}} 如果自定义loadTip则clean可能无效，需要自己根据自定义的tip进行清空处理（先使用着，待完善处理）
     */
    global.tools.loading = function (option, custom) {
        debugger;
        var info;
        switch (option.lang) {
            case 'cn':
                info = "数据加载中...";
                break;
            case 'en':
                info = "loading...";
                break;
            case 'mongol':
                info = "数据加载中...mongol";
                break;
            default://默认中文
                info = "数据加载中...";
                break;
        }

        var loadTip = '<div class="loading_tips"><img src="public/images/loading_max.gif"/><p>' + info + '</p></div>';
        if (custom && $.isFunction(custom)) {
            loadTip = custom(loadTip);
        }

        if(typeof option === 'string') {
            $(option).append(loadTip);
        } else {
            switch (option.position) {
                case 'in':
                    $(option.selector).append(loadTip);
                    break;
                case 'after':
                    $(option.selector).after(loadTip);
                    break;
                case 'before':
                    $(option.selector).before(loadTip);
                    break;
                default:
                    $(option.selector).append(loadTip);
                    break;
            }
        }

        function clean() {
            if(typeof option === 'string') {
                $(option + ' .loading_tips').remove();
            } else {
                switch (option.position) {
                    case 'in':
                        $(option.selector + ' .loading_tips').remove();
                        break;
                    case 'after':
                    case 'before':
                        $(option.selector).siblings('.loading_tips').remove();
                        break;
                    default:
                        $(option.selector + ' .loading_tips').remove();
                        break;
                }
            }
        }

        return {
            clean: clean
        };
    };

    /**
     * 内容长度限制，转换为省略号结尾
     * @param content 目标内容
     * @param length 限制的长度
     * @returns {*} 超过限制长度的数据则返回限制长度的字符串加上...，没超过则原文返回
     */
    global.tools.ellipsisContent = function (content, length) {
        var result;
        if (!content || typeof content !== 'string' ||
            typeof length !== 'number' || content.length <= length || length <= 0) {
            result = content;
        } else {
            result = content.substr(0, length) + "...";
        }
        return result;
    };

    global.tools.webCheck=function(url){
        var thisOS = navigator.platform;
        var os = new Array("iPhone", "iPod", "iPad", "android", "Nokia", "SymbianOS", "Symbian", "Windows Phone", "Phone", "Linux armv71", "MAUI", "UNTRUSTED/1.0", "Windows CE", "BlackBerry", "IEMobile");
        for (var i = 0; i < os.length; i++) {
            if (thisOS.match(os[i])) {
                window.location = url;
            }
        }
        if (navigator.platform.indexOf('iPad') != -1) {
            window.location= url;
        }
        var check = navigator.appVersion;
        if (check.match(/linux/i)) {
            if (check.match(/mobile/i) || check.match(/X11/i)) {
                window.location = url;
            }
        }
    }
    /**
     * 图片加载异常时调用，一般用于img中的onerror=tools.errImg(this)
     * @param tag
     */
    global.tools.errImg = function (el, lang) {
        switch (lang) {
            case 'cn':
                el.src = "/images/bad.jpg";
                break;
            case 'en':
                el.src = "/images/bad.jpg";
                break;
            case 'mongol':
                el.src = "/images/bad.jpg";
                break;
            default://默认中文
                el.src = "/images/bad.jpg";
                break;
        }

        el.onerror = null;
    };

    /**
     * 内蒙古banner图片加载异常时调用
     * @param el
     */
    global.tools.errBannerImg = function (el) {
        el.src = "public/images/news_list_banner.jpg";
        el.onerror = null;
    };

    /**
     * 瀑布流图片加载异常时调用，一般用于img中的onerror
     * @param el 当前图片元素
     * @param defaultHeight 设置该元素的高度，默认为bad.jpg的高度
     */
    global.tools.waterfallErrImg = function (el, defaultHeight, lang) {
        defaultHeight = defaultHeight || 240;//240px为bad.jpg的高度
        $(el).height(defaultHeight);

        switch (lang) {
            case 'cn':
                el.src = "/images/bad.jpg";
                break;
            case 'en':
                el.src = "/images/bad.jpg";
                break;
            case 'mongol':
                el.src = "/images/bad.jpg";
                break;
            default://默认中文
                el.src = "/images/bad.jpg";
                break;
        }

        el.onerror = null;
    };

    /**
     *百度分享
     */
    global.tools.share = function () {
        window._bd_share_config = {
            "common": {
                "bdSnsKey": {},
                "bdText": "",
                "bdMini": "2",
                "bdDesc": "",
                "bdMiniList": false,
                "bdPic": "",
                "bdUrl": "",
                "bdStyle": "2",
                "bdSize": "16"/*,
                 "bdPopupOffsetLeft": "30"*/
            },
            "share": {}
        };
        with (document)0[(getElementsByTagName('head')[0] || body).appendChild(createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5)];
        try{
            window._bd_share_main.init();
        }catch (e){}
    };

    /**
     * 日期处理，
     * @param dataStr 需要处理的日期字符串，如果不传递则默认为当前时间
     * @returns {{getCurrentYear: getCurrentYear, getCurrentMonth: getCurrentMonth, renderYears: renderYears, renderMonths: renderMonths}}
     */
    global.tools.date = function (time) {
        var year = 1970;
        var month = 1;
        var day = 1;
        var date = new Date();
        //var reg = new RegExp("-");//火狐不兼容

        if (time) {
            if (typeof time === 'string') {
                date = new Date(time.replace(/-/g, "/"));
            } else if (typeof time === 'number') {
                date = new Date(time);
            }
        }

        year = date.getFullYear();
        month = date.getMonth() + 1;
        day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var week = date.getDay();

        function getCurrentYear() {
            return year;
        }

        function getCurrentMonth() {
            return month;
        }

        function getDay() {
            return day;
        }

        function getHour() {
            return hours;
        }

        function getDate(separator) {
            return year + separator + month + separator + day;
        }

        function getTime() {
            return (hours < 10 ? ('0' + hours) : hours) + ':' +
                (minutes < 10 ? ('0' + minutes) : minutes) + ':' +
                (seconds < 10 ? ('0' + seconds) : seconds);
        }

        function getWeek() {
            var weekDesc = '星期';

            switch (week) {
                case 1:
                    weekDesc += '一';
                    break;
                case 2:
                    weekDesc += '二';
                    break;
                case 3:
                    weekDesc += '三';
                    break;
                case 4:
                    weekDesc += '四';
                    break;
                case 5:
                    weekDesc += '五';
                    break;
                case 6:
                    weekDesc += '六';
                    break;
                case 0:
                    weekDesc += '日';
                    break;
                default:
                    break;
            }
            return weekDesc;
        }

        /**
         * 渲染select的选项
         * @param select select的选择器
         * @param from 从哪一年开始，不设置默认是1970
         * @param to   到那一年，不设置默认为当前年份
         */
        function renderYears(select, from, to) {
            var options = '';
            var startYear = 1970;
            var endYear = year;
            var $select = $(select);

            if (from && $.isNumeric(from)) {
                startYear = from;
            }
            if (to && $.isNumeric(to)) {
                endYear = to;
            }

            var i = endYear;
            for (i; i >= startYear; i--) {
                options += '<option value="' + i + '">' + i + '年</option>';
            }

            $select.empty();
            $select.append(options);
        }

        /**
         * 渲染select的选项
         * @param select select的选择器
         * @param from 从哪一年开始，不设置默认是1970
         * @param to   到那一年，不设置默认为当前年份
         */
        function renderSpecialYears(select, years) {
            var options = '';
            var $select = $(select);

            var i = 0;
            var length = years.length;
            for (i = 0; i < length; i++) {
                options += '<option value="' + years[i] + '">' + years[i] + '年</option>';
            }

            $select.empty();
            $select.append(options);
        }

        /**
         * 渲染select中月份选项
         * @param select select的选择器
         * @param assignYear 指定那一年，没指定则1-12月
         */
        function renderMonths(select, assignYear) {
            var options = '';
            var startMonth = 1;
            var endMonth = 12;
            var $select = $(select);

            if (assignYear && $.isNumeric(assignYear)) {
                if (year == assignYear) {
                    endMonth = month;
                }
            }

            var i = startMonth;
            for (i; i <= endMonth; i++) {
                options += '<option value="' + i + '">' + i + '月</option>';
            }

            $select.empty();
            $(select).append(options);

            if (assignYear && $.isNumeric(assignYear)) {
                if (year == assignYear) {
                    $select.val(month);
                }
            }
        }

        /**
         * 格式化时间
         * @param format 默认为'yyyy-MM-dd hh:mm'
         * @returns {*}
         */
        function format(format) {
            if(!format) {
                format = 'yyyy-MM-dd hh:mm';
            }
            var time = {
                "M+": month,
                "d+": day,
                "h+": hours,
                "m+": minutes,
                "s+": seconds,
                "q+": Math.floor((month + 2) / 3),
                "S+": date.getMilliseconds()
            };
            if (/(y+)/i.test(format)) {
                format = format.replace(RegExp.$1, (year + '').substr(4 - RegExp.$1.length));
            }
            for (var k in time) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length === 1 ?
                        time[k] : ("00" + time[k]).substr(("" + time[k]).length));
                }
            }
            return format;
        }

        return {
            format: format,
            getYear: getCurrentYear,
            getMonth: getCurrentMonth,
            getDay: getDay,
            getTime: getTime,
            getDate: getDate,
            getHour: getHour,
            getWeek: getWeek,
            renderYears: renderYears,
            renderSpecialYears: renderSpecialYears,
            renderMonths: renderMonths
        };
    };

    /**
     * 格式化数字，例如：12300400格式化为12,300,400
     * @param number
     */
    global.tools.formatDigital = function (number) {
        var result = number;

        if (!number || !$.isNumeric(number)) {
            return result;
        }

        var numberStr = number.toString();
        var pointIndex = numberStr.indexOf('.');
        var lastIndex = numberStr.length - 1;

        if (pointIndex >= 0) {
            lastIndex = pointIndex - 1;
        }

        result = '';
        var count = 1;
        for (var i = lastIndex; i >= 0; i--, count++) {
            var temp = numberStr[i];

            result = temp + result;
            if (count % 3 === 0 && i !== 0) {
                result = ',' + result;
            }
        }

        return result;
    };

    /**
     * 初始定位侧边悬浮导航。注意使用时，侧边导航栏高度请设置为auto。
     * @param options
     * {
	 *  wrapper: 外框选择器（包含侧边栏和内容区）
	 *  head：头部，没有则设置为空；
	 *  foot: 底部，没有则设置为空；
	 *  contentStartIndex: 内容列表有效起始索引；
	 *  navStartIndex: 导航栏列表有效起始索引;
	 *  sideNav: 导航栏选择器，例子id:'#nav',class:'.nav'
	 *  sideNavEntry: 导航栏列表选择器，例子li元素：'li',class:'.entry'；（与sideNav是父子关系）
	 *  content: 内容区选择器
	 *  contentEntry: 内容区列表选择器（与content是父子关系）;
	 *  selectClass: 选中的侧边导航栏的选项class，如：'curr';
	 *  currIndex: 设置默认选中的导航栏索引,-1表示不设置；
	 *  scrollAnimate: true则使用动画，false为不使用，默认为使用动画;
	 *  position: 侧边导航栏原始定位方式，absolute(float布局)，relative（非float布局）
	 * }
     */
    global.tools.sideNavInit = function (options) {
        //待检查参数
        var animate = !!options.scrollAnimate || true;
        var headHeight = options.head ? $(options.head).height() : 0;
        var footHeight = options.foot ? $(options.foot).height() : 0;
        var windowHeight = $(window).height();
        var sideNavHeight = windowHeight - headHeight;
        var clickIndex = -1; //导航栏鼠标点击的元素的索引
        var contentStartIndex = options.contentStartIndex;//内容列表起始索引
        var navStartIndex = options.navStartIndex;//导航栏列表起始索引
        var $sideNav = $(options.sideNav);
        var sideNavInitHeight = $sideNav.height();
        var $sideNavLi = $(options.sideNav + ' > ' + options.sideNavEntry);
        var $contentLi = $(options.content + ' > ' + options.contentEntry);
        var selectClass = options.selectClass;
        var defaultIndex = options.currIndex;

        var nav2HeadDistance = $sideNav.offset().top - headHeight;//侧边导航栏到头部的距离
        var scrollDistance = 0;//滚动条滚动的距离

        //设置左边导航的高度,
        if (sideNavHeight > sideNavInitHeight) {
            $sideNav.css("height", sideNavHeight);
        } else {
            sideNavHeight = sideNavInitHeight + footHeight;
            $sideNav.css("height", sideNavHeight);
        }

        /**
         * 窗口自动定位
         */
        function clickPosition() {
            var targetIndex = clickIndex - navStartIndex + contentStartIndex;
            var entryTop = $contentLi.eq(targetIndex).offset().top;

            scrollWindow(entryTop, function () {
                if (clickIndex > -1) {
                    $sideNavLi.eq(clickIndex).addClass(selectClass).siblings('.' + selectClass).removeClass(selectClass);
                    clickIndex = -1;
                }
            });
        }

        /**
         * 滚动窗口
         * @param scrollTop 窗口滚动的距离
         * @param done 滚动完成后的回调
         */
        function scrollWindow(scrollTop, done) {
            if (animate) {
                $('html, body').stop(true).animate({
                    scrollTop: scrollTop - headHeight
                }, {
                    duration: 200,
                    always: done //动画不管完没完成总是会执行这个回调
                });
            } else {
                //不使用动画
                $('html, body').scrollTop(scrollTop - headHeight);
                done();
            }
        }

        /**
         * 图片加载过程中，定位校正
         */
        function regulatePosition() {
            var selectedNavIndex = $sideNav.find('.' + selectClass).index();
            var length = $contentLi.length;
            var absIndex = selectedNavIndex - navStartIndex;
            var sideNavTop = $sideNav.offset().top;
            var mistake = 5;//误差范围，浏览器滚动一次长度不一致

            var currContentTop = $contentLi.eq(absIndex + contentStartIndex).offset().top;
            var nextContentTop = absIndex < length - 1 ? $contentLi.eq(absIndex + 1 + contentStartIndex).offset().top : 99999;

            if (sideNavTop >= currContentTop - mistake &&
                sideNavTop < nextContentTop - mistake) {

                return;
            }

            scrollWindow(currContentTop, function () {
                $sideNavLi.eq(selectedNavIndex).addClass(selectClass).siblings('.' + selectClass).removeClass(selectClass);
            });
        }

        //导航栏点击事件
        $sideNav.on("click", options.sideNavEntry, function () {
            clickIndex = $(this).index();

            //如果点击的导航栏条目的index小于有效的导航栏起始index则不处理，即不是有效的栏目就不处理事件
            if (clickIndex < navStartIndex) {
                return;
            }

            //自动对齐导航栏和内容
            clickPosition();
        });

        //窗口大小变化事件，动态修改侧边栏位置
        $(window).on('resize', function () {
            //如果侧边导航栏是处于悬浮状态则动态修改位置
            if ($sideNav.css('position') === 'fixed') {
                var left = $(options.wrapper).offset().left;
                $sideNav.css({left: left + 'px'});
            }
        });

        $(window).on("scroll", function () {
            scrollDistance = $(document).scrollTop();

            //如果窗口的滚动距离大于了侧边导航栏到头部的距离则悬浮侧边导航栏
            if (scrollDistance > nav2HeadDistance) {
                var left = $(options.wrapper).offset().left;
                var footTop = footHeight === 0 ? $('html').height() : $(options.foot).offset().top;

                //左侧导航栏数据区域的底部抵达foot的时候，如果用户继续往下滚动则保持左侧导航栏数据区底部与foot相切
                var distance = (scrollDistance + headHeight + sideNavInitHeight) - footTop;
                if (distance > 0) {
                    $sideNav.css({position: "fixed", top: (headHeight - distance) + "px", left: left + 'px'});
                } else {
                    $sideNav.css({position: "fixed", top: headHeight + "px", left: left + 'px'});
                }
            } else {
                if ($sideNav.css('position') !== 'absolute') {
                    $sideNav.css({position: 'absolute', top: "0", left: '0'});
                }
            }

            //根据窗口滚动情况动态设置左边导航栏的选中项
            autoSelectNav();
        });

        /**
         * 左侧导航栏根据窗口滚动情况自动选择选项
         */
        function autoSelectNav() {
            var length = $contentLi.length;
            var sideNavTop = $sideNav.offset().top;
            var mistake = 5;//误差范围，浏览器滚动一次长度不一致

            //当左侧导航栏的位置在右边内容列表的某个条目内，则设置侧边导航栏选中该条目对应的选项（通过index对应）
            for (var i = 0; i < length; i++) {
                var currContentTop = $contentLi.eq(i + contentStartIndex).offset().top;
                var nextContentTop = i < length - 1 ? $contentLi.eq(i + 1 + contentStartIndex).offset().top : 99999;

                if (sideNavTop >= currContentTop - mistake &&
                    sideNavTop < nextContentTop - mistake) {

                    if (clickIndex > -1 && clickIndex !== i + navStartIndex) {
                        return;
                    }

                    $sideNavLi.eq(i + navStartIndex).addClass(selectClass).siblings('.' + selectClass).removeClass(selectClass);
                    break;
                }
            }
        }

        function perImgLoadPosition() {
            $contentLi.find('img').each(function (index) {
                $(this).load(regulatePosition);
            });
        }
        //刚进入页面，如果设置了默认定位则定位
        if (defaultIndex >= 0) {
            $sideNavLi.eq(defaultIndex).click();
            perImgLoadPosition();
        }

    };

    /**
     * 使用方法：
     *  请用在页面渲染后，且需要聚焦效果的元素要加上class：wait-focus
     */
    global.tools.focus = function() {
        $('body .wait-focus').each(function(index, input){
            var $input = $(input);
            var defaultValue = $input.val();

            $input.on('focus', function() {
                var $this = $(this);
                $this.addClass("compl_border");

                var value = $this.val();
                if(defaultValue === value) {
                    $this.val('');
                }
            });

            $input.on('blur', function () {
                var $this = $(this);
                $this.removeClass("compl_border");

                var value = $this.val();
                if(value.trim() === '') {
                    $this.val(defaultValue);
                }
            });
        });
    };

    /**
     * 图片设置，暂时不使用，待修改
     * @param option
     */
    global.tools.setImg = function(option) {
        $(option.selector + ' img').each(function() {
            var $img = $(this);
            var pHeight = $img.parents('a').eq(0).height();
            var pWidth = $img.parents('a').eq(0).height();

            (function () {
                var list = [], intervalId = null,
                    // 用来执行队列
                    tick = function () {
                        var i = 0;
                        for (; i < list.length; i++) {
                            list[i].end ? list.splice(i--, 1) : list[i]();
                        }
                        !list.length && stop();
                    },
                    // 停止所有定时器队列
                    stop = function () {
                        clearInterval(intervalId);
                        intervalId = null;
                    };
                return function (url, ready, load, error) {
                    var onready, width, height, newWidth, newHeight,
                        img = new Image();
                    img.src = url;
                    // 如果图片被缓存，则直接返回缓存数据
                    if (img.complete) {
                        ready.call(img);
                        load && load.call(img);
                        return;
                    }
                    width = img.width;
                    height = img.height;
                    // 加载错误后的事件
                    img.onerror = function () {
                        error && error.call(img);
                        onready.end = true;
                        img = img.onload = img.onerror = null;
                    };
                    // 图片尺寸就绪
                    onready = function () {
                        newWidth = img.width;
                        newHeight = img.height;
                        if (newWidth !== width || newHeight !== height || newWidth * newHeight > 1024) {
                            ready.call(img);
                            onready.end = true;
                        }
                    };
                    onready();
                    // 完全加载完毕的事件
                    img.onload = function () {
                        // onload在定时器时间差范围内可能比onready快
                        // 这里进行检查并保证onready优先执行
                        !onready.end && onready();
                        load && load.call(img);
                        // IE gif动画会循环执行onload，置空onload即可
                        img = img.onload = img.onerror = null;
                    };
                    // 加入队列中定期执行
                    if (!onready.end) {
                        list.push(onready);
                        // 无论何时只允许出现一个定时器，减少浏览器性能损耗
                        if (intervalId === null) intervalId = setInterval(tick, 40);
                    }
                };
            })()($img.attr('src'),
                function() {
                }, function() {
                    //console.log(pWidth + ':' + pHeight + '====' + this.width + ':' + this.height);
                    if( this.width / this.height > pWidth / pHeight ) {
                        $img.css({
                            position: 'relative',
                            width: '100%',
                            height: 'auto'
                        });

                        $img.css({
                            top: '50%',
                            marginTop: '-' + $img.height()/2 + 'px'
                        });
                    } else if(this.width / this.height < pWidth / pHeight ) {
                        $img.css({
                            position: 'relative',
                            width: 'auto',
                            height: '100%'
                        });

                        $img.css({
                            left: '50%',
                            marginLeft: '-' + $img.height()/2 + 'px'
                        });
                    }
                },function() {
                });
        });
    };

    /**
     * 获取url参数
     * @AuthorHTL
     * @DateTime  2016-12-30T14:58:41+0800
     * @param     name 参数名称
     * @return    value
     */
    global.tools.getUrlParams = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURI(r[2]);
        } else {
            return null;
        }
    };
    /**
     * 获取中文数字
     * @AuthorHTL KOUJ
     * @DateTime  2017-3-38T14:58:41+0800
     * @param     num 参数名称
     * @return    chnStr1
     */
    tools.NumberToChinese = function(num){
        var chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
        var chnUnitSection = ["","万","亿","万亿","亿亿"];
        var unitPos = 0;
        var strIns = '', chnStr = '';
        var needZero = false;
        if(num === 0){
            return chnNumChar[0];
        }
        while(num > 0){
            var section = num % 10000;
            if(needZero){
                chnStr = chnNumChar[0] + chnStr;
            }
            strIns = SectionToChinese(section,chnNumChar);
            strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
            chnStr = strIns + chnStr;
            needZero = (section < 1000) && (section > 0);
            num = Math.floor(num / 10000);
            unitPos++;
        }
        return chnStr;
    };
    function SectionToChinese(section,chnNumChar){
        var chnUnitChar = ["","十","百","千"];
        var strIns = '', chnStr1 = '';
        var unitPos = 0;
        var zero = true;
        while(section > 0){
            var v = section % 10;
            if(v === 0){
                if(!zero){
                    zero = true;
                    chnStr1 = chnNumChar[v] + chnStr1;
                }
            }else{
                zero = false;
                strIns = chnNumChar[v];
                strIns += chnUnitChar[unitPos];
                chnStr1 = strIns + chnStr1;
            }
            unitPos++;
            section = Math.floor(section / 10);
        }
        return chnStr1;
    }


    /**
     * praise=点赞，want=想去，gone=住过/去过统一交互接口
     * @DateTime  2017-3-13T14:58:41+0800
     * @param  {object}  options      所有参数
     * @params {string}  selector     操作选择器
     * @params {string}  type         praise=点赞，want=想去，gone=住过/去过
     * @params {string}  resourceType 直接通过路径指定 {resourceType} picture=图片，
     * @params {string}  resourceType video=视频，hotel=宾馆酒店，goods=旅游商品，news=新闻资讯，scenery=景区
     * @params {number}  total        操作总数
     * @params {number}  resourceId   id
     * @params {number}  lang         语言参数
     */
    tools.getInteraction= function(options,lang){
        var $selector = options.selector;

        var params = {
            url : "/planMountains/putType/"+options.type+"/"+options.resourceType+"/" + options.resourceId
        };
        var error = "";
        var hasDo = "";
        switch (lang){
            case "cn":
                error = "失败";
                hasDo = "已操作";
                break;
            case "en":
                error = "fail";
                hasDo = "Done";
                break;
            default:
                error = "失败";
                hasDo = "已操作";
                break;
        }
        infoApi.executeRequest(params,function(data){

            if(data.code == 0){//第一次操作
                $selector.find("i").html(parseInt(parseInt(options.total) +1));
                $selector.append('<em class="click_tips">+1</em>');
                $selector.find('em').animate({top: '-28px', 'opacity': '0'}, 950, function () {
                    $(this).remove();
                });
            }else if(data.code == 1){//操作失败
                $selector.append('<em class="click_tips">'+error+'</em>');
                $selector.find('em').animate({top: '-28px', 'opacity': '0'}, 950, function () {
                    $(this).remove();
                });
            }else{//已操作
                $selector.append('<em class="click_tips">'+hasDo+'</em>');
                $selector.find('em').animate({top: '-28px', 'opacity': '0'}, 950, function () {
                    $(this).remove();
                });
            }
        });
    };


    /**
     * 图片列表切换
     * @params p表示li图片列表的父级元素（进行滚动的元素）
     * @params curr  表示图片列表切换到第几页的状态状态圆点
     * @params num   表示切换一页的个数
     * @params yus 表示当不是num的整数倍时最后一页剩余的个数
     * @params oneW 表示一个li的宽度
     * @params syW 表示
     */
    tools.picList = function(p,obj,num){
        var interV,picLen,yus;//专题旅游定时器及滑动次数
        var time = 7000;//切换时间
        picLen = Math.ceil($(p).children("li").length/num);
        interV = setInterval(function(){
            var i = $(obj+".curr").index() + 1;
            if(i>picLen-1){
                $(obj).removeClass("curr");
                $(obj).eq(0).addClass("curr");
                i=0;
            }
            picSlide(i,p,obj,num,picLen);
        },time);

        $(obj).click(function(){
            clearInterval(interV);
            var i = $(this).index();
            if(i>picLen-1){
                $(obj).removeClass("curr");
                $(obj).eq(0).addClass("curr");
                i=0;
            }
            picSlide(i,p,obj,num,picLen);
            interV = setInterval(function(){
                var i = $(obj+".curr").index() + 1;
                if(i>picLen-1){
                    $(obj).removeClass("curr");
                    $(obj).eq(0).addClass("curr");
                    i=0;
                }
                picSlide(i,p,obj,num,picLen);
            },time);
        });

        $(p).children("li").hover(function(){
            clearInterval(interV);
        },function(){
            interV = setInterval(function(){
                var i = $(obj+".curr").index() + 1;
                if(i>picLen-1){
                    $(obj).removeClass("curr");
                    $(obj).eq(0).addClass("curr");
                    i=0;
                }
                picSlide(i,p,obj,num,picLen);
            },time);
        });

        function picSlide(i,p,obj,num,nL){//专题活动切换动画
            yus = $(p).children("li").length%num;
            oneW = $(p).children("li").outerWidth(true);
            var more = yus*oneW;
            if( i >= nL - 1 && yus>0){
                var a = -$(p).children("li").outerWidth(true)*num*(i-1) - more;
                $(obj).eq(i).addClass("curr").siblings("i").removeClass("curr");
                $(p).animate({left:a},800);

            }else{
                var left = -$(p).children("li").outerWidth(true)*num*i;
                $(obj).eq(i).addClass("curr").siblings("i").removeClass("curr");
                $(p).animate({left:left},800);
            }

        }
    };
})(window, jQuery);