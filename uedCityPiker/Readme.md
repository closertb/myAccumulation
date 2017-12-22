### 省市级三级联动选择插件 ###

兼容：ie7及以上浏览器；
参数说明：
       {
            grand:{  //省级选项卡配置项
                name:'',  //默认要显示的省
                palaceHolder:'请选择',
                state:'normal', //三种状态 normal;正常  disable：禁用  hidden:隐藏  后两种值必须在name 值指定时有效
            },
            parent:{  //市级选项卡配置项
                name:'', //默认要显示的市
                palaceHolder:'请选择',
                state:'normal', //三种状态 normal;正常  disable：禁用  hidden:隐藏  后两种值必须在name 值指定时有效
                loadingState:'disable',  //disable：禁用  hidden:隐藏  后两种值必须在name 值指定时有效,
            },
            child:{
                name:'',  //默认要显示的区
                palaceHolder:'请选择',
                state:'normal', //三种状态 normal;正常  disable：禁用  hidden:隐藏  后两种值必须在name值指定时有效
                loadingState:'disable',  //disable：禁用  hidden:隐藏  后两种值必须在name 值指定时有效
            },
            url:''
        };