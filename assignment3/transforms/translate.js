"use strict";

function Translate(transform) {
	var transform = transform;

	this.updateTranslationMatrix = function(obj) {
		obj.translationMatrix = mat4();

		var x = obj.translation[0], y = obj.translation[1], z = obj.translation[2];
		
		obj.translationMatrix = mult(obj.translationMatrix, translate(x, y, z));
		
		transform.updateTransformMatrix(obj);
	}
}

Translate.prototype.X = function (obj, value) {
	obj.translation[0] = (value / 50) - 1;
	this.updateTranslationMatrix(obj);
}

Translate.prototype.Y = function (obj, value) {
	obj.translation[1] = (value / 50) - 1;
	this.updateTranslationMatrix(obj);
}

Translate.prototype.Z = function (obj, value) {
	obj.translation[2] = (value / 50) - 1;
	this.updateTranslationMatrix(obj);
}