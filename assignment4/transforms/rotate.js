"use strict";

function Rotate(transform) {
	var transform = transform;

	this.updateRotationMatrix = function(obj) {
		obj.rotationMatrix = mat4();
		
		var x = obj.rotationAngles[0], y = obj.rotationAngles[1], z = obj.rotationAngles[2];

		obj.rotationMatrix = mult(obj.rotationMatrix, rotate(x, [1, 0, 0]));
		obj.rotationMatrix = mult(obj.rotationMatrix, rotate(y, [0, 1, 0]));
		obj.rotationMatrix = mult(obj.rotationMatrix, rotate(z, [0, 0, 1]));

		transform.updateTransformMatrix(obj);
	}
}

Rotate.prototype.X = function (obj, value) {
	obj.rotationAngles[0] = (value / 100) * 90;
	this.updateRotationMatrix(obj);
}

Rotate.prototype.Y = function (obj, value) {
	obj.rotationAngles[1] = (value / 100) * 90;
	this.updateRotationMatrix(obj);
}

Rotate.prototype.Z = function (obj, value) {
	obj.rotationAngles[2] = (value / 100) * 90;
	this.updateRotationMatrix(obj);
}