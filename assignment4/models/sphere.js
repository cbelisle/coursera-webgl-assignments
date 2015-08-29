// Use lines of latitude and longitude to get triangle strips with triangle fans at the poles


"use strict";

function Sphere(name) {

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

	this.latitude = 30;
	this.longitude = 30;
	this.radius = 1;

	this.name = name;

	this.initBuffers = function() {
        var vertexPositionData = [];
        var normalData = [];

        for (var latNumber=0; latNumber <= this.latitude; latNumber++) {
            var theta = latNumber * Math.PI / this.latitude;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

            for (var longNumber=0; longNumber <= this.longitude; longNumber++) {
                var phi = longNumber * 2 * Math.PI / this.longitude;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);

                var x = cosPhi * sinTheta;
                var y = cosTheta;
                var z = sinPhi * sinTheta;

                normalData.push(x);
                normalData.push(y);
                normalData.push(z);
                vertexPositionData.push(this.radius * x);
                vertexPositionData.push(this.radius * y);
                vertexPositionData.push(this.radius * z);
            }
        }

        var indexData = [];
        for (var latNumber=0; latNumber < this.latitude; latNumber++) {
            for (var longNumber=0; longNumber < this.longitude; longNumber++) {
                var first = (latNumber * (this.longitude + 1)) + longNumber;
                var second = first + this.longitude + 1;
                indexData.push(first);
                indexData.push(second);
                indexData.push(first + 1);

                indexData.push(second);
                indexData.push(second + 1);
                indexData.push(first + 1);
            }
        }

        if (this.vertexNormalBuffer === null) {
            this.vertexNormalBuffer = gl.createBuffer();
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
        this.vertexNormalBuffer.itemSize = 3;
        this.vertexNormalBuffer.numItems = normalData.length / 3;

        if (this.vertexPositionBuffer === null) {
        	this.vertexPositionBuffer = gl.createBuffer();
    	}
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
        this.vertexPositionBuffer.itemSize = 3;
        this.vertexPositionBuffer.numItems = vertexPositionData.length / 3;

        if (this.vertexIndexBuffer === null) {
        	this.vertexIndexBuffer = gl.createBuffer();
    	}
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
        this.vertexIndexBuffer.itemSize = 1;
        this.vertexIndexBuffer.numItems = indexData.length;
	}	

	this.initBuffers();
}

Sphere.prototype.setLatitude = function(latitude) {
	this.latitude = latitude / 1;
	this.initBuffers();
}

Sphere.prototype.setLongitude = function(longitude) {
	this.longitude = longitude / 1;
	this.initBuffers();
}

Sphere.prototype.setRadius = function(radius) {
	this.radius = radius / 50;
	this.initBuffers();
}

Sphere.prototype.getType = function() {
	return "sphere";
}