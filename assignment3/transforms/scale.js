"use strict";

function Scale(transform) {
	var transform = transform;

	this.updateScaleMatrix = function(obj) {
		obj.scaleMatrix = mat4();

		var x = obj.scale[0], y = obj.scale[1], z = obj.scale[2];

		obj.scaleMatrix = mult(obj.scaleMatrix, scalem(x, y, z));
		transform.updateTransformMatrix(obj);
	}
}

Scale.prototype.X = function (obj, value) {
	obj.scale[0] = (value / 50);
	this.updateScaleMatrix(obj);
}

Scale.prototype.Y = function (obj, value) {
	obj.scale[1] = (value / 50);
	this.updateScaleMatrix(obj);
}

Scale.prototype.Z = function (obj, value) {
	obj.scale[2] = (value / 50);
	this.updateScaleMatrix(obj);
}