this.jd = this.jd||{};
(function(){
    var C3 = function()
    {
        this.init();
    };

    var p = C3.prototype;
    p.particleColorAry = [{},{r:14/255, g:179/255, b:243/255},{r:176/255, g:85/255, b:240/255},{r:210/255, g:25/255, b:41/255}];
    p.domColorAry = ["#FFFFFF","#0ba1d6","#b055f0","#cf1a29"];
    p.subId =0;

    p.init = function()
    {
        this.initDom();
        this.initLoader();
    };

    p.initDom = function()
    {
        this.canvasContainer = document.getElementById("container3d");
        this.cssContainer = document.getElementById("container3dcss");
        this.$navPanel = $(".c3_navPanel");
        this.$nav = $(".c3_navPanel .c3_nav");
    };

    p.init2d = function()
    {
        var cur = this;
        this.$nav.click(function(){
            var id = cur.$nav.index(this);
            cur.subId = id;
            cur.toSub(id);
            cur.subTitleChange(id);
            cur.numChange(id);
            cur.dataToSub(id);
            cur.navToSub(id);
            cur.sphereToSub(id)
            cur.tipToSub(id);
            cur.txt3cToSub(id);
        });
    };


    p.navToSub = function(id)
    {
        if(id == 0)
        {

            $(".c3_navPanel").animate({"bottom":"0%","opacity":0},1000,function(){
                $(".c3_navPanel").hide();
            });
        }
        else
        {
            $(".c3_navPanel").show();
            $(".c3_navPanel").animate({"bottom":"9%","opacity":1},1000);
        }
        //
        $(".c3_navPanel .c3_nav .navBar").css({"background-color":this.domColorAry[id],"height":"3px"});
        $(".c3_navPanel .c3_nav .title").css("color",this.domColorAry[id]);
        //
        $(".c3_navPanel .c3_nav .navBar").eq(id).css("height","30px");
        $(".c3_navPanel .c3_nav .title").eq(id).css("color","#FFFFFF");
    };

    //====================================================   loader    start ===============================================//
    p.resourcesMap ={};
    p.initLoader = function()
    {
        var cur = this;
        var resourcesAry = [
            {id:"title", type:"texture", url:"images/3c/title.png"},
            {id:"dotCir", type:"texture", url:"../images/3c/dotcir.png"},
            {id:"arrowCir", type:"texture", url:"images/3c/arrowCir.png"},
            {id:"dateMC", type:"texture", url:"images/3c/dateMC.png"},
            {id:"spark", type:"texture", url:"images/spark1.png"},
            {id:"triangle", type:"texture", url:"images/3c/triangleTexture.jpg"},
            {id:"subTitle_3c", type:"texture", url:"images/3c/subTitle_3c.png"},
            {id:"subTitle_1", type:"texture", url:"images/3c/subTitle_1.png"},
            {id:"subTitle_2", type:"texture", url:"images/3c/subTitle_2.png"},
            {id:"subTitle_3", type:"texture", url:"images/3c/subTitle_3.png"}

        ];
        this.loader = new jd.ThreeGroupLoader();
        this.loader.$eventDispatcher.bind('loadProgress',function(e,data){
            //console.log(data);
        });
        this.loader.$eventDispatcher.bind('loadComplete',function(e,data){
            $(".loading").fadeOut();
            //
            cur.resourcesMap = data;
            cur.init3d();
            cur.init2d();
          //  cur.initData();
        });
        this.loader.load(resourcesAry);
    };
    //====================================================   loader    end =================================================//


    //======================================================   threejs    start ===================================================//
    /*------------------------------threejs common part start--------------------------------------------*/
    p.init3d=function()
    {
        this.initRender();
        this.initCamera();
        this.initScene();
        this.initObject();
        this.initLight();
        this.initResize();
    };
    p.initRender=function()
    {
        this.renderer = new THREE.WebGLRenderer({ antialias: true ,alpha:true});
        this.renderer.autoClear = false;
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.canvasContainer.appendChild( this.renderer.domElement );

        //
        this.cssRenderer = new THREE.CSS3DRenderer();
        this.cssRenderer.setSize( window.innerWidth, window.innerHeight );
        this.cssContainer.appendChild( this.cssRenderer.domElement );
    };

    p.initCamera=function()
    {
        var width = window.innerWidth;
        var height = window.innerHeight;
        this.camera = new THREE.PerspectiveCamera( 30, width / height, 1, 3000 );
        this.camera.position.set(0, 0, 1700);
        //
        this.titleCamera = new THREE.PerspectiveCamera( 48, width / height, 1, 3000 );
        this.titleCamera.position.set(0, 0, 1000);

    };

    p.initScene = function()
    {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog( 0x0B4FC1, 0, 100000 );
        //
        this.titleScene = new THREE.Scene();
        //
        this.cssScene = new THREE.Scene();
    };

    p.initLight = function ()
    {

    };

    p.initObject=function()
    {
        this.initCC();
        this.initContainer();
        this.createTitle();
        this.createParticleMaterial();
        this.createParticle();
        this.createCir();
        this.createSubTitle();
        this.createNum();
        this.createBgParticle();
        //this.createBgLine();
        //this.bgLineAppear();

        //this.createTitleSum();
        this.createTip();
      //  this.createTxt3c();
    };

    p.render = function()
    {
        if(this.renderer)
        {
            this.container.rotation.y +=0.01;
            this.particleRender();
            this.cirRender();
            this.bgParticleRender();
            this.ccRener();
            this.renderer.render( this.scene, this.camera );
            this.renderer.render( this.titleScene, this.titleCamera );
            this.cssRenderer.render( this.cssScene, this.camera );
        }
    };

    p.initResize = function()
    {
        var cur = this;
        // window.addEventListener( 'resize', function(){
        //     cur.resizeFun();
        // }, false );
        // this.resizeFun();
    };

    p.resizeFun = function()
    {
        var width = window.innerWidth;
        var height = window.innerHeight;
        this.camera.aspect = width/ height;
        this.camera.updateProjectionMatrix();
        this.titleCamera.aspect = width/ height;
        this.titleCamera.updateProjectionMatrix();
        this.renderer.setSize( width, height );
        this.cssRenderer.setSize( width, height );
    };
    /*------------------------------threejs common part end--------------------------------------------*/

    p.initContainer = function()
    {
        this.container = new THREE.Object3D();
        this.scene.add(this.container);
        //this.container.rotation.x = 0.2;
    };

    /*-------------------------------------------------- title start--------------------------------------------------*/
    p.createTitle = function()
    {
        var material = new THREE.SpriteMaterial( { map:this.resourcesMap["title"]["result"] } );
        this.title = new THREE.Sprite( material );
        this.titleScene.add(this.title);
        var width = material.map.image.width;
        var height = material.map.image.height;
        this.title.scale.set( width, height, 1 );
        this.title.position.y = 800;
    };
    //
    p.createParticleMaterial = function()
    {
        var texture = this.resourcesMap["spark"]["result"];
        this.particleMaterial = new THREE.ShaderMaterial( {
            uniforms: {
                color:    { type: "c", value: new THREE.Color( 0xffffff ) },
                opacity:  { type: "f", value: 1 },
                texture:  { type: "t", value: texture }
            },
            vertexShader:   document.getElementById( 'vertexshader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
            blending:       THREE.AdditiveBlending,
            depthTest:      false,
            transparent:    true
        });
    };
    p.createLineShaderMaterial = function()
    {
        this.lineShaderMaterial = new THREE.ShaderMaterial( {
            uniforms: {
                color:    { type: "c", value: new THREE.Color( 0xffffff ) },
                opacity:  { type: "f", value: 1 }
            },
            vertexShader:   document.getElementById( 'lineVShader' ).textContent,
            fragmentShader: document.getElementById( 'lineFragmentShader' ).textContent,
            /*blending:       THREE.AdditiveBlending,*/
            depthTest:      true,
            transparent:    true
        });
    };
    /*-------------------------------------------------- title end--------------------------------------------------*/

    /*---------------------------------------------- particle start-----------------------------------------------*/
    p.createParticle = function()
    {
        this.sphereVs =[];
        this.vsAdjustAry =[
            {scaleX:1,scaleY:1,scaleZ:1,offsetX:0,offsetY:0,offsetZ:"0",opacity:0},
            {scaleX:1.8,scaleY:1.8,scaleZ:1.8,offsetX:0,offsetY:0,offsetZ:"0",opacity:0.8},
            {scaleX:10,scaleY:10,scaleZ:10,offsetX:0,offsetY:-80,offsetZ:"0",opacity:0.8},
            {scaleX:8,scaleY:8,scaleZ:8,offsetX:0,offsetY:-100,offsetZ:"0",opacity:0.8}
        ];
        this.vsAdjustObj ={};

        var maxNum = Math.max(0,10);
        this.particle = this.createParticleFun(maxNum);
        this.container.add(this.particle);
    };

    p.createParticleFun = function(num)
    {
        this.curVs = [];
        var pointNum = num;
        var geometry = new THREE.BufferGeometry();
        //
        var positionAry = new Float32Array(pointNum*3);
        var colorAry = new Float32Array(pointNum*3);
        var opacityAry = new Float32Array( pointNum );
        var sizeAry = new Float32Array( pointNum );
        //
        var color = new THREE.Color( 0xde3ed4 );
        //
        var i = pointNum;
        var i3 = positionAry.length;
        while(i3>0)
        {
            i--;
            i3 -=3;
            //
            var v = new THREE.Vector3(Math.random() * 2 - 1,Math.random() * 2 - 1,Math.random() * 2 - 1);
            v.normalize();
            v.multiplyScalar( Math.random() * 700 + 200 );
            this.sphereVs.push(v);
            //
            positionAry[i3] = v.x;
            positionAry[i3+1] = v.y;
            positionAry[i3+2] = v.z;
            //
            opacityAry[i] = 0;
            sizeAry[i] = 3+Math.random()*3;
            color.toArray( colorAry, i * 3 );
            //
            //this.sphereVs.push(new THREE.Vector3(1000*(Math.random()-0.5),600*(Math.random()-0.5),600*(Math.random()-0.5)));
        }
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positionAry, 3 ) );
        geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colorAry, 3 ) );
        geometry.addAttribute( 'customOpacity', new THREE.BufferAttribute( opacityAry, 1 ) );
        geometry.addAttribute( 'size', new THREE.BufferAttribute( sizeAry, 1 ) );
        //
        var particle = new THREE.Points( geometry, this.particleMaterial );
        geometry.attributes.position.needsUpdate = true;
        return particle;
    };

    p.toSub = function(id)
    {
        var vs;
        if(id == 0)
        {

            vs = this.sphereVs;
        }
        if(id == 1)
        {
            vs  = this.phoneVs;
        }
        if(id == 2)
        {
            vs = this.notebookVs;
        }
        if(id == 3)
        {
            vs = this.myCameraVs;
        }
        this.curVs = vs;
        this.container.rotation.y = this.container.rotation.y % (2*Math.PI);
        var targetRy = this.container.rotation.y+1.8*Math.PI;
        TweenLite.to(this.container.rotation, 1.3, { delay:0, y:targetRy});
        var cur = this;
        cur.curVs = cur.sphereVs;
        cur.vsAdjustObj =  {scaleX:1,scaleY:1,scaleZ:1,offsetX:0,offsetY:0,offsetZ:"0",opacity:0.2};
        setTimeout(function(){
            cur.curVs = vs;
            cur.vsAdjustObj = cur.vsAdjustAry[id];
        },500);
        //this.vsAdjustObj = this.vsAdjustAry[id-1];
    };

    p.particleRender = function()
    {
        if(this.curVs.length>0)
        {
            var positionAry = this.particle.geometry.attributes.position.array;
            var opacityAry = this.particle.geometry.attributes.customOpacity.array;
            var colorAry = this.particle.geometry.attributes.customColor.array;
            //
            var i = opacityAry.length;
            var i3 = positionAry.length;
            while(i3>0)
            {
                i--;
                i3 -=3;
                if(i<this.curVs.length)
                {
                    positionAry[i3] += (this.vsAdjustObj["scaleX"]*this.curVs[i].x +this.vsAdjustObj["offsetX"] - positionAry[i3])*0.08;
                    positionAry[i3+1] += (this.vsAdjustObj["scaleY"]*this.curVs[i].y +this.vsAdjustObj["offsetY"] - positionAry[i3+1])*0.08;
                    positionAry[i3+2] += (this.vsAdjustObj["scaleZ"]*this.curVs[i].z+ +this.vsAdjustObj["offsetZ"] - positionAry[i3+2])*0.08;
                    //
                    if(this.subId !=0)
                    {
                        opacityAry[i] += (0.7-opacityAry[i])*0.2;
                    }
                    else
                    {
                        opacityAry[i] += (0-opacityAry[i])*0.08;
                    }
                }
                else
                {
                    opacityAry[i] += (0-opacityAry[i])*0.2;
                }
                //
                if(this.subId !=0 )
                {
                    colorAry[i3] += (this.particleColorAry[this.subId]["r"] - colorAry[i3])*0.02;
                    colorAry[i3+1] += (this.particleColorAry[this.subId]["g"]-colorAry[i3+1])*0.02;
                    colorAry[i3+2] += (this.particleColorAry[this.subId]["b"] -colorAry[i3+2])*0.02;
                }
            }
            this.particle.geometry.attributes.position.needsUpdate = true;
            this.particle.geometry.attributes.customOpacity.needsUpdate = true;
            this.particle.geometry.attributes.customColor.needsUpdate = true;
            this.particle.geometry.attributes.size.needsUpdate = true;
        }
    };
    /*---------------------------------------------- particle end-----------------------------------------------*/


    /*------------------------------------------------ cir start--------------------------------------------------*/
    p.createCir= function()
    {
        this.cirContainer = new THREE.Object3D();
        this.scene.add(this.cirContainer);
        this.createDotCir();
        this.createArrowCir();
        this.createDateMC();
        this.cirAppear();
    };

    p.cirAppear = function()
    {
        TweenLite.to(this.dotCir.material, 1, { delay:2, opacity:1});
        //
        TweenLite.to(this.arrowCir.material, 1, { delay:2, opacity:1});
        this.arrowCir.rotation.z = 1;
        this.arrowCir.position.x =-5;
        this.arrowCir.position.y =40;
        this.arrowCir.position.z =30;
        TweenLite.to(this.arrowCir.rotation, 1, { delay:2, z:0});
        //
        this.dateMC.position.x = 420-100;
        // this.dateMC.position.y = 480-100;
        TweenLite.to(this.dateMC.material, 1, { delay:2+1, opacity:1});
        TweenLite.to(this.dateMC.position, 1, { delay:2+1, x:420});
    };

    p.createDotCir = function()
    {
        var texture = this.resourcesMap["dotCir"]["result"];
        var w = texture.image.width;
        var h = texture.image.height;
        var geometry = new THREE.PlaneGeometry( w, h, 5,5 );
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity:0/*,alphaMap:map*/, side: THREE.DoubleSide,transparent:true,depthTest:false } );
        this.dotCir = new THREE.Mesh( geometry, material );
        this.cirContainer.add( this.dotCir );
    };

    p.createArrowCir = function()
    {
        var texture = this.resourcesMap["arrowCir"]["result"];
        var w = texture.image.width;
        var h = texture.image.height;
        var geometry = new THREE.PlaneGeometry( w, h, 5,5 );
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity:0/*,alphaMap:map*/, side: THREE.DoubleSide,transparent:true,depthTest:false } );
        this.arrowCir = new THREE.Mesh( geometry, material );
        this.cirContainer.add( this.arrowCir );
    };

    p.createDateMC = function()
    {
        var texture = this.resourcesMap["dateMC"]["result"];
        var w = texture.image.width;
        var h = texture.image.height;
        var geometry = new THREE.PlaneGeometry( w, h, 5,5 );
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity:0/*,alphaMap:map*/, side: THREE.DoubleSide,transparent:true,depthTest:false } );
        this.dateMC = new THREE.Mesh( geometry, material );
        this.cirContainer.add( this.dateMC );
        this.dateMC.position.x =-10000;
        this.dateMC.position.y =-10000;
    };

    p.cirRender = function()
    {
        this.dotCir.rotation.z +=0.003;
    };
    /*------------------------------------------------ cir end--------------------------------------------------*/

    /*------------------------------------------------ subTitle start-------------------------------------------*/
    p.createSubTitle = function()
    {
        this.subTitleAry =[];
        var texture;
        for(var i =0; i<4; i++)
        {
            if(i==0) texture = this.resourcesMap["subTitle_3c"]["result"];
            if(i==1) texture = this.resourcesMap["subTitle_1"]["result"];
            if(i==2) texture = this.resourcesMap["subTitle_2"]["result"];
            if(i==3) texture = this.resourcesMap["subTitle_3"]["result"];
            var subTitle = this.createSubTitleFun(texture);
            this.cirContainer.add(subTitle);
            this.subTitleAry.push(subTitle);
            subTitle.position.x = 300;
            subTitle.position.y = 120;
        }
        // this.subTitleAppear();
    };

    p.subTitleAppear = function()
    {
        TweenLite.to(this.subTitleAry[0].position, 0.5, {delay:4 ,x:350});
        TweenLite.to(this.subTitleAry[0].material, 0.5, {delay:4, opacity:1});
    };

    p.createSubTitleFun = function(texture)
    {
        var w = texture.image.width;
        var h = texture.image.height;
        var geometry = new THREE.PlaneGeometry( w, h, 5,5 );
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity:0/*,alphaMap:map*/, side: THREE.DoubleSide,transparent:true,depthTest:false } );
        var subTitle = new THREE.Mesh( geometry, material );
        return subTitle;
    };

    p.subTitleChange = function(id)
    {
        var ary = this.subTitleAry;
        for(var i=0;i<ary.length; i++)
        {
            var subTitle = ary[i];
            if(i == id)
            {
                subTitle.position.x =300;
                subTitle.material.opacity = 0;
                TweenLite.to(subTitle.position, 0.5, { x:350});
                TweenLite.to(subTitle.material, 0.5, { opacity:1});
            }
            else
            {
                TweenLite.to(subTitle.position, 1.5, { x:350+300});
                TweenLite.to(subTitle.material, 1.5, { opacity:0});
            }
        }
    };
    /*------------------------------------------------ subTitle start-------------------------------------------*/

    /*------------------------------------------------    num  start -------------------------------------------*/
    p.createNum = function(nums)
    {
        this.numItemAry =[];
        this.contextAry =[];
        for(var i=0; i<4; i++)
        {
            var obj = this.createTxtMaterialItem(nums);
            var numItem = this.createNumItem(obj["material"]);
            this.cirContainer.add(numItem);
            this.numItemAry.push(numItem);
            numItem.position.x = 200;
            numItem.position.y = 50;
            //
            this.contextAry.push(obj["context"]);
        }
        //
        this.numAppear();
    };

    p.createNumItem = function(material)
    {
        var numItem = new THREE.Mesh( new THREE.PlaneGeometry( 512,64 ), material );
        return numItem;
    };

    p.createTxtMaterialItem = function(nums)
    {
        var canvas = document.createElement( 'canvas' );
        // console.log(canvas.patent());
        canvas.width = 512;
        canvas.height =64;
        // canvas.backgroundColor="red";
        // canvas.left=200;
        var context = canvas.getContext('2d');
        context.shadowBlur=20;
        //context.translate(10,10);
        context.shadowColor="rgba(0,140,255,0.75)";
        context.textAlign ="left";
        context.font = "Bold 40px Arial";
        // context.left = 200;
        var a  = "456,2146,98";
        // context.fillStyle = "rgba(255,0,0,0.5)";
        // context.fillRect(0,0,512,64);
        context.fillStyle='#FFFFFF';
        context.fillText(a,100,55);
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        var material = new THREE.MeshBasicMaterial( { map: texture,opacity:0, side: THREE.DoubleSide,transparent:true,depthTest:false } );
        var obj ={"material":material,"context":context};
        return obj;
    };

    p.numAppear = function()
    {
        TweenLite.to(this.numItemAry[0].position, 1.5, {delay:3, x:10000, y: 1000});
        TweenLite.to(this.numItemAry[0].material, 1.5, {delay:0, opacity:0});
    };

    p.numItemUpdate = function(ary)
    {
        for(var i=0; i<this.contextAry.length;i++)
        {
            this.contextAry[i].clearRect(0,0,512,64);
            this.contextAry[i].fillText(this.formatNum(ary[i]["num"].toString()), 10,55);
            this.numItemAry[i].material.map.needsUpdate = true;
            //console.log(this.numItemAry[i].material);
        }
    };

    p.formatNum = function(str)
    {
        if (str.length <= 3)
        {
            return str;
        }
        else
        {
            return this.formatNum(str.substr(0, str.length - 3)) + ',' + str.substr(str.length - 3);
        }
    };

    p.numChange = function(id)
    {
        var ary = this.numItemAry;
        for(var i=0;i<ary.length; i++)
        {
            var numItem = ary[i];
            if(i == id)
            {
                numItem.position.x =400;
                numItem.material.opacity = 0;
                TweenLite.to(numItem.position, 1.5, { x:520});
                TweenLite.to(numItem.material, 1.5, { opacity:1});
            }
            else
            {
                TweenLite.to(numItem.position, 1, { x:520+300});
                TweenLite.to(numItem.material, 1, { opacity:0});
            }
        }
    };
    /*------------------------------------------------    num  end ---------------------------------------------*/

    /*---------------------------------------------- bgParticle start-----------------------------------------------*/
    p.createBgParticle = function()
    {
        var particleNum = 2000;
        var positionAry = new Float32Array(particleNum*3);
        var vYAry = new Float32Array(particleNum);
        var colorAry = new Float32Array(particleNum*3);
        var opacityAry = new Float32Array( particleNum );
        var sizeAry = new Float32Array( particleNum );

        var color = new THREE.Color( 0xde3ed4 );
        //
        var i = particleNum;
        var i3 = positionAry.length;
        while(i3>0)
        {
            i--;
            i3 -=3;
            //
            positionAry[i3] = 2000*(Math.random()-0.5);
            positionAry[i3+1] = 1500*(Math.random()-0.5);
            positionAry[i3+2] = -6000*(Math.random());
            //
            vYAry[i] = 6*Math.random()+5;
            opacityAry[i] = 0.2+0.5*Math.random();
            sizeAry[i] = 5*Math.random()+2;
            var angle = (Math.atan2(positionAry[i3],positionAry[i3+1])+2*Math.PI)%(2*Math.PI);
            //console.log((angle*(180/Math.PI)+360)%360);
            if(angle > 120*(Math.PI/180) && angle < 240*(Math.PI/180))
            {
                color = new THREE.Color( 0x14306c );
            }
            color.toArray( colorAry, i * 3 );
        }
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positionAry, 3 ) );
        geometry.addAttribute( 'vY', new THREE.BufferAttribute( vYAry, 1 ) );
        geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colorAry, 3 ) );
        geometry.addAttribute( 'customOpacity', new THREE.BufferAttribute( opacityAry, 1 ) );
        geometry.addAttribute( 'size', new THREE.BufferAttribute( sizeAry, 1 ) );
        //
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.customOpacity.needsUpdate = true;
        //
        this.bgParticle = new THREE.Points( geometry, this.particleMaterial );
        this.scene.add(this.bgParticle);
    };

    p.bgParticleRender = function()
    {
        var positionAry = this.bgParticle.geometry.attributes.position.array;
        var vY = this.bgParticle.geometry.attributes.vY.array;
        var opacityAry = this.bgParticle.geometry.attributes.customOpacity.array;
        var colorAry = this.bgParticle.geometry.attributes.customColor.array;
        //
        var i = vY.length;
        var i3 = positionAry.length;
        while(i3>0)
        {
            i--;
            i3 -=3;
            positionAry[i3+2] += vY[i];
            if(positionAry[i3+2] > 1000)
            {
                positionAry[i3+2] = -6000;
            }
            if(this.subId !=0 )
            {
                // colorAry[i3] += (this.particleColorAry[this.subId]["r"] - colorAry[i3])*0.08;
                // colorAry[i3+1] += (this.particleColorAry[this.subId]["g"]-colorAry[i3+1])*0.06;
                // colorAry[i3+2] += (this.particleColorAry[this.subId]["b"] -colorAry[i3+2])*0.04;
            }
        }
        this.bgParticle.geometry.attributes.position.needsUpdate = true;
        this.bgParticle.geometry.attributes.customOpacity.needsUpdate = true;
        this.bgParticle.geometry.attributes.customColor.needsUpdate = true;
        this.bgParticle.geometry.attributes.size.needsUpdate = true;
    };
    /*---------------------------------------------- bgParticle end-----------------------------------------------*/


    /*--------------------------------------------------- cc start-----------------------------------------------------*/
    p.initCC = function()
    {
        this.sphereTweenObj ={"appearPer":0,"disappearPer":0};
        this.createSphereContainer();
        this.createSphereLight();
        this.createSphere();
        this.sphereAppear();
        var cur = this;
    };

    p.createSphereContainer = function()
    {
        var PI = Math.PI, DP = PI * 2, UA = PI / 180, AU = 1 / UA;
        this.sphereContainer = new THREE.Object3D();
        this.scene.add(this.sphereContainer);
        this.sphereContainer.rotation.y = -UA * 45;
        this.sphereContainer.rotation.x = UA * 15;
        this.sphereContainer.position.z = 1608;
    };

    p.createSphereLight = function()
    {
        var PI = Math.PI, DP = PI * 2, UA = PI / 180, AU = 1 / UA;
        var geometry = new THREE.SphereGeometry(0.5, 8, 8);
        var color;
        //
        color = 0x00838f;    //管理隐患
        light1 = new THREE.PointLight(color, 2.5, 28);
        light1.position.copy(WS.MathUtil.calculateSpherePosition(20, UA * 40, UA * 10));
        //light1.add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: color})));
        this.sphereContainer.add(light1);

        color = 0x6a1b9a;   //服务隐患
        light2 = new THREE.PointLight(color, 2.5, 28);
        light2.position.copy(WS.MathUtil.calculateSpherePosition(20, UA * 80, UA * 10));
        //light2.add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: color})));
        this.sphereContainer.add(light2);
        //
        color = 0xf9a825; //清洁卫生
        light3 = new THREE.PointLight(color, 2.5, 28);
        light3.position.copy(WS.MathUtil.calculateSpherePosition(20, UA * 50, UA * 90));
        this.sphereContainer.add(light3);
        //
        color = 0x2376FB; //安全隐患
        light4 = new THREE.PointLight(color, 2.5, 28);
        light4.position.copy(WS.MathUtil.calculateSpherePosition(20, UA * 100, UA * 80));
        this.sphereContainer.add(light4);
        // //
        color = 0xc41411;  //食品隐患
        light5 = new THREE.PointLight(color, 2.5, 28);
        light5.position.copy(WS.MathUtil.calculateSpherePosition(20, UA * 130, UA * 40));
        this.sphereContainer.add(light5);
        // light3.add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: color})));

    };

    p.createSphere = function()
    {
        var PI = Math.PI, DP = PI * 2, UA = PI / 180, AU = 1 / UA;
        //
        this.createSphereMaterial();
        //
        this.items = [];
        var itemCount = 1000;
        for (var i = 0; i < itemCount; i++) {
            var triangle = this.createTriangleMesh(Math.random() * DP);
            //var triangle = createPlaneMesh();
            //scene.add(triangle);
            this.sphereContainer.add(triangle);

            var rho = 9 + 0.5 * Math.random();
            var speed = 0.0025 + Math.random() * 0.0025 * 2;
            var item = new WS.TriangleSphereAnimator(triangle, rho, Math.PI * Math.random(), DP * Math.random(), speed);
            item.animate();
            this.items.push(item);
        }
    };

    p.createTriangleMesh= function(rotation)
    {
        return this.createTriangleMesh_cc_02(rotation);
    };

    var createTriangleMesh_cc_02_geometry;
    p.createTriangleMesh_cc_02 = function(rotation)
    {
        var geometry = createTriangleMesh_cc_02_geometry;
        if (geometry == null)
        {
            geometry = new WS.TrianglePieceGeometry();
            //geometry = new THREE.CylinderGeometry(1, 1, 0.08, 3, 1);

            //createTriangleMesh_cc_02_geometry = geometry;
        }
        var mesh = new THREE.Mesh(geometry, this.sphereMaterial);
        geometry.rotateZ(rotation);
        geometry.rotateX(Math.random() * UA * 10);
        geometry.rotateY(Math.random() * UA * 10);
        var scale = 0.9 + 0.5 * Math.random();
        //var scale = 1.2 + 0.6 * Math.random();
        geometry.scale(scale, scale, scale);
        return mesh;
    };

    p.createSphereMaterial = function()
    {
        this.sphereMaterial = new THREE.MeshPhongMaterial({
            //color: 0xA0A0A0,
            color: 0xFFFFFF,
            side: THREE.DoubleSide,
            shading: THREE.FlatShading,
            //bumpMap: texture,
            map: this.resourcesMap["triangle"]["result"],
            transparent:true
        });
    };

    p.sphereToSub = function(id)
    {
        if(id == 0)
        {
            this.sphereAppear();
        }
        else
        {
            this.sphereDisappear(id);
        }
    };

    p.sphereAppear = function()
    {
        this.sphereContainer.visible = true;
        this.sphereTweenObj ={"appearPer":0};
        if(this.sphereTween ) this.sphereTween.pause();
        this.sphereTween = TweenLite.to(this.sphereTweenObj, 2, { delay:0, appearPer:1,onCompleteScope:this, onComplete:function(){
            this.sphereAppearComplete();
        }});
        TweenLite.to(this.sphereMaterial, 0.2, { delay:0, opacity:1});
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].speed = (0.0025 + Math.random() * 0.0025*2)*1.5;
            //this.items[i].rho = 1;
        }
    };

    p.sphereAppearComplete = function()
    {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].speed *=0.3;
        }
    };

    p.sphereDisappear = function(id)
    {
        this.sphereTweenObj ={"disappearPer":0};
        if(this.sphereTween ) this.sphereTween.pause();
        this.sphereTween = TweenLite.to(this.sphereTweenObj, 2, { delay:0, disappearPer:1,onCompleteScope:this, onComplete:function(){
            this.sphereContainer.visible = false;
        }});
        TweenLite.to(this.sphereMaterial, 1, { delay:0.1, opacity:0});
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].speed = -(0.0025*2 + Math.random() * 0.0025)*3;
            //this.items[i].rho = 1;
        }
    };

    p.ccRener = function()
    {
        for (var i = 0; i < this.items.length; i++) {
           this.items[i].animate();
        }
    };
    /*--------------------------------------------------- cc end-----------------------------------------------------*/

    /*-------------------------------------------------- tip start---------------------------------------------------*/
    p.createTip = function()
    {
        this.cssScene.rotation.y = 1.2;
        //
        this.phoneTip = new THREE.CSS3DObject( $(".phoneTip")[0] );
        this.cssScene.add( this.phoneTip );
        this.phoneTip.position.set(-180,75,0);
        this.phoneTip.opacity =0.1;
        this.phoneTip.element.style.opacity =0;
        //
        this.itTip = new THREE.CSS3DObject( $(".itTip")[0] );
        this.cssScene.add( this.itTip );
        this.itTip.position.set(310,78,0);
        this.itTip.element.style.opacity =0;
        //
        this.digitalTip = new THREE.CSS3DObject( $(".digitalTip")[0] );
        this.cssScene.add( this.digitalTip );
        this.digitalTip.position.set(320,-110,0);
        this.digitalTip.element.style.opacity =0;

        this.anquan = new THREE.CSS3DObject( $(".anquan")[0] );
        this.cssScene.add( this.anquan );
        this.anquan.position.set(-220,-93,0);
        this.anquan.element.style.opacity =0;

        this.shipin = new THREE.CSS3DObject( $(".shipin")[0] );
        this.cssScene.add( this.shipin );
        this.shipin.position.set(20,-220,0);
        this.shipin.element.style.opacity =0;

        this.texts = new THREE.CSS3DObject( $(".texts")[0] );
        this.cssScene.add( this.texts );
        // this.texts.style.transform = translate3d(0, 0, 0);
        this.texts.position.set(-10,0,0);
        this.texts.element.style.opacity =0;

        this.plNums = new THREE.CSS3DObject( $(".plNums")[0] );
        this.cssScene.add( this.plNums );
        // this.texts.style.transform = translate3d(0, 0, 0);
        this.plNums.position.set(-20,210,0);
        this.plNums.element.style.opacity =0;

        this.tipAppear(5);
        //
        var cur = this;
        // $(".tipMC .tipIcon").click(function(){
        //     if($(this).parent(".tipMC").css("opacity") ==1)
        //     {
        //         var id =  $(".tipMC .tipIcon").index(this);
        //         var n = parseInt(id)+1;
        //         cur.$nav.eq(n).click();
        //     }
        // });
    };
    p.tipToSub = function(id)
    {
        if(id ==0)
        {
            this.tipAppear(2);
        }
        else
        {
            this.tipDisappear();
        }
    };
    p.tipAppear = function(delayTime)
    {

        TweenLite.to(this.cssScene.rotation, 2, { delay:2, y:0});
        TweenLite.to(this.phoneTip.element.style, 2, { delay:2, opacity:1,});
        TweenLite.to(this.itTip.element.style, 2, { delay:2, opacity:1});
        TweenLite.to(this.digitalTip.element.style, 2, { delay:2, opacity:1});
        TweenLite.to(this.anquan.element.style, 2, { delay:2, opacity:1});
        TweenLite.to(this.shipin.element.style, 2, { delay:2, opacity:1});
        TweenLite.to(this.texts.element.style, 2, { delay:2, opacity:1});
        TweenLite.to(this.plNums.element.style, 2, { delay:2, opacity:1});
    };

    p.tipDisappear = function()
    {
        TweenLite.to(this.cssScene.rotation, 2, { delay:0, y:1.2});
        TweenLite.to(this.phoneTip.element.style, 2, { delay:0, opacity:0});
        TweenLite.to(this.itTip.element.style, 2, { delay:0, opacity:0});
        TweenLite.to(this.digitalTip.element.style, 2, { delay:0, opacity:0});
    };
    /*-------------------------------------------------- tip end---------------------------------------------------*/

    /*-------------------------------------------------- txt start---------------------------------------------------*/
    // p.createTxt3c = function()
    // {
    //     var texture = this.resourcesMap["txt3c"]["result"];
    //     var material = new THREE.MeshBasicMaterial( { map: texture,opacity:0/*,alphaMap:map*/, side: THREE.DoubleSide,transparent:true,depthTest:false } );
    //     var w = material.map.image.width;
    //     var h = material.map.image.height;
    //     var geometry = new THREE.PlaneGeometry( w, h, 5,5 );
    //     this.txt3c = new THREE.Mesh( geometry, material );
    //     this.txt3c.scale.set(0.012,0.012,1);
    //     this.scene.add(this.txt3c);
    //     this.txt3c.position.z = 0;
    //     //
    //     this.txt3cAppear();
    // };

    p.txt3cToSub = function(id)
    {
        if(id == 0)
        {
            TweenLite.to(this.txt3c.material, 2, { delay:2, opacity:1});
        }
        else
        {
            TweenLite.to(this.txt3c.material, 2, { delay:0, opacity:0});
        }
    };

    p.txt3cAppear = function()
    {
        TweenLite.to(this.txt3c.material, 2, { delay:4, opacity:1});
    };
    /*-------------------------------------------------- txt start---------------------------------------------------*/
    //=================================================   threejs    end ==============================================//
    jd.C3 = C3;
})();