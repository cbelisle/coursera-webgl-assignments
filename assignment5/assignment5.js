"use strict";

function Assignment5() {
	var that = this;
	this.sphere = {};
	this.vBuffer = {};
	this.vPosition = {};
	this.vTexCoord = {};
	this.pointsArray = [];
	this.thetaLoc = null;
    this.textureId = null;
	this.theta = [0.0, 0.0, 0.0];
    this.textureCount = 0;
    this.textureId = 0.1;
    this.usePlanarCoord = false;
    this.useCylinderCoord = false;

    // setup drawing app events
    this.setupControls = function(canvas) {
        document.getElementById("rotateX").addEventListener("input", function(event) {
            that.theta[0] = (document.getElementById("rotateX").value * 360) / 100;
        });

        document.getElementById("rotateY").addEventListener("input", function(event) {
            that.theta[1] = (document.getElementById("rotateY").value * 360) / 100;
        });

        document.getElementById("rotateZ").addEventListener("input", function(event) {
            that.theta[2] = (document.getElementById("rotateZ").value * 360) / 100;
        });

        document.getElementById("texChooser").addEventListener("change", function(event) {
            if (document.getElementById("texChooser").value === "chessboard") {
                that.textureId = 0.1;
                that.usePlanarCoord = false;
                that.useCylinderCoord = false;
            }
            else if (document.getElementById("texChooser").value === "earth") {
                that.textureId = 0.3;
                that.usePlanarCoord = false;
                that.useCylinderCoord = false;
            }
            else if (document.getElementById("texChooser").value === "chessboard-cylinder") {
                that.textureId = 0.1;
                that.usePlanarCoord = false;
                that.useCylinderCoord = true;
            }
            else if (document.getElementById("texChooser").value === "chessboard-planar") {
                that.textureId = 0.1;
                that.usePlanarCoord = true;
                that.useCylinderCoord = false;
            }
            else { // pattern
                that.textureId = 0.2;
                that.usePlanarCoord = false;
                that.useCylinderCoord = false;
            }
        });
    }

    this.render = function() {

    	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    	gl.uniform3fv(that.thetaLoc, that.theta);
        gl.uniform1f(that.textureIdLoc, that.textureId);

    	gl.bindBuffer(gl.ARRAY_BUFFER, that.sphere.vertexPositionBuffer);
        gl.vertexAttribPointer(that.vPosition, that.sphere.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        if (that.usePlanarCoord) {
            gl.bindBuffer(gl.ARRAY_BUFFER, that.sphere.vertexTexturePlanarCoordBuffer);
            gl.vertexAttribPointer(that.vTexCoord, that.sphere.vertexTexturePlanarCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
        }
        else if (that.useCylinderCoord) {
            gl.bindBuffer(gl.ARRAY_BUFFER, that.sphere.vertexTextureCylinderCoordBuffer);
            gl.vertexAttribPointer(that.vTexCoord, that.sphere.vertexTextureCylinderCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
        }
        else if (that.textureId == 0.2) {
            gl.bindBuffer(gl.ARRAY_BUFFER, that.sphere.vertexRepeatTextureCoordBuffer);
            gl.vertexAttribPointer(that.vTexCoord, that.sphere.vertexRepeatTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
        }
        else {
            gl.bindBuffer(gl.ARRAY_BUFFER, that.sphere.vertexTextureCoordBuffer);
            gl.vertexAttribPointer(that.vTexCoord, that.sphere.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
        }

    	gl.drawElements(gl.TRIANGLES, that.sphere.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    	window.requestAnimFrame(that.render);
    }

    this.getImage = function(texSize) {
    	var image1 = new Array()

    	for (var i =0; i<texSize; i++)  image1[i] = new Array();
    	for (var i =0; i<texSize; i++) 
        	for ( var j = 0; j < texSize; j++) 
           		image1[i][j] = new Float32Array(4);
    	for (var i =0; i<texSize; i++) for (var j=0; j<texSize; j++) {
        	var c = (((i & 0x8) == 0) ^ ((j & 0x8)  == 0));
        	image1[i][j] = [c, c, c, 1];
    	}

		// Convert floats to ubytes for texture

		var image2 = new Uint8Array(4*texSize*texSize);

    	for ( var i = 0; i < texSize; i++ ) 
        	for ( var j = 0; j < texSize; j++ ) 
           		for(var k =0; k<4; k++) 
	                image2[4*texSize*i+4*j+k] = 255*image1[i][j][k];

	    return image2;
    }

    this.configureTexture = function(image, texSize) {
    	var texture = gl.createTexture();

        gl.activeTexture( gl.TEXTURE0 + that.textureCount );
	    gl.bindTexture( gl.TEXTURE_2D, texture );
	    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
	    gl.generateMipmap( gl.TEXTURE_2D );
	    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
	    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

        var textureLoc = gl.getUniformLocation(that.program, "texture" + that.textureCount);
        gl.uniform1i(textureLoc, that.textureCount);

        that.textureCount++;
	}

    this.configureTextureFromImage = function(image) {
        var texture = gl.createTexture();

        gl.activeTexture( gl.TEXTURE0 + that.textureCount );
        gl.bindTexture( gl.TEXTURE_2D, texture );
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        var textureLoc = gl.getUniformLocation(that.program, "texture" + that.textureCount);
        gl.uniform1i(textureLoc, that.textureCount);

        that.textureCount++;
    }

    this.configureTextureFromImages = function(images) {
        for(var i = 0; i < images.length; i++) {
            var texture = gl.createTexture();

            gl.activeTexture( gl.TEXTURE0 + that.textureCount );
            gl.bindTexture( gl.TEXTURE_2D, texture );
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
            gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, images[i] );
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

            var textureLoc = gl.getUniformLocation(that.program, "texture" + that.textureCount);
            gl.uniform1i(textureLoc, that.textureCount);

            that.textureCount++;
        }

        that.render();
    }

    this.loadImage = function(url, callback) {
        var image = new Image();
        image.src = url;
        image.onload = callback;
        return image;
    }

    this.loadImages = function(urls, callback) {
        var images = [];
        var imagesToLoad = urls.length;
         
        // Called each time an image finished loading.
        var onImageLoad = function() {
            --imagesToLoad;

            // If all the images are loaded call the callback.
            if (imagesToLoad == 0) {
                callback(images);
            }
        };
         
        for (var ii = 0; ii < imagesToLoad; ++ii) {
            var image = that.loadImage(urls[ii], onImageLoad);
            images.push(image);
        }
    }
}

Assignment5.prototype.initialize = function() {
    var that = this;

	var canvas = document.getElementById("gl-canvas");
    var pictureLoaded = false;

	gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

	this.setupControls(canvas);

	gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.2, 0.2, 0.2, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    this.program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( this.program );

    this.vPosition = gl.getAttribLocation(this.program, "vPosition");
    gl.enableVertexAttribArray(this.vPosition);

    this.vTexCoord = gl.getAttribLocation(this.program, "vTexCoord");
    gl.enableVertexAttribArray(this.vTexCoord);

    this.configureTexture(this.getImage(128), 128);

    this.thetaLoc = gl.getUniformLocation(this.program, "theta");
    this.textureIdLoc = gl.getUniformLocation(this.program, "textureId");

    this.sphere = new Sphere();

    var image = new Image();
    image.src = "congruent_outline.png";
    image.onload = function() {
        that.configureTextureFromImage(image);

        that.loadImages([
        "earthmap1k.jpg",
        ], that.configureTextureFromImages);
    };    
}

window.onload = function() {
	var main = new Assignment5();
	main.initialize();
};