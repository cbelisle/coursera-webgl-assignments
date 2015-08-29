"use strict";

function Cone(name, isInitializing) {

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

    this.bottomRadius = 0.4;
    this.topRadius = 0;

    this.height = 0.8;
    this.radialSubdivisions = 12;
    this.verticalSubdivisions = 1;

    this.name = name;

    this.initBuffers = function() {
        this.vertexPositionBuffer = gl.createBuffer();
        this.vertexIndexBuffer = gl.createBuffer();
        this.vertexNormalBuffer = gl.createBuffer();

        this.createTruncatedCone(this.bottomRadius, this.topRadius, this.height, 
                                 this.radialSubdivisions, this.verticalSubdivisions, true, true,
                                 this.vertexPositionBuffer, this.vertexIndexBuffer,
                                 this.vertexNormalBuffer);
    }

    if (typeof isInitializing === 'undefined' || isInitializing) {
	   this.initBuffers();
    }
}

Cone.prototype.createTruncatedCone = function(bottomRadius, topRadius, height, radialSubdivisions, 
                                              verticalSubdivisions, topCap, bottomCap,
                                              vertexPositionBuffer, vertexIndexBuffer, vertexNormalBuffer) {
    var extra = (topCap ? 2 : 0) + (bottomCap ? 2 : 0);

    var numVertices = (radialSubdivisions + 1) * (verticalSubdivisions + 1 + extra);
    var positions = [];
    var normals = [];
    var indices = [];

    var vertsAroundEdge = radialSubdivisions + 1;

    var slant = Math.atan2(bottomRadius - topRadius, height);
    var cosSlant = Math.cos(slant);
    var sinSlant = Math.sin(slant);

    var start = topCap ? -2 : 0;
    var end = verticalSubdivisions + (bottomCap ? 2 : 0);

    for (var yy = start; yy <= end; ++yy) {
        var v = yy / verticalSubdivisions
        var y = height * v;
        var ringRadius;

        if (yy < 0) {
            y = 0;
            v = 1;
            ringRadius = bottomRadius;
        } else if (yy > verticalSubdivisions) {
            y = height;
            v = 1;
            ringRadius = topRadius;
        } else {
            ringRadius = bottomRadius +
                (topRadius - bottomRadius) * (yy / verticalSubdivisions);
        }

        if (yy == -2 || yy == verticalSubdivisions + 2) {
            ringRadius = 0;
            v = 0;
        }
    
        y -= height / 2;
        
        for (var ii = 0; ii < vertsAroundEdge; ++ii) {
            var sin = Math.sin(ii * Math.PI * 2 / radialSubdivisions);
            var cos = Math.cos(ii * Math.PI * 2 / radialSubdivisions);

            positions.push(sin * ringRadius);
            positions.push(y);
            positions.push(cos * ringRadius);

            normals.push((yy < 0 || yy > verticalSubdivisions) ? 0 : (sin * cosSlant));
            normals.push((yy < 0) ? -1 : (yy > verticalSubdivisions ? 1 : sinSlant));
            normals.push((yy < 0 || yy > verticalSubdivisions) ? 0 : (cos * cosSlant));
        }
    }

    for (var yy = 0; yy < verticalSubdivisions + extra; ++yy) {
        for (var ii = 0; ii < radialSubdivisions; ++ii) {
          indices.push(vertsAroundEdge * (yy + 0) + 0 + ii);
          indices.push(vertsAroundEdge * (yy + 0) + 1 + ii);
          indices.push(vertsAroundEdge * (yy + 1) + 1 + ii);

          indices.push(vertsAroundEdge * (yy + 0) + 0 + ii);
          indices.push(vertsAroundEdge * (yy + 1) + 1 + ii);
          indices.push(vertsAroundEdge * (yy + 1) + 0 + ii);
        }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    vertexNormalBuffer.itemSize = 3;
    vertexNormalBuffer.numItems = normals.length / 3;

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    vertexPositionBuffer.itemSize = 3;
    vertexPositionBuffer.numItems = positions.length / 3;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    vertexIndexBuffer.itemSize = 1;
    vertexIndexBuffer.numItems = indices.length;
}

Cone.prototype.setHeight = function(height) {
    this.height = height / 1;
    this.initBuffers();
}

Cone.prototype.setRadialSubdiv = function(value) {
    this.radialSubdivisions = value / 1;
    this.initBuffers();
}

Cone.prototype.setBottomRadius = function(radius) {
    this.bottomRadius = radius / 50;
    this.initBuffers();
}

Cone.prototype.getType = function() {
    return "cone";
}