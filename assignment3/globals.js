var gl;
var canvas;

var isDrawing;
var vBuffer;
var cBuffer;
var maxNumVertices = 100;

var numLines;
var numLineIndices = [];
var lineWidth;
var pointsArray = [];
var index = 0;
var fColor;

var radius = 6.0;
var theta  = 0.0;
var phi    = 0.0;

const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var left = -2.0;
var right = 2.0;
var ytop = 2.0;
var bottom = -2.0;

var near = -10;
var far = 10;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var transformMatrix, transformMatrixLoc;

function getIdentity() {
	return mat4(
        vec4( 1, 0, 0, 0 ),
        vec4( 0, 1, 0, 0 ),
        vec4( 0, 0, 1, 0 ),
        vec4( 0, 0, 0, 1 )
    );
}