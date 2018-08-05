/**
 * Title:ued 省市区下拉选择组件
 * @author Mr Denzel
 * @create Date 2017-12-19 13:51
 * @version 1.0
 * Description:
 */
(function ($,document) {
    var cityJson= [{"region" : "10000", "name" : "中国", "sub" :[] }];
    /**
     * 作用：兼容ie7 ，重写ES5 ARRAY的some方法
     * 区别：这个当存在时，返回的数值不是true，而是其所在的索引值
     * @param  {[function]}   callback 回调函数
     * */
    Array.prototype.some = function (callback) {
        var res ='';
        for(var i=0;i<this.length;i++){
            var res = callback(this[i],i,this);
            if(res){
                res = i ;
                break;
            }
        }
        return res;
    };
    /**
     * 作用：省市区三级联动选择组件
     * 说明：1:支持省市区，省市，市区，省，市，区多种方式的应用,且根据配置，返回对应相对应的数据结构.
     *       2:设置默认省市区时，可设置地区编码或地区名称，当同时设置时，已地区编码为准.
     *       3:设置默认数据项时，可设置获取数据的url或直接传入数据，数据结构必须与cityJson结构一致,当同时设置时，url优先使用；
     * @param  {[string]}   selector                    [组件挂载点选择字符串]
     * @param  {[object]}   options                     [组件配置项]
     * @param  {[object]}   options.grand               [组件省级配置项]
     * @param  {[string]}   options.grand.region        [默认省地区编码设置，优先使用]
     * @param  {[string]}   options.grand.name          [默认省名称设置，仅当地区编码不符合规范时，才会按名称设定]
     * @param  {[string]}   options.grand.state         [省选择框状态设置,有normal;可选  disable：禁选  hidden:隐藏三种值，后两种用于省份确定的情况下应用]
     * @param  {[object]}   options.grand.palaceHolder  [默认提示字设置，默认值是‘请选择’，也可根据需要设置成‘让你选’，‘please’这种自定义字样];
     * @param  {[object]}   options.parent              [组件市级配置项]
     * @param  {[string]}   options.parent.*            [上面省级配置项对市级仍然有效,且作用一致]
     * @param  {[string]}   options.parent.loadingState [当省没有选定时，省选择框的默认状态，disable：禁选  hidden:隐藏]
     * @param  {[object]}   options.child               [组件区级配置项]
     * @param  {[string]}   options.child.*             [上面市级配置项对区级仍然有效,且作用一致]
     * @param  {[string]}   options.url                 [外链数据配置]
     * @param  {[object]}   options.data                [外链数据直接配置]
     * */
    function uedPiker(selector,options,callback) {
        var opt = {
            grand:{
                name:'',
                region:'',
                palaceHolder:'请选择',
                state:'normal', //三种状态 normal;正常  disable：禁用  hidden:隐藏  后两种值必须在name 值指定时有效
                index:'',
                addClass:''
            },
            parent:{
                name:'',
                region:'',
                palaceHolder:'请选择',
                state:'normal', //三种状态 normal;正常  disable：禁用  hidden:隐藏  后两种值必须在name 值指定时有效
                index:'',
                loadingState:'disable',  //disable：禁用  hidden:隐藏  后两种值必须在name 值指定时有效,
                addClass:''
            },
            child:{
                name:'',
                region:'',
                palaceHolder:'请选择',
                index:'',
                state:'normal', //三种状态 normal;正常  disable：禁用  hidden:隐藏  后两种值必须在name值指定时有效
                loadingState:'disable',  //disable：禁用  hidden:隐藏  后两种值必须在name 值指定时有效
                addClass:''
            },
            trigger:false,//回调触发时机，设置为true时,任一一级数据变化都触发回调，默认时，最小一级选定时触发
            size:'normal', //large,normal,small,mini  组件尺寸设置
            width:0, //设置选择框或下拉框的宽度；不推荐
            assignClass:'',
            url:'',
            data:undefined
        };
        this.selector = selector;
        this.option = $.extend(true,opt,options);  //添加true，做合并深拷贝;
        this.callBack = callback;
        this.state={
            grand:'',
            parent:'',
            child:''
        };
        if(this.option.url !==''){
            var that = this ;
           $.ajax({
                url:that.option.url,
                success:function (data) {
                    that.data =data.sub ;
                    that.init();
                },
                error:function () {
                    alert('请求数据失败');
                }
            })
        }else if(this.option.data instanceof Array){
            this.data =this.option.data;
            this.init();
        }else{
            this.data =cityJson[0].sub;
            this.init();
        }
    }
    /*组件原型*/
    uedPiker.prototype = {
        /*程序的初始化*/
        init:function () {
            if($(this.selector).find('.ued-cityPicker-widget').length>0){  //如果当前节点已经加载了一个该组件，则移除后，在重新加载；
                $(this.selector).find('.ued-cityPicker-widget').remove();
            }
            this.setOption();
            this.setDefault($(this.selector),this.option);
            $(this.selector+' .ued-cityPicker-widget').css({display:'block'});
            this.triggerLevel = $(this.selector+' .picker-items:not(.item-hidden):last').data('level');
            this.initEvent();
        },
        /**
         *name:用于监测目标地点的等级，省，市 ，区
         *@params region: 地区地址代码 6位数
         */
        checkRegion:function (region) {
            var regCityCode = /[0]{2,4}$/g; //检测省市区等级 2为省，1为市 0为区
            region = region.toString();
            return Math.floor((region.match(regCityCode) == null) ? 0 : region.match(regCityCode)[0].length/2);
        },
        /**
         *功能:用于保存选定框的索引值
         *         this.state={
                    grand:'',
                    parent:'',
                    child:''
                };
         *@params {[string]} level   [grand,parent,child]
         *@params {[number]} value   [数值]
         */
        setState:function (level,value) {
            this.state[level] = value;
        },
        /**
         * 作用：初始化选择框的状态和样式
         * */
        setOption:function () {
            var opt = this.option,cityJson=this.data;
            var arr =[],res,attr='region';
            /*第一步，验证设置省市区的region是否有效*/
            opt.grand.region = this.checkRegion(opt.grand.region)===2 ? opt.grand.region : '';
            opt.parent.region = this.checkRegion(opt.parent.region)===1 ? opt.parent.region : '';
            opt.child.region = this.checkRegion(opt.child.region)===1 ? opt.child.region : '';
            //索引省对应的索引
            if(opt.grand.region !==''|| opt.grand.name !==''){
                (opt.grand.region ==='')&&(attr = 'name');
                this.state.grand = opt.grand.index= this.searchIndex(attr,opt.grand[attr],cityJson);
            }
            //索引市对应的索引
            if(opt.parent.region !==''|| opt.parent.name !==''){
                attr = 'region';
                (opt.parent.region ==='')&&(attr = 'name');
                if(this.state.grand!==''){
                    arr = cityJson[this.state.grand].sub;
                    this.state.parent = opt.parent.index= this.searchIndex(attr,opt.parent[attr],arr);
                }else{
                    arr = cityJson;
                    res = this.searchIndex(attr,opt.parent[attr],arr);
                    this.state.grand = opt.grand.index= res[0];
                    this.state.parent = opt.parent.index=res[1];
                }
            }
            //索引区对应的索引
            if(opt.child.region !==''|| opt.child.name !==''){
                attr = 'region';
                (opt.child.region ==='')&&(attr = 'name');
                if(this.state.grand!==''|| this.state.parent!==''){
                    if(this.state.parent===''){  //父级有索引的时候，祖父级索引就必须会存在；
                        arr = cityJson[this.state.grand].sub;
                        res= this.searchIndex(attr,opt.child[attr],arr);
                        this.state.parent = opt.parent.index= res[0];
                        this.state.child = opt.child.index=res[1];
                    }else{
                        arr= cityJson[this.state.grand].sub[this.state.parent].sub;
                        this.state.child = opt.child.index = this.searchIndex(attr,opt.child[attr],arr);
                    }
                }else{
                    arr = cityJson;
                    res = this.searchIndex(attr,opt.child[attr],arr);
                    this.state.grand = opt.grand.index= res[0];
                    this.state.parent = opt.parent.index=res[1];
                    this.state.child = opt.child.index=res[2];
                }
            }
            if(opt.child.state ==='hidden' && opt.parent.state ==='hidden'){
                opt.parent.addClass = 'item-hidden';
                opt.child.addClass = 'item-hidden';
                return ;
            }
            //初始化祖父级样式
            if(opt.grand.index && opt.grand.state !=='normal'){  //处理持续状态
                opt.grand.addClass = 'item-'+ opt.grand.state ;
            }
            //初始化父级样式
            if(opt.parent.index && opt.parent.state !=='normal'){  //处理持续状态
                opt.parent.addClass = 'item-'+ opt.parent.state ;
            }else{  //处理加载时的状态
                if(opt.parent.loadingState!=='disable'){
                    opt.parent.addClass = 'item-loading-'+opt.parent.loadingState;
                }else{
                    opt.parent.addClass = 'item-loading-disable';
                }
            }
            //初始化子级样式
            if(opt.child.state !=='normal' || (opt.grand.addClass === ''&&opt.parent.addClass === 'item-hidden')){ //处理持续状态
                opt.child.addClass = 'item-hidden';
            }else{  //处理加载时的状态
                if(opt.child.loadingState!=='disable'){
                    opt.child.addClass = 'item-loading-'+opt.child.loadingState;
                }else{
                    opt.child.addClass = 'item-loading-disable';
                }
            }
        },
        /**
         * 作用：根据查询的名字，取出对应的索引值
         * @params {[string]} attr    [查询的属性，region,name]
         * @params {[string]} value   [查询的值]
         * @params {[ARRAY]} arr      [被查询的数组]
         * 返回值：index
         *         未查到对应值;为空
         *         一级索引查询到;返回单个数值
         *         二级索引查询到;返回长度为2的数组
         *         三级索引查询到;返回长度为3的数组
         * */
        searchIndex:function (attr,value,arr) {
            var index='';
            index = arr.some(function (t) {  //省级查询
                return t[attr] === value ;
            });
            if(!index){  //市级查询
                for(var i=0;i<arr.length;i++){
                    index = arr[i].sub.some(function (t) {
                        return t[attr] === value ;
                    });
                    if(index){
                        index = [i,index];
                        break;
                    }
                }
            }
            if(!index){  //区级查询
                for(i=0;i<arr.length;i++){
                    var temp = arr[i].sub;
                    for(var j=0;j<temp.length;j++){
                        index = temp[j].sub.some(function (t) {
                            return t[attr] === value ;
                        });
                        if(index){
                            break;
                        }
                    }
                    if(index){
                        index = [i,j,index];
                        break;
                    }
                }
            }
            return index;
        },
        /**
         * 作用：设定选择框初始值和显示状态
         * */
        setDefault:function ($point,opt) {
            var opt = this.option,
                numReg=/^\d+$/,
                append =[],
                fontSet={
                    max:40,
                    normal:36,
                    small: 30,
                    min:26
                },fontClass,top;
            fontClass = 'font-'+opt.size;
            var str = '<div class="ued-cityPicker-widget '+fontClass+' '+opt.assignClass+'">' +
                '        <div class="picker-items item-grand '+opt.grand.addClass+'" data-level="grand">' +
                '            <span class="selected-item">'+opt.grand.palaceHolder+'</span>' +
                '            <i class="triangle"></i>' +
                '            <ul class="drop-item">' +
                '            </ul>' +
                '        </div>' +
                '        <div class="picker-items item-parent '+opt.parent.addClass+'" data-level="parent" >' +
                '            <span class="selected-item">'+opt.parent.palaceHolder+'</span>' +
                '            <i class="triangle"></i>' +
                '            <ul  class="drop-item">' +
                '            </ul>' +
                '        </div>' +
                '        <div class="picker-items item-child '+opt.child.addClass+'" data-level="child" >' +
                '            <span class="selected-item">'+opt.child.palaceHolder+'</span>' +
                '            <i class="triangle"></i>' +
                '            <ul class="drop-item">' +
                '            </ul>' +
                '        </div>' +
                '    </div>';
            $point.append(str).find('.ued-cityPicker-widget').css({display:'none'});
            if(numReg.test(opt.width)&&opt.width){
                $point.find('.picker-items').css({width:opt.width+'px'});
            }
            var arr = this.data;

            this.appendList('grand',arr);
            if(opt.grand.index !==''){
                append = arr[opt.grand.index];
                this.setName('grand',append.name,opt.grand.index);
                this.setState('grand',opt.grand.index);
                this.appendList('parent',append.sub);
            }else{
                return ;
            }
            if(opt.parent.index !==''){
                append = arr[opt.grand.index].sub[opt.parent.index];
                this.setName('parent',append.name,opt.parent.index);
                this.setState('parent',opt.parent.index);
                this.appendList('child',append.sub);
            }else{
                return ;
            }
            if(opt.child.index !==''){
                this.setName('child',append.sub[opt.child.index].name,opt.child.index);
                this.setState('child',opt.child.index);
            }
        },
        /**
         * 作用：设定选择框的值
         *@params {[string]} level        [grand,parent,child]
         *@params {[string]} holderName   [选择框提示值设定]
         *@params {[number]} index        [选择框索引值]
         * */
        setName:function (level,holderName,index) {
            $(this.selector+' .item-'+level+' .selected-item').text(holderName).attr('data-index',index);
            if(index){
                $(this.selector+' .item-'+level+':not(.item-disable)').addClass('curr');
            }else{
                $(this.selector+' .item-'+level).removeClass('curr');
            }
            $(this.selector+' .item-'+level+' .drop-item li.curr').removeClass('curr');
            index&&$(this.selector+' .item-'+level+' .drop-item li:eq('+index+')').addClass('curr');
        },
        /**
         * 作用：选择框状态置为禁选
         *@params {[string]} level   [grand,parent,child]
         * */
        setDisable:function (level) {
            $(this.selector+' .item-'+level).addClass('item-loading-disable');
            this.setName(level,this.option[level].palaceHolder);
        },
        /**
         * 作用：选择框状态置为可选
         *@params {[string]} level   [grand,parent,child]
         * */
        setEnable:function (level) {
            $(this.selector+' .item-'+level).removeClass('item-loading-hidden');
            $(this.selector+' .item-'+level).removeClass('item-loading-disable');
        },
        /**
         * 作用：根据上一级选择框的值，触发更新下一级选择框的选择列表
         *@params {[string]} level   [grand,parent,child]
         * */
        triggerOption:function (level) {
            var arr =[],cityJson=this.data ;
            switch(level){
                case 'grand':
                    if(this.state.grand){
                        arr = cityJson[this.state.grand].sub;
                        this.appendList('parent',arr,true);
                    }else{
                        this.setDisable('parent');
                    }
                    this.setDisable('child');
                    break;
                case 'parent':
                    if(this.state.parent){
                        arr = cityJson[this.state.grand].sub[this.state.parent].sub;
                        this.appendList('child',arr,true);
                    }else{
                        this.setDisable('child');
                    }
                    break;
                default:
                    ;
            }
        },
        /**
         * 作用：设定下拉选择列表
         *@params  {[string]} level         [grand,parent,child]
         *@params  {[array]}  lists         [下拉列表的数组]
         * @params {[array]} toDefault      [选择框是否置为提示值]
         * */
        appendList: function(level,lists,toDefault) {
            var str = '';
            for(var i=0;i<lists.length;i++){
                str = str + '<li data-level="'+level+'" data-index="'+i+'">'+ lists[i].name+'</li>';
            }
            this.setEnable(level);
            $(this.selector+' .item-'+level+' .drop-item').html(str);
            toDefault&&(this.setName(level,this.option[level].palaceHolder));
        },
        /**
         * 作用：触发回调后，生成回调结果
         *@params  {[string]} level         [grand,parent,child]
         * */
        createRes:function (level) {
            var json =this.data[this.state.grand];
            var res= {
                grand:{
                    name:json.name,
                    region:json.region
                },
                parent:{
                    name:'',
                    region:''
                },
                child:{
                    name:'',
                    region:''
                }
            };
            if(level == 'parent' || level == 'child'){
                res.parent = {
                    name:json.sub[this.state.parent].name,
                    region:json.sub[this.state.parent].region
                };
                if(level == 'child'){
                    res.child = {
                        name:json.sub[this.state.parent].sub[this.state.child].name,
                        region:json.sub[this.state.parent].sub[this.state.child].region
                    };
                }
            }
            return res;
        },
        /**
         * 作用：事件初始化
         * */
        initEvent:function () {
            var that = this;
            /**
             * 作用：下拉列表的显示与隐藏
             * */
            $(that.selector).off('click');
            $(that.selector).on('click','.picker-items:not(.item-disable,.item-loading-disable)',function (e) {
                var level = $(this).data('level');
                var $item = $(that.selector+' .item-'+level+' .drop-item');
                var $triangle = $(that.selector+' .item-'+level+' .triangle');
                var isShow = $item.css('display');
                if(isShow === 'none'){
                    $(that.selector+' .drop-item').css({display:'none'});
                    $triangle.css({transform:'rotate(180deg)'});
                    $item.css({display:'block'});
                }else{
                    $item.css({display:'none'});
                    $triangle.css({transform:'rotate(0)'});
                }
            });
            /**
             * 作用：列表值的选中与触发回调
             * 当选中值的列表框为程序初始化时判断的触发等级，就生成相应的结果，触发相应的回调函数
             * */
            $(that.selector+' .picker-items').off('click');
            $(that.selector+' .picker-items').on('click','.drop-item li',function (e) {
                var $this =  $(this);
                var level =  $this.data('level'),index =  $this.data('index'),name =  $this.text();
                that.setState(level,index); //保存状态
                that.setName(level,name,index);  //更新选择框中的字
                that.triggerOption(level,index);
                if(index&&(that.triggerLevel === level || that.option.trigger)){
                    that.callBack(that.createRes(level));
                }
            });
        }
    }
    window.uedCityPiker = uedPiker; //暴露给全局对象，不依赖juery，也可单独调用.
    $.fn.uedCityPiker = function (options,callback) {
        new uedPiker(this.selector,options,callback);
    }
})(jQuery,document);