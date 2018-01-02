## 省市区三级联动选择插件 ##

兼容：ie7及以上浏览器；

### 使用示例：###
在head头部引入uedCityPicker/index.css文件，在jquery库引入后，body结束前引入uedCityPicker/index.js

   //挂载选择器

    $('.nav-bar7').uedCityPicker({  //nav-bar7为页面内一个存在的dom元素
            grand:{region:'510000',name:'四川省',state:'disable'},  //这里设定了region和name，但以region为准值
            parent:{name:'绵阳市'}},  //这里只设定了name，以name为准值,当设置name时，name不能简写，如：‘绵阳’
        function (res) {  //回调函数
            console.log('res:',res);
        });

### 数据结构说明：###

        var opt = {
            grand:{
                name:'',
                region:'',
                palaceHolder:'请选择',
                state:'normal', //三种状态 normal;正常  disable：禁选  hidden:隐藏  后两种值必须在name 值指定时有效
            },
            parent:{
                name:'',
                region:'',
                palaceHolder:'请选择',
                state:'normal', //三种状态 normal;正常  disable：禁选  hidden:隐藏  后两种值必须在name 值指定时有效
                loadingState:'disable',  //disable：禁选  hidden:隐藏  后两种值必须在name 值指定时有效,
            },
            child:{
                name:'',
                region:'',
                palaceHolder:'请选择',
                state:'normal', //三种状态 normal;正常  disable：禁选  hidden:隐藏  后两种值必须在name值指定时有效
                loadingState:'disable'  //disable：禁选  hidden:隐藏  后两种值必须在name 值指定时有效
            },
            url:'',
            data:undefined
        };

        /*回调返回参数说明*/

        res= {
            grand:{
                name:json.name,
                region:json.region
            },
            parent:{    //最小选择级别为市或区时才存在
                name:json.name,
                region:json.region
            }
            child:{      //最小选择级别为区时才存在
                name:json.name,
                region:json.region
            }
         };
### 参数说明：###

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


**更多使用示例参看index.html**