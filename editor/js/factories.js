app.factory('HalloVR', [function(){
	
	var projector = new THREE.Projector();
			
	// camera
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
	var rendererGl = new THREE.WebGLRenderer({alpha:true, antialias: true });

	var loader = new THREE.JSONLoader(); // init the loader util


	// renderer
	var rendererCss = new THREE.CSS3DRenderer();
		
	// scene
	var sceneGL = new THREE.Scene();
	var sceneCSS = new THREE.Scene();
	
	var sphereFrame = new THREE.Mesh(
		new THREE.SphereGeometry(800, 20, 20),
		new THREE.MeshBasicMaterial({
			wireframe: true,
			color: 0xffffff,
			transparent: true,
			opacity: 0.05
		})
	);

	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();


	var controls = new THREE.OrbitControls(camera);
			
	var particles, materials = [], parameters, i, h, color, size;
	var geometry = new THREE.Geometry();

	var spherePoli = [];
			  
	var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 'white', wireframe: true, transparent: true, wireframeLinewidth: 0.6 } ); 
	var multiMaterial = [ wireframeMaterial ];

	var Objects3D = [];

	return {
  		tools: {
			pageFocus: true
		},
		hatsDown: true,

		onDocumentMouseDown: function( event ) { 

			      event.preventDefault();

			      mouse.x = ( event.clientX / rendererGl.domElement.clientWidth ) * 2 - 1;
			      mouse.y = - ( event.clientY / rendererGl.domElement.clientHeight ) * 2 + 1;

			      raycaster.setFromCamera( mouse, camera );

			      var intersects = raycaster.intersectObjects( sceneGL.children );

			      if ( intersects.length > 0 ) {

			          point = intersects[0].point;


			            cube_geo = new THREE.BoxGeometry(10,10,10);
			            cube_mat = new THREE.MeshNormalMaterial();
			            cube = new THREE.Mesh(cube_geo, cube_mat);
			            cube.position.set(point.x, point.y, point.z);
			            sceneGL.add(cube);

			            return point;


			      }
		},
		animate: function(){
        	// request new frame
		   var self = this; 
			requestAnimationFrame(function(){
				self.animate();
			});

	        // render
	        rendererGl.render(sceneGL, camera);
	        rendererCss.render(sceneCSS, camera);
		},
		addItem: function(halloObject){
			// -- Getting the element with this id --
			
			element = document.querySelector('#' + halloObject.id);
			pos_x = halloObject.position.x;
			pos_y = halloObject.position.y;
			pos_z = halloObject.position.z;

			// -- Creating CSS Object for our scene --
			objectCSS   = new THREE.CSS3DObject( element );
			window.objectCSS  = objectCSS;
			objectCSS.position.z = pos_z || 0;
			objectCSS.position.y = pos_y || 0;
			objectCSS.position.x = pos_x || 0;
			objectCSS.lookAt( camera.position );


			// $('body > #' + halloObject.id).remove();


			
			// -- Adding out object to scene --
			sceneCSS.add( objectCSS );
		},
		addFrame: function(){
			sceneGL.add(sphereFrame);
			angular.element('body').css('cursor','crosshair');
		},
		removeFrame: function(){
			sceneGL.remove(sphereFrame);
			angular.element('body').css('cursor','default');
		},
		load_object_for: function(position, obj_name) {
			
		  loader.load('assets/' + obj_name + '.js', function (geometry) {	  
			  // create a mesh with models geometry and material
			  object = THREE.SceneUtils.createMultiMaterialObject( 
				geometry,
				multiMaterial
			  );

			  object.scale.set(15,15,15);
			  object.lookAt(camera.position);
			  object.position.set(position.x,position.y,position.z);

			  object.rotation.y = -Math.PI/5;
			  
			  Objects3D.push(object);

			  sceneGL.add(object);
			});
	    },
		installThree: function(halloObjects, settings){

			var self = this;
			var container = document.querySelector("#" + settings.container);
			
			//Creating our Sphere with Texture
			var sphereBack = new THREE.Mesh(
				new THREE.SphereGeometry(2000, 20, 20),
				new THREE.MeshBasicMaterial({
					map: THREE.ImageUtils.loadTexture(settings.bgImage)
				})
			);

			rendererCss.setSize(window.innerWidth, window.innerHeight);
			rendererCss.domElement.id = 'rendererCSS';
			
			rendererGl.setClearColor(0x00ff00, 0.0);
			rendererGl.domElement.id = 'rendererGL';

			rendererGl.setSize(window.innerWidth, window.innerHeight);
			rendererCss.domElement.appendChild(rendererGl.domElement);

			container.appendChild(rendererCss.domElement);

			camera.position.z = 500;
			camera.position.y = 0;
			sceneGL.add(camera);

			self.tools.camera = camera;

			controls.noPan = true;
			controls.noZoom = true;
			controls.autoRotate = true;
			controls.autoRotateSpeed = 0;

			if(halloObjects.length){
				_.each(halloObjects,function(halloObject, key){
					self.addItem(halloObject);
				})
			}
			
			//Adding scale with x axis
			sphereBack.scale.x = -1;
			sceneGL.add(sphereBack);
									
			//Particles 

			for ( i = 0; i < 8000; i++ ) {

				var vertex = new THREE.Vector3();
				vertex.x = Math.random() * 2000 - 1000;
				vertex.y = Math.random() * 2000 - 1000;
				vertex.z = Math.random() * 2000 - 1000;

				geometry.vertices.push( vertex );

			}

			parameters = [
				[ [1, 1, 0.5], 5 ],
				[ [0.95, 1, 0.5], 4 ],
				[ [0.90, 1, 0.5], 3 ],
				[ [0.85, 1, 0.5], 2 ],
				[ [0.80, 1, 0.5], 1 ]
			];

			for ( i = 0; i < parameters.length; i ++ ) {

				color = parameters[i][0];
				size  = parameters[i][1];

				materials[i] = new THREE.PointCloudMaterial( { size: size, opacity: 0.3 , color: 0xffffff , map: THREE.ImageUtils.loadTexture( 'assets/particle.png' ), transparent: true } );
				particles = new THREE.PointCloud( geometry, materials[i] );

				particles.rotation.x = Math.random() * 0.5 ;
				particles.rotation.y = Math.random() * 0.5 ;
				particles.rotation.z = Math.random() * 0.5 ;

				sceneGL.add( particles );
			}
	  
			for(var i = 1; i < 4; i++){
				spherePoli[i] = new THREE.Mesh(
					new THREE.SphereGeometry(920+i, 200, 200),
					new THREE.MeshBasicMaterial({
						map: new THREE.ImageUtils.loadTexture(settings.hatImage),
						transparent: true,
						opacity: 0.2 * i
					})
				);
				spherePoli[i].material.side = THREE.DoubleSide;
				spherePoli[i].rotation.z = (1+i) * Math.PI/180;
				sceneGL.add(spherePoli[i]);
			}    
			angular.element('body').css('display','block');
			// start animation
			this.animate();
		}
	};
}]);

app.directive("editform", [ '$route', '$sce', '$location', '$http','$rootScope','HalloVR', 'generator', '$compile', '$timeout', '$document',
	function($route,$sce,$location,$http,$rootScope, HalloVR, generator, $compile, $timeout,$document) {
	return {
		restrict: "EA",
		replace: true,
		templateUrl: '/editor/tpl/editor.html',
	    link: function(scope, el, attr) {
	    	scope.newVrObjectForm = {};

			scope.selectOptions = {};
			$http.get('/options.json').then(function(response) {				
				if(response.status == 200){
					scope.selectOptions = response.data;
				}
			});

			scope.selectOptionForm = function(type){
				if(type)
					return scope.selectOptions[type].form;
			}			

			scope.selectObj3D =  {};
			$http.get('/objects.json').then(function(response) {				
				if(response.status == 200){
					scope.selectObj3D = response.data;
				}
			});

			scope.pluginsItems =  {};
			$http.get('/plugins.json').then(function(response) {				
				if(response.status == 200){
					console.log('pluginsItems', response.data);
					scope.pluginItems = response.data;
				}
			});
			
			var position = {};
	    	scope.newElements = function(itemClicked){
	    		HalloVR.addFrame();
				
				$document.on("dblclick", function($event){
					position = HalloVR.onDocumentMouseDown($event);

					scope.$apply(function() {
						HalloVR.removeFrame();
						$rootScope.vrweb.form = true;
						$document.off('dblclick');
					})
				})
	    	};
	    	
	    	scope.item = [];

			scope.halloObj = function(){
	    		
				scope.halloVRObj = {
					"draw": false,
					"template": "/editor/tpl/item-template.html",
					"content":[]
				};

				scope.halloVRObj.id = scope.newVrObjectForm.type + "-" + generator.ID();
				scope.halloVRObj.position = position;
				
				scope.newVrObjectForm.pathSettings.wireColorStart = scope.newVrObjectForm.pathSettings.wireColorStart ? scope.newVrObjectForm.pathSettings.wireColorStart : '#000000';
				scope.newVrObjectForm.pathSettings.wireColorStop = scope.newVrObjectForm.pathSettings.wireColorStop ? scope.newVrObjectForm.pathSettings.wireColorStop : '#000000';
				scope.halloVRObj.pathSettings = scope.newVrObjectForm.pathSettings;

				scope.halloVRObj.func = scope.createChild;

				if(scope.newVrObjectForm.parentImage){
					angular.extend(scope.newVrObjectForm.parentImage, {
						"template":scope.selectOptions.image.view
					});

					angular.extend(scope.halloVRObj.parentImage, scope.newVrObjectForm.parentImage);
				}
				
				if(scope.newVrObjectForm.itemObj){ 
					angular.extend(scope.halloVRObj, scope.newVrObjectForm);
					HalloVR.load_object_for(position,  scope.newVrObjectForm.itemObj);
				}

				scope.item.push(scope.halloVRObj)

				$http.get(scope.halloVRObj.template).then(function(data) {
					if(data.status == 200){
						var content = $compile(angular.element(data.data))(scope);
						
						// angular.element( document.querySelector( '#rendererCSS > div' ) ).empty();
						
						if(scope.item.length == 1) angular.element('#rendererCSS > div').append(content);

						$timeout(function(){
							HalloVR.addItem(scope.halloVRObj);
							$rootScope.halloVRItems.push(scope.halloVRObj);
							scope.close();
						},10)
					}
				})
	    	}

	    	scope.isChild = 0;
	    	scope.createChild = function(parent){	
	    		scope.newVrObjectForm.parent = parent;

	    		HalloVR.addFrame();
	    		var parentBorder = angular.element('#' + parent.id);
				parentBorder.css( 'border', '2px solid rgba(194, 0, 0, 0.41)');
				
				parentBorder.on("dblclick", function($event){

					scope.newVrObjectForm.position = {
						x: $event.originalEvent.offsetX,
						y: $event.originalEvent.offsetY
					};

					scope.$apply(function() {
						parentBorder.css( 'border', 'none');

						scope.isChild = 1;
						
						HalloVR.removeFrame();
						
						$rootScope.vrweb.form = true;
						$document.off('dblclick');
					})
				})		
	    	}

	    	scope.selectPluginForm = function(plugin){
	    		if(plugin){
					var form = "";
					_.each(scope.pluginItems, function(item){
						_.each(item, function(pluginObj,i){
							if(i == plugin){
								form = pluginObj.form;
								scope.newVrObjectForm.template = pluginObj.view;
							}
						})
					})

					return form;
				}
	    	}

	    	scope.addChild = function(){
	    		console.log('addChild', scope.newVrObjectForm);
				if(scope.newVrObjectForm.component){
					_.each(scope.item, function(eachItem, i){
						if(eachItem.id == scope.newVrObjectForm.parent.id){
							var id = scope.newVrObjectForm.parent.id + "-content-"+generator.ID();
							eachItem.content.push({
								"id": id,
								"isMargined": false,
								"iscontent": true,
								"template": scope.newVrObjectForm.template,
								"plugin": scope.newVrObjectForm.plugin,
								"x": scope.newVrObjectForm.position.x,
								"y": scope.newVrObjectForm.position.y,
								"d": "M500 500 L" + (scope.newVrObjectForm.position.x + 5)+ " " + (scope.newVrObjectForm.position.y + 5),
								"component": scope.newVrObjectForm.component,
								"func": scope.createVRChild,
								"vrChildren":[]
	    					})
	    				}
	    			})

					angular.extend($rootScope.halloVRItems, scope.item);

					console.log(' scope.item', scope.item);

					$timeout(function(){
						scope.close();
					},10);
	    		}
	    	}
	    	scope.addVRChild = function(){

				if(scope.newVrObjectForm.component){
					_.each(scope.item, function(eachItem, i){
						console.log('eachItem', eachItem);
						_.each(eachItem.content, function(content, j){
							console.log('content', content,scope.newVrObjectForm.parent);
							if(content.id == scope.newVrObjectForm.parent.id){
								var id = scope.newVrObjectForm.parent.id + "-vrchild-"+generator.ID();
								content.vrChildren.push({
									"id": id,
									"isMargined": false,
									"isChild": true,
									"template": scope.newVrObjectForm.template,
									"plugin": scope.newVrObjectForm.plugin,
									"x": scope.newVrObjectForm.position.x,
									"y": scope.newVrObjectForm.position.y,
									"component": scope.newVrObjectForm.component,
									"func": scope.createVRChild
		    					})
		    					console.log(' content.content', content);
		    				}
	    				})
	    			})

					angular.extend($rootScope.halloVRItems, scope.item);
					console.log('$rootScope.halloVRItems, scope.item', $rootScope.halloVRItems, scope.item);

					$timeout(function(){
						scope.close();
					},10);
	    		}
	    	}
	    	scope.createVRChild = function(parent, main){
	    		scope.newVrObjectForm.parent = parent;
	    		console.log('parent', parent);
	    		HalloVR.addFrame();
	    		var parentBorder = angular.element('#' + main);
				parentBorder.css( 'border', '2px solid rgba(194, 0, 0, 0.41)');
				
				parentBorder.on("dblclick", function($event){

					scope.newVrObjectForm.position = {
						x: $event.originalEvent.offsetX,
						y: $event.originalEvent.offsetY
					};

					scope.$apply(function() {
						parentBorder.css( 'border', 'none');

						scope.isChild = 2;
						
						HalloVR.removeFrame();
						
						$rootScope.vrweb.form = true;
						$document.off('dblclick');
					})
				})
	    	}

	    	scope.vrContentvsvrChild = function(obj, event){
				
				var svg = event.currentTarget.closest("svg");
				var svgElement = event.currentTarget.closest(".vrElement");
				var mainCircle = angular.element(svg.querySelectorAll('.mainCircle path'));
				var path = angular.element(svgElement.querySelectorAll("[class^='svg_'] path"));

				angular.element(document.querySelectorAll('path')).attr('class','');

	    		_.each(scope.item, function(halloVRObj){
	    			if(halloVRObj.id != obj.id){
		    			_.each(halloVRObj.content, function(content){    		
		    				content.isMargined = false;

		    				mainCircle.attr('class','');
							path.attr('class','');
		    			})
		    		}
	    		})
	    		
				_.each(obj.content, function(content){																																																								
					content.isMargined = content.isMargined?false:true;

					if(content.isMargined){
						mainCircle.attr('class','draw');
						path.attr('class','draw');
					}
				});

				HalloVR.hatsDown = true;				
	    	}
	    	scope.close = function(){
	    		$rootScope.vrweb.form = false;
	    		scope.newVrObjectForm = {};
	    		scope.halloVRObj = {};

	    	}

	    }
	};
}]);
