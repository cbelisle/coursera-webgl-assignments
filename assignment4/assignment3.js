"use strict";

function Assignment3() {

    var that = this;
    var shapes = [];
    var selectedShape;
    var program;
    var vPosition;
    var vNormal;

    this.lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );

    // Gold material
    this.materialAmbient = vec4( 0.24725, 0.1995, 0.0745, 1.0 );
    this.materialDiffuse = vec4( 0.75164, 0.60648, 0.22648, 1.0 );
    this.materialSpecular = vec4( 0.628281, 0.555802, 0.366065, 1.0 );
    this.materialShininess = 150.2;

    this.objPicker = document.getElementById("objPicker");

    var transform = new Transform();

    this.sphereCount = 0;
    this.coneCount = 0;
    this.cylinderCount = 0;
    this.paused = false;

    this.distanceAttenuation = true;

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

        document.getElementById("btnPause").addEventListener("click", function(event) {
            that.paused = !that.paused;
            if (that.paused) {
                document.getElementById("btnPause").innerHTML = "Play";
            }
            else {
                document.getElementById("btnPause").innerHTML = "Pause";
            }
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
        /*document.getElementById("rotateX").addEventListener("change", function(event) {
            transform.rotate.X(that.selectedShape, document.getElementById("rotateX").value);
        });

        document.getElementById("rotateY").addEventListener("change", function(event) {
            transform.rotate.Y(that.selectedShape, document.getElementById("rotateY").value);
        });

        document.getElementById("rotateZ").addEventListener("change", function(event) {
            transform.rotate.Z(that.selectedShape, document.getElementById("rotateZ").value);
        });*/

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

        /******************** Lights *****************************/
        document.getElementById("lightChooser").addEventListener("change", function(event) {
            var light = document.getElementById("lightChooser").value;

            if (light === "both") {
                lights[0].isActive = true;
                lights[1].isActive = true;
            }
            else if (light === "light1") {
                lights[0].isActive = true;
                lights[1].isActive = false;
            }
            else if (light === "light2") {
                lights[0].isActive = false;
                lights[1].isActive = true;
            }
            else {
                lights[0].isActive = false;
                lights[1].isActive = false;
            }
        });

        document.getElementById("light1x").addEventListener("change", function(event) {
            lights[0].position[0] = document.getElementById("light1x").value;
        });

        document.getElementById("light1y").addEventListener("change", function(event) {
            lights[0].position[1] = document.getElementById("light1y").value;
        });

        document.getElementById("light1z").addEventListener("change", function(event) {
            lights[0].position[2] = document.getElementById("light1z").value;
        });

        document.getElementById("light2x").addEventListener("change", function(event) {
            lights[1].position[0] = document.getElementById("light2x").value;
        });

        document.getElementById("light2y").addEventListener("change", function(event) {
            lights[1].position[1] = document.getElementById("light2y").value;
        });

        document.getElementById("light2z").addEventListener("change", function(event) {
            lights[1].position[2] = document.getElementById("light2z").value;
        });

        document.getElementById("light1DiffuseColor").addEventListener("change", function(event) {
            var rgb = that.hexToRgb(document.getElementById("light1DiffuseColor").value);
            lights[0].diffuse = vec4(rgb.r / 255, rgb.g / 255, rgb.b / 255, 1.0);
        });

        document.getElementById("light1SpecularColor").addEventListener("change", function(event) {
            var rgb = that.hexToRgb(document.getElementById("light1SpecularColor").value);
            lights[0].specular = vec4(rgb.r / 255, rgb.g / 255, rgb.b / 255, 1.0);
        });

        document.getElementById("light2DiffuseColor").addEventListener("change", function(event) {
            var rgb = that.hexToRgb(document.getElementById("light2DiffuseColor").value);
            lights[1].diffuse = vec4(rgb.r / 255, rgb.g / 255, rgb.b / 255, 1.0);
        });

        document.getElementById("light2SpecularColor").addEventListener("change", function(event) {
            var rgb = that.hexToRgb(document.getElementById("light2SpecularColor").value);
            lights[1].specular = vec4(rgb.r / 255, rgb.g / 255, rgb.b / 255, 1.0);
        });

        document.getElementById("distanceAtt").addEventListener("change", function(event) {
            that.distanceAttenuation = document.getElementById("distanceAtt").checked;
        });

        document.getElementById("ambientColor").addEventListener("change", function(event) {
            var rgb = that.hexToRgb(document.getElementById("ambientColor").value);
            that.lightAmbient = vec4(rgb.r / 255, rgb.g / 255, rgb.b / 255, 1.0);

            var ambientProduct = mult(that.lightAmbient, that.materialAmbient);
            gl.uniform4fv(gl.getUniformLocation(that.program, "ambientProduct"), flatten(ambientProduct));
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

    this.rotateLight = function(position, angle, px, py) {
        angle = angle * (Math.PI/180);

        var s = Math.sin(angle);
        var c = Math.cos(angle);

        var x = position[0];
        var y = position[1];

        var rotatedX = c * (x - px) - s * (y - py) + px;
        var rotatedY = s * (x - px) + c * (y - py) + py;

        position[0] = rotatedX;
        position[1] = rotatedY;

        return position;
    }

    this.updateFields = function() {
        document.getElementById("light1x").value = Math.round(lights[0].position[0] * 100) / 100;
        document.getElementById("light1y").value = Math.round(lights[0].position[1] * 100) / 100;
        document.getElementById("light1z").value = Math.round(lights[0].position[2] * 100) / 100;

        document.getElementById("light2x").value = Math.round(lights[1].position[0] * 100) / 100;
        document.getElementById("light2y").value = Math.round(lights[1].position[1] * 100) / 100;
        document.getElementById("light2z").value = Math.round(lights[1].position[2] * 100) / 100;
    }

    this.render = function() {
        const black = vec4(0.0, 0.0, 0.0, 1.0);
        const red = vec4(1.0, 0.0, 0.0, 1.0);
        const white = vec4(1.0, 1.0, 1.0, 1.0);

        // rotate lights
        if (!that.paused) {
            lights[0].position = that.rotateLight(lights[0].position, 5, 0.2, 0.2);
            lights[1].position = that.rotateLight(lights[1].position, -5, -0.5, 0.5);
            that.updateFields();
        }

        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

        var eye = vec3( radius*Math.sin(theta)*Math.cos(phi), 
                        radius*Math.sin(theta)*Math.sin(phi),
                        radius*Math.cos(theta));

        modelViewMatrix = lookAt( eye, at, up );
        projectionMatrix = ortho( left, right, bottom, ytop, near, far );
        normalMatrix = [
            vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
            vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
            vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
        ];

        gl.uniform1i(isDistanceAttenuationLoc, that.distanceAttenuation);

        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
        gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));

        for (var li = 0; li < lights.length; ++li) {
            gl.uniform1f(lightsLoc[li].isActive, lights[li].isActive);
            if (lights[li].isActive) {
                gl.uniform4fv(lightsLoc[li].position, flatten(lights[li].position));
                gl.uniform4fv(lightsLoc[li].diffuse, flatten(lights[li].diffuse));
                gl.uniform4fv(lightsLoc[li].specular, flatten(lights[li].specular));
            }
        }

        for (var key in shapes) {
            var element = shapes[key];
            gl.bindBuffer(gl.ARRAY_BUFFER, element.vertexPositionBuffer);
            gl.vertexAttribPointer(that.vPosition, element.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, element.vertexNormalBuffer);
            gl.vertexAttribPointer(that.vNormal, element.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

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

    lights[0] = {
        isActive: true,
        position: vec4(2.0, 1.0, -2.0, 0.0 ),
        diffuse: vec4( 1.0, 1.0, 1.0, 1.0 ),
        specular: vec4( 1.0, 1.0, 1.0, 1.0 )
    };

    lights[1] = {
        isActive: true,
        position: vec4(-1.0, -2.0, -0.5, 0.0 ),
        diffuse: vec4( 1.0, 1.0, 1.0, 1.0 ),
        specular: vec4( 1.0, 1.0, 1.0, 1.0 )
    };

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

    for (var ll = 0; ll < lights.length; ++ll) {
        lightsLoc[ll] = {};
        lightsLoc[ll].isActive = gl.getUniformLocation(this.program, "lights[" + ll + "].isActive");
        lightsLoc[ll].position = gl.getUniformLocation(this.program, "lights[" + ll + "].position");
        lightsLoc[ll].diffuse = gl.getUniformLocation(this.program, "lights[" + ll + "].diffuse");
        lightsLoc[ll].specular = gl.getUniformLocation(this.program, "lights[" + ll + "].specular");
    }

    var ambientProduct = mult(this.lightAmbient, this.materialAmbient);

    nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    this.vNormal = gl.getAttribLocation(this.program, "vNormal");
    gl.vertexAttribPointer(this.vNormal, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.vNormal);

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
    normalMatrixLoc = gl.getUniformLocation( this.program, "normalMatrix" );
    isDistanceAttenuationLoc = gl.getUniformLocation(this.program, "isDistanceAttenuation");

    gl.uniform4fv(gl.getUniformLocation(this.program, "ambientProduct"), flatten(ambientProduct));

    gl.uniform4fv(gl.getUniformLocation(this.program, "materialDiffuse"), flatten(this.materialDiffuse));
    gl.uniform4fv(gl.getUniformLocation(this.program, "materialSpecular"), flatten(this.materialSpecular));

    gl.uniform1f(gl.getUniformLocation(this.program, "shininess"), this.materialShininess);

    this.render();
}
