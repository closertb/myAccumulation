/*
专为threejs中各种loader封装的批量加载类
依赖 Three.js Jquery
*/
this.jd = this.jd||{};
(function(){
    var ThreeGroupLoader = function()
    {
        /*var ary=[
            {id:"c1", type:"image", url:"images/test.jpg"},
            {id:"c2", type:"image", url:"images/rec.png"},
            {id:"c3", type:"js", url:"model/computer.js"},
            {id:"c5", type:"js", url:"model/phone.js"}
        ];*/
        //this.load(ary);
    };
    var p = ThreeGroupLoader.prototype;
    p.$eventDispatcher = $({});

    p.load = function(ary)
    {
        var cur = this;
        this.resultMap ={};
        var manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total ) {

            cur.loadProgress(loaded,total)
            if(loaded >= total)
            {
                cur.loadComplete();
            }
        };
        for(var i=0; i< ary.length; i++)
        {
            var obj = ary[i];
            /*加载完结果后，为了获取对应的id 用闭包处理*/
            (function() {
                var id = obj["id"];
                var type = obj["type"];
                var url = obj["url"];
                var loader;
                /*images*/
                if(type =="image")
                {
                    loader = new THREE.ImageLoader( manager );
                    loader.load(url, function ( result ) {
                        cur.resultMap[id] = {'type':type, 'result':result};
                    } );
                }
                /*texture*/
                if(type == "texture")
                {
                    loader = new THREE.TextureLoader( manager );
                    loader.load(url, function ( result ) {
                        cur.resultMap[id] = {'type':type, 'result':result};
                    } );
                }
                /*js模型文件*/
                if(type == "js")
                {
                    loader = new THREE.JSONLoader(manager);
                    loader.load(url, function ( result ) {
                        cur.resultMap[id] = {'type':type, 'result':result};
                    } );
                }
                /*js模型文件去掉了其他多余信息只留取点信息*/
                if(type == "vJs")
                {
                    loader = new THREE.VertexLoader(manager);
                    loader.load(url, function ( result ) {

                        cur.resultMap[id] = {'type':type, 'result':result};
                    } );
                }
            })(obj);
        }
    };

    p.loadProgress = function(loaded,total)
    {
        this.$eventDispatcher.trigger("loadProgress",{'loaded':loaded,'total':total});
    };

    p.loadComplete = function()
    {
        this.$eventDispatcher.trigger("loadComplete",this.resultMap);
    };
    jd.ThreeGroupLoader = ThreeGroupLoader;
})();