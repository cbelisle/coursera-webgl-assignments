var gl;
var canvas;

var isDrawing;
var vBuffer;
var nBuffer;
var cBuffer;
var maxNumVertices = 100;

var numLines;
var numLineIndices = [];
var lineWidth;
var pointsArray = [];
var normalsArray = [];
var index = 0;
var fColor;

var radius = 1.5;
var theta  = 0.0;
var phi    = 0.0;

const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var left = -3.0;
var right = 3.0;
var ytop = 3.0;
var bottom = -3.0;

var near = -10;
var far = 10;

var modelViewMatrix, projectionMatrix, normalMatrix;
var modelViewMatrixLoc, projectionMatrixLoc, normalMatrixLoc;
var transformMatrix, transformMatrixLoc;
var normalMatrix, normalMatrixLoc;
var isDistanceAttenuation, isDistanceAttenuationLoc;
var lights, lightsLoc;
lights = [];
lightsLoc = [];