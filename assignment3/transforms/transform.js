"use strict";

function Transform() {
	this.rotate = new Rotate(this);
    this.translate = new Translate(this);
    this.scale = new Scale(this);
}

Transform.prototype.updateTransformMatrix = function(obj) {
	obj.transformMatrix = mult(obj.scaleMatrix, obj.rotationMatrix);
	obj.transformMatrix = mult(obj.transformMatrix, obj.translationMatrix);
}