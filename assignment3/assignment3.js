"use strict";

function Assignment3() {

    var that = this;
    var shapes = [];
    var selectedShape;
    var program;
    var vPosition;

    this.objPicker = document.getElementById("objPicker");

    var transform = new Transform();

    this.sphereCount = 0;
    this.coneCount = 0;
    this.cylinderCount = 0;

    // setup drawing app events
    this.setupControls = function(canvas) {
        var that = this;

        document.getElementById("btnCreate").addEventListener("click", function(event) {
            var shape = document.getElementById("shapeChooser").value;
            var newShape;

            if (shape === "sphere") {
                newShape = new Sphere("Sphere" + ++that.sphereCount);                
            }
            else if (shape === "cone") {
                newShape = new Cone("Cone" + ++that.coneCount);
            }
            else if (shape === "cylinder") {
                newShape = new Cylinder("Cylinder" + ++that.cylinderCount);
            }

            shapes[newShape.name] = newShape;

            var option = document.createElement("option");
            option.text = newShape.name;
            option.selected = 'selected';
            that.objPicker.add(option);

            var evObj = document.createEvent("Events");
            evObj.initEvent("click", true, false);
            that.objPicker.dispatchEvent(evObj);
        });

        document.getElementById("objPicker").addEventListener("click", function(event) {
            if (typeof that.selectedShape !== 'undefined') {
                var previousType = that.selectedShape.getType();
                document.getElementById(previousType.toLowerCase() + "Menu").style.display = "none";
            }

            that.selectedShape = shapes[document.getElementById("objPicker").value];

            var currentType = that.selectedShape.getType();            
            document.getElementById(currentType.toLowerCase() + "Menu").style.display = "block";
        });

        /**************************** Sphere ************************************/
        // Latitude
        document.getElementById("sphereLatitude").addEventListener("change", function(event) {
            that.selectedShape.setLatitude(document.getElementById("sphereLatitude").value);
        });
        
        // Longitude
        document.getElementById("sphereLongitude").addEventListener("change", function(event) {
            that.selectedShape.setLongitude(document.getElementById("sphereLongitude").value);
        });

        // Radius
        document.getElementById("sphereRadius").addEventListener("change", function(event) {
            that.selectedShape.setRadius(document.getElementById("sphereRadius").value);
        });

        /**************************** Cone ************************************/
        // Height
        document.getElementById("coneHeight").addEventListener("change", function(event) {
            that.selectedShape.setHeight(document.getElementById("coneHeight").value);
        });
        
        // Radial Subdivisions
        document.getElementById("coneRadialSubdiv").addEventListener("change", function(event) {
            that.selectedShape.setRadialSubdiv(document.getElementById("coneRadialSubdiv").value);
        });

        // Bottom Radius
        document.getElementById("coneBottomRadius").addEventListener("change", function(event) {
            that.selectedShape.setBottomRadius(document.getElementById("coneBottomRadius").value);
        });

        /**************************** Cylinder ************************************/
        // Height
        document.getElementById("cylinderHeight").addEventListener("change", function(event) {
            that.selectedShape.setHeight(document.getElementById("cylinderHeight").value);
        });
        
        // Radial Subdivisions
        document.getElementById("cylinderRadialSubdiv").addEventListener("change", function(event) {
            that.selectedShape.setRadialSubdiv(document.getElementById("cylinderRadialSubdiv").value);
        });

        // Radius
        document.getElementById("cylinderRadius").addEventListener("change", function(event) {
            that.selectedShape.setRadius(document.getElementById("cylinderRadius").value);
        });

        //////////////////////////////////////////////////////////////////////////////////////////
        document.getElementById("rotateX").addEventListener("change", function(event) {
            transform.rotate.X(that.selectedShape, document.getElementById("rotateX").value);
        });

        document.getElementById("rotateY").addEventListener("change", function(event) {
            transform.rotate.Y(that.selectedShape, document.getElementById("rotateY").value);
        });

        document.getElementById("rotateZ").addEventListener("change", function(event) {
            transform.rotate.Z(that.selectedShape, document.getElementById("rotateZ").value);
        });

        document.getElementById("translateX").addEventListener("change", function(event) {
            transform.translate.X(that.selectedShape, document.getElementById("translateX").value);
        });

        document.getElementById("translateY").addEventListener("change", function(event) {
            transform.translate.Y(that.selectedShape, document.getElementById("translateY").value);
        });

        document.getElementById("translateZ").addEventListener("change", function(event) {
            transform.translate.Z(that.selectedShape, document.getElementById("translateZ").value);
        });

        document.getElementById("scaleX").addEventListener("change", function(event) {
            transform.scale.X(that.selectedShape, document.getElementById("scaleX").value);
        });

        document.getElementById("scaleY").addEventListener("change", function(event) {
            transform.scale.Y(that.selectedShape, document.getElementById("scaleY").value);
        });

        document.getElementById("scaleZ").addEventListener("change", function(event) {
            transform.scale.Z(that.selectedShape, document.getElementById("scaleZ").value);
        });
    }

    this.hexToRgb = function(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    this.render = function() {
        const black = vec4(0.0, 0.0, 0.0, 1.0);
        const red = vec4(1.0, 0.0, 0.0, 1.0);
        const white = vec4(1.0, 1.0, 1.0, 1.0);

        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

        var eye = vec3( radius*Math.sin(theta)*Math.cos(phi), 
                        radius*Math.sin(theta)*Math.sin(phi),
                        radius*Math.cos(theta));

        modelViewMatrix = lookAt( eye, at, up );
        projectionMatrix = ortho( left, right, bottom, ytop, near, far );

        gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
        gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

        for (var key in shapes) {
            var element = shapes[key];
            gl.bindBuffer(gl.ARRAY_BUFFER, element.vertexPositionBuffer);
            gl.vertexAttribPointer(that.vPosition, element.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.uniformMatrix4fv(transformMatrixLoc, false, flatten(element.transformMatrix));

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, element.vertexIndexBuffer);
            gl.uniform4fv(fColor, flatten(red));
            gl.drawElements(gl.TRIANGLES, element.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

            if (that.selectedShape !== undefined && key == that.selectedShape.name) {
                gl.uniform4fv(fColor, flatten(white));
            }
            else {
                gl.uniform4fv(fColor, flatten(black));
            }
            gl.drawElements(gl.LINE_LOOP, element.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        }
        

        window.requestAnimFrame(that.render);
    }
};

Assignment3.prototype.initialize = function(menu, canvas) {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if ( !gl ) {
        alert( "WebGL isn't available" );
    }
    
    this.setupControls(canvas);

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 2.0);

    this.program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( this.program );

    // vPosition
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    this.vPosition = gl.getAttribLocation(this.program, "vPosition");
    gl.vertexAttribPointer(this.vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.vPosition);

    fColor = gl.getUniformLocation(this.program, "fColor");

    modelViewMatrixLoc = gl.getUniformLocation( this.program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( this.program, "projectionMatrix" );
    transformMatrixLoc = gl.getUniformLocation( this.program, "transformMatrix" );

    this.render();
}
