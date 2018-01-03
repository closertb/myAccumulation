/**
 * Title:在三维坐标系中画一个盒子
 * @author Mr Denzel
 * @create Date 2018-01-02 21:30
 * @version 1.0
 * Description:
 */
var PI = Math.PI;
var DemoThree = {
    renderer: {},
    width: {},
    height: {},
    stats: {},
    camera: {},
    scene: {},
    mesh:{},
    light: {},
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
        this.camera.position.y = 300;
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
        var geometry = new THREE.BoxGeometry( 100, 100, 100 );
        for ( var i = 0; i < geometry.faces.length; i += 2 ) {

            var hex = Math.random() * 0xffffff;
            geometry.faces[ i ].color.setHex( hex );
            geometry.faces[ i + 1 ].color.setHex( hex );

        }
        var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors} );
        this.mesh = new THREE.Mesh( geometry,material);
        this.mesh.position = new THREE.Vector3(0,0,0);
        this.scene.add(this.mesh);
    },
    createGrid:function (size,small) {
        var gridXZ = new THREE.GridHelper(size,small,0x0000ff, 0x808080);
        gridXZ.position.set(size,0,size);
        this.mesh.add(gridXZ);
        var gridXY = new THREE.GridHelper(size,small,0x0000ff, 0x808080);
        gridXY.position.set(size,size,0);
        gridXY.rotation.x = PI/2;
        this.mesh.add(gridXY);
        var gridYZ = new THREE.GridHelper(size,small,0x0000ff, 0x808080);
        gridYZ.position.set(0,size,size);
        gridYZ.rotation.z = PI/2;
        this.mesh.add(gridYZ);
    },
    init: function () {
        this.createRender();
        this.createCamera(true);
        this.createScene();
        this.createLight();
        this.createObject();
        this.createGrid(80,10);
        animation();
    }
}

function animation()
{
    //renderer.clear();
    DemoThree.mesh.rotation.y +=0.001;
    DemoThree.renderer.render(DemoThree.scene, DemoThree.camera);
    requestAnimationFrame(animation);
    DemoThree.stats.update();
}
DemoThree.init();