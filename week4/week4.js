"use strict";

var canvas;
var gl;


var maxNumTriangles = 5000;
var maxNumVertices  = 3 * maxNumTriangles;
var index = 0;

var isDrawing = false;

var vBuffer;
var cBuffer;
var vPsBuffer;

// DAT.gui
var gui;

var hexColor = "#000000";

var params = {
    color: hexColor,
    clear: function() {
        index = 0;
    }
};

function draw(event) {
    // Position
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );

    var x = 2*event.clientX/canvas.width-1;
    var y = 2*(canvas.height-event.clientY)/canvas.height-1
    var p = vec2(x, y);
    gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(p));

    // Color
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);

    var color = hexToRgb(hexColor);
    var c = vec4(color.r / 255, color.g / 255, color.b / 255, 1.0);
    gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(c));

    index++;
}

function setupDrawingAppEvents(canvas) {
    canvas.addEventListener("mousedown", function(event){
      isDrawing = true;
    });

    canvas.addEventListener("mouseup", function(event){
      isDrawing = false;
    });
    
    canvas.addEventListener("mousemove", function(event){
        if(isDrawing) {
            draw(event);
        }
    });
}

window.onload = function init() {
    gui = new dat.GUI();

    gui.addColor(params, 'color').name("Color").onChange(function(value) {
        hexColor = value;
        render();
    });
    gui.add(params, 'clear').name("Clear");    

    gui.open();

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    setupDrawingAppEvents(canvas);

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // vPosition
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // vColor
    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    render();
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
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, index );

    window.requestAnimFrame(render);
}
