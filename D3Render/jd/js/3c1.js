/**
 * Created by 胥云钟 on 2017/5/18.
 */
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
            // cur.subTitleChange(id);
            // cur.numChange(id);
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
            {id:"dotCir", type:"texture", url:"images/3c/kongbai.png"},
            {id:"arrowCir", type:"texture", url:"images/3c/kongbai.png"},
            {id:"dateMC", type:"texture", url:"images/3c/kongbai.png"},
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

        this.initContainer();
        this.createParticleMaterial();
        this.createParticle();
        this.createCir();
        this.createBgParticle();

    };

    p.render = function()
    {
        if(this.renderer)
        {
            this.container.rotation.y +=0.01;
            this.particleRender();
            this.cirRender();
            this.bgParticleRender();
            // this.ccRener();
            this.renderer.render( this.scene, this.camera );
            this.cssRenderer.render( this.cssScene, this.camera );
        }
    };


    /*------------------------------threejs common part end--------------------------------------------*/

    p.initContainer = function()
    {
        this.container = new THREE.Object3D();
        this.scene.add(this.container);

    };

    /*-------------------------------------------------- title start--------------------------------------------------*/
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

        }
        this.bgParticle.geometry.attributes.position.needsUpdate = true;
        this.bgParticle.geometry.attributes.customOpacity.needsUpdate = true;
        this.bgParticle.geometry.attributes.customColor.needsUpdate = true;
        this.bgParticle.geometry.attributes.size.needsUpdate = true;
    };
    /*---------------------------------------------- bgParticle end-----------------------------------------------*/




    /*--------------------------------------------------- cc start-----------------------------------------------------*/
    p.createSphere = function() {
        this.items = [];
    };



    jd.C3 = C3;
})();