/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author DingYueming
 */

THREE.VertexLoader = function ( manager ) {

	if ( typeof manager === 'boolean' ) {

		console.warn( 'THREE.VertexLoader: showStatus parameter has been removed from constructor.' );
		manager = undefined;

	}

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.VertexLoader.prototype = {

	constructor: THREE.VertexLoader,

	load: function( url, onLoad, onProgress, onError ) {
		var scope = this;
		var loader = new THREE.XHRLoader( this.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.load( url, function ( text ) {
			var json = JSON.parse( text );
			if ( onLoad !== undefined ) {
				var object = scope.parse( json );
				onLoad( object.geometry );
			}
		} );
	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	},
	
	parse: function ( json ) {
		var geometry = new THREE.Geometry();
		var vertices = json.vertices;
		var offset = 0;
		var zLength = vertices.length;

		while ( offset < zLength ) {

			vertex = new THREE.Vector3();

			vertex.x = vertices[ offset ++ ];
			vertex.y = vertices[ offset ++ ];
			vertex.z = vertices[ offset ++ ];

			geometry.vertices.push( vertex );

		}
		return { geometry: geometry };
	}
};
