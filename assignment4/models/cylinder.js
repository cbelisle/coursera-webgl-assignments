"use strict";

function Cylinder(name) {
	this.vertexPositionBuffer = null;
	this.vertexIndexBuffer = null;
    this.vertexNormalBuffer = null;

    this.rotationAngles = [0, 0, 0];
    this.previousRotationAngles = [0, 0, 0];

    this.translation = [0, 0, 0];
    this.previousTranslation = [0, 0, 0];

    this.scale = [1, 1, 1];

    this.rotationMatrix = mat4();
    this.translationMatrix = mat4();
    this.scaleMatrix = mat4();
    this.transformMatrix = mat4();

    this.radius = 0.4;
    this.height = 0.8;
    this.radialSubdivisions = 12;
    this.verticalSubdivisions = 1;

    this.name = name;

	this.initBuffers = function() {

        this.vertexPositionBuffer = gl.createBuffer();
        this.vertexIndexBuffer = gl.createBuffer();
        this.vertexNormalBuffer = gl.createBuffer();

        var cone = new Cone("", false);
        cone.createTruncatedCone(this.radius, this.radius, this.height, 
                                 this.radialSubdivisions, this.verticalSubdivisions, true, true,
                                 this.vertexPositionBuffer, this.vertexIndexBuffer, this.vertexNormalBuffer);
	}

	this.initBuffers();
}

Cylinder.prototype.setHeight = function(height) {
    this.height = height / 1;
    this.initBuffers();
}

Cylinder.prototype.setRadialSubdiv = function(value) {
    this.radialSubdivisions = value / 1;
    this.initBuffers();
}

Cylinder.prototype.setRadius = function(radius) {
    this.radius = radius / 50;
    this.initBuffers();
}

Cylinder.prototype.getType = function() {
    return "cylinder";
}