/**
 * Created by Molay on 15/10/30.
 */

WS.TrianglePieceGeometry = function (width, height, thickness) {
    THREE.BufferGeometry.call(this);

    this.type = 'TrianglePieceGeometry';

    this.parameters = {
        width: width,
        height: height,
        thickness: thickness
    };

    width = width || 2;
    height = height || 1;
    thickness = thickness || 0.04;

    var halfWidth = width / 2;
    var halfHeight = height / 2;
    var z1 = thickness / 2;
    var z2 = -z1;
    var vertices = [
        [-halfWidth, -halfHeight, z1],
        [halfWidth, -halfHeight, z1],
        [0, halfHeight, z1],
        [-halfWidth, -halfHeight, z2],
        [halfWidth, -halfHeight, z2],
        [0, halfHeight, z2]
    ];
    var indices = [
        0, 1, 2,
        3, 4, 5,
        0, 1, 4,
        0, 3, 4,
        1, 2, 5,
        1, 4, 5,
        0, 2, 5,
        0, 3, 5
    ];

    var vertexCount = 6;
    var positions = new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3);
    var normals = new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3);
    var uvs = new THREE.BufferAttribute(new Float32Array(vertexCount * 2), 2);

    var vector3 = new THREE.Vector3();
    var index = 0;
    for (var i = 0; i < vertices.length; i++) {
        var verticesRow = vertices[i];
        vector3.set(verticesRow[0], verticesRow[1], verticesRow[2]);
        // uv on the depth face
        //var u = index % 3 / 2;
        //var v = Math.floor(index / 3) / 1;

        positions.setXYZ(index, vector3.x, vector3.y, vector3.z);
        vector3.normalize();
        normals.setXYZ(index, vector3.x, vector3.y, vector3.z);

        // uv on the triangle face.
        var k = index % 3;
        if (k == 0)
            uvs.setXY(index, 0.0, 1 - 1);
        else if (k == 1)
            uvs.setXY(index, 1.0, 1 - 1);
        else if (k == 2)
            uvs.setXY(index, 0.5, 1 - 0);

        index++;
    }

    this.setIndex(new THREE.Uint16Attribute(indices, 1));
    this.addAttribute('position', positions);
    this.addAttribute('normal', normals);
    this.addAttribute('uv', uvs);
};

WS.TrianglePieceGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
WS.TrianglePieceGeometry.prototype.constructor = WS.TrianglePieceGeometry;

WS.TrianglePieceGeometry.prototype.clone = function () {

    var parameters = this.parameters;

    return new WS.TrianglePieceGeometry(
        parameters.width,
        parameters.height,
        parameters.thickness
    );

};