/**
 * Title:
 * @author Mr Denzel
 * @create Date 2018-01-02 21:30
 * @version 1.0
 * Description:
 */
var DemoThree = {
    renderer: {},
    width: {},
    height: {},
    stats: {},
    camera: {},
    scene: {},
    light: {},
    createRender:function () {
        var tar = document.getElementById('canvas-frame');
        this.width = tar.clientWidth;
        this.height = tar.clientHeight;
        this.renderer = new THREE.WebGLRenderer({
            antialias : true
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.shadowMapEnabled = true;
        tar.appendChild(this.renderer.domElement);

        this.renderer.setClearColor(0xFFFFFF, 1.0);

        this.stats = new Stats();
        this.stats.domElement.style.position = 'fixed';
        this.stats.domElement.style.left = '0px';
        this.stats.domElement.style.top = '0px';
        document.body.appendChild(this.stats.domElement);
    },
    createCamera: function (perspective) {
        this.camera = perspective?(new THREE.PerspectiveCamera(45, this.width / this.height, 1, 10000)):
            (new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 10, 1000 ));
        //camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 10, 1000 );
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 500;
        this.camera.up.x = 0;
        this.camera.up.y = 1;
        this.camera.up.z = 0;
        this.camera.lookAt({
            x : 0,
            y : 0,
            z : 0
        });
    },
    createScene: function () {
        this.scene = new THREE.Scene();
    },
    createLight: function () {
        this.light  = new THREE.PointLight(0x0000ff,1, 400);
        this.light.position.set(100, 200, 100);
        this.light.castShadow = true;
        this.scene.add(this.light);
    },
    createMesh:function () {
        this.mesh = new THREE.Object3D();
        this.scene.add(this.mesh);
    },
/*    createObject:function () {
        var geometry = new THREE.BoxGeometry( 100, 100, 100 );
        var material = new THREE.MeshLambertMaterial( { color:0xFFFF00} );
        var mesh = new THREE.Mesh( geometry,material);
        mesh.position.set(200, 0, 0);
        mesh.castShadow = true;
        this.scene.add(mesh);

        var geometrya = new THREE.BoxGeometry( 100, 100, 100 );
        var materiala = new THREE.MeshLambertMaterial( { color:0x00FF00} );
        var mesha = new THREE.Mesh( geometrya,materiala);
        mesha.position.set(0, 0, 0);
        this.scene.add(mesha);
    },*/
    createObject:function () {
        var geometry = new THREE.SphereGeometry(100, 8, 6);
        this.mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial(0xffffff) );
        var edges = new THREE.EdgesHelper( this.mesh, 0x0000ff );

        this.scene.add(this.mesh);
        this.mesh.add(edges);
       // this.scene.add(edges);
    },
    init: function () {
        this.createRender();
        this.createCamera(true);
        this.createScene();
     //   this.createLight();
        this.createObject();
        this.renderer.render(this.scene, this.camera);
        animation();
    }
}

function animation()
{
    //renderer.clear();
    DemoThree.mesh.rotation.z =DemoThree.mesh.rotation.z +0.001;
    DemoThree.renderer.render(DemoThree.scene, DemoThree.camera);
    requestAnimationFrame(animation);
    DemoThree.stats.update();
}
DemoThree.init();