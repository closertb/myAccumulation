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
    init: function () {
        this.createRender();
        this.createCamera(true);
        this.createScene();
        this.createLight();
        this.createObject();
        animation();
    },
    createRender:function () {
        var tar = document.getElementById('canvas-frame');
        this.width = tar.clientWidth;
        this.height = tar.clientHeight;
        this.renderer = new THREE.WebGLRenderer({
            antialias : true
        });
        this.renderer.setSize(this.width, this.height);
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
        this.camera.position.z = 600;
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
        this.light = new THREE.DirectionalLight(0xFF0000, 1.0, 0);
        this.light.position.set(100, 100, 200);
        this.scene.add(this.light);
    },
    createObject:function () {
        var geometry = new THREE.CylinderGeometry( 100,150,400);
        var material = new THREE.MeshLambertMaterial( { color:0xFFFF00} );
        var mesh = new THREE.Mesh( geometry,material);
        mesh.position = new THREE.Vector3(0,0,0);
        this.scene.add(mesh);
    }
}

function animation()
{
    //renderer.clear();
    DemoThree.camera.position.x =DemoThree.camera.position.x +1;
    DemoThree.renderer.render(DemoThree.scene, DemoThree.camera);
    requestAnimationFrame(animation);
    DemoThree.stats.update();
}
DemoThree.init();