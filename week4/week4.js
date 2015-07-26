"use strict";

var canvas;
var gl;


var maxNumTriangles = 5000;
var maxNumVertices  = 3 * maxNumTriangles;
var index = 0;
var lineWidth = 1;

var numLines = 0;
var numPoints = 0;

var numPointIndices = [];
var numLineIndices = [];

numPointIndices[0] = 0;
numLineIndices[0] = 0;

var startLines = [0];
var startPoints = [0];

var isDrawing = false;

var vBuffer;
var cBuffer;

// DAT.gui
var gui;

var hexColor = "#000000";

var params = {
    color: hexColor,
    lineWidth: lineWidth,
    clear: function() {
        index = 0;
        startLines = [];
        startPoints = [];
        numLineIndices = [];
        numPointIndices = [];
        gl.clear( gl.COLOR_BUFFER_BIT );
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

    if (lineWidth === 1) {
        numLineIndices[numLines]++;
    }
    else if (lineWidth === 2) {
        numPointIndices[numPoints]++;
    }
    index++;
}

function setupDrawingAppEvents(canvas) {
    canvas.addEventListener("mousedown", function(event){
      isDrawing = true;
      if (lineWidth === 1) {
        numLines++;
        numLineIndices[numLines] = 0;
        startLines[numLines] = index;
        draw(event);
      }
      else if (lineWidth === 2) {
        numPoints++;
        numPointIndices[numPoints] = 0;
        startPoints[numPoints] = index;
      }
    });

    canvas.addEventListener("mouseup", function(event){
      isDrawing = false;
      if (lineWidth === 1) {
        draw(event);
      }
    });
    
    canvas.addEventListener("mousemove", function(event){
      if(isDrawing) {
          if (lineWidth === 1) {
              draw(event);
          }
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
    gui.add(params, 'lineWidth', 1, 2).step(1).name('Line Width').onChange(function(value) {
        lineWidth = value;
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

    for(var i=0; i<startLines.length; i++) {
        gl.drawArrays( gl.LINES, startLines[i], numLineIndices[i] );
    }

    for(var i=0; i<startPoints.length; i++) {
        gl.drawArrays( gl.POINTS, startPoints[i], numPointIndices[i] );
    }

    window.requestAnimFrame(render);
}
