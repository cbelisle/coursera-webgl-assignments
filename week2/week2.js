"use strict";

var gl;
var points = [];

var numTimesToSubdivide = 5;

var theta = 0.1;
var thetaLoc;

var twist = 2;
var twistLoc;

var vertices_pos = [
	-0.5, -1,
	0, 1,
	1, -0.5
];

var bgcolor = '#ffffff';
var color = '#000000';
var colorLoc;

var verticeEntries = [];

var params = {
	vertice_x1: vertices_pos[0],
	vertice_y1: vertices_pos[1],
	vertice_x2: vertices_pos[2],
	vertice_y2: vertices_pos[3],
	vertice_x3: vertices_pos[4],
	vertice_y3: vertices_pos[5],
	twist: twist,
	tessellation: numTimesToSubdivide,
	theta: theta
};

// DAT.gui
var gui;

window.onload = function init() {
	gui = new dat.GUI();

	gui.add(params, 'twist', -70, 70).name("Twist").onChange(function(value){
		twist = value;
		render();
	});
	gui.add(params, 'tessellation', 0, 10).step(1).name("Tessellation").onChange(function(value){
		numTimesToSubdivide = value;
		render();
	});
	gui.add(params, 'theta', -10, 10).step(0.1).name("Angle").onChange(function(value){
		theta = value;
		render();
	});
	gui.add(params, 'vertice_x1').name("1st vertice - X").onChange(function(value) {
		vertices_pos[0] = value;
		render();
	});
	gui.add(params, 'vertice_y1').name("1st vertice - Y").onChange(function(value) {
		vertices_pos[1] = value;
		render();
	});
	gui.add(params, 'vertice_x2').name("2nd vertice - X").onChange(function(value) {
		vertices_pos[2] = value;
		render();
	});
	gui.add(params, 'vertice_y2').name("2nd vertice - Y").onChange(function(value) {
		vertices_pos[3] = value;
		render();
	});
	gui.add(params, 'vertice_x3').name("3rd vertice - X").onChange(function(value) {
		vertices_pos[4] = value;
		render();
	});
	gui.add(params, 'vertice_y3').name("3rd vertice - Y").onChange(function(value) {
		vertices_pos[5] = value;
		render();
	});

	gui.open();

    update();
};

function update() {	

    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) {
    	alert( "WebGL isn't available" );
    	return;
    }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 8*Math.pow(3, 11), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation( program, "theta" );
    twistLoc = gl.getUniformLocation( program, "twist" );
    colorLoc = gl.getUniformLocation( program, "vColor" );

    render();
}

function triangle( a, b, c ) {
    points.push( a, b, c );
}

function divideTriangle( a, b, c, count ) {
    // check for end of recursion
    if ( count === 0 ) {
        triangle( a, b, c );
    }
    else {

        //bisect the sides

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // three new triangles

        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
    }
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function render() {
	var vertices = [
        vec2( vertices_pos[0], vertices_pos[1] ),
        vec2( vertices_pos[2], vertices_pos[3] ),
        vec2( vertices_pos[4], vertices_pos[5] )
    ];

	divideTriangle( vertices[0], vertices[1], vertices[2], numTimesToSubdivide);

	gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));

	gl.clearColor( hexToRgb(bgcolor).r / 255, hexToRgb(bgcolor).g / 255, hexToRgb(bgcolor).b / 255, 1 );
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1f(thetaLoc, theta);
    gl.uniform1f(twistLoc, twist);

    gl.drawArrays(gl.TRIANGLES, 0, points.length);

    points = [];
}
