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
  		items: {},
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
			console.log('halloObject', halloObject);
			var element = document.querySelector('#' + halloObject.id);

			var phi   = ( 85 - halloObject.lat ) * ( Math.PI/180 );
			var theta = ( halloObject.lng + 279 ) * ( Math.PI/180 );
			var radius = 800;
			

			var pos_x = -( ( radius ) * Math.sin( phi ) * Math.cos( theta ));
			var pos_z = ( ( radius ) * Math.sin( phi ) * Math.sin( theta ));
			var pos_y = ( ( radius ) * Math.cos( phi ) );

			var objectCSS   = new THREE.CSS3DObject( element );

			window.objectCSS  = objectCSS;
			objectCSS.position.z = pos_z || 0;
			objectCSS.position.y = pos_y || 0;
			objectCSS.position.x = pos_x || 0;
			objectCSS.lookAt( camera.position );
			
			if(!halloObject.parent) {
				this.items[halloObject.id] = objectCSS;
				this.items[halloObject.id].type = halloObject.type;
			} else {
				this.items[halloObject.parent].childs = [];
				this.items[halloObject.parent].childs[halloObject.id] = objectCSS;
				this.items[halloObject.parent].childs[halloObject.id].type = halloObject.type;
			}

			sceneCSS.add( objectCSS );
		},
		addFrame: function(){
			sceneGL.add(sphereFrame);
		},
		removeFrame: function(){
			sceneGL.remove(sphereFrame);
		},
		load_object_for: function(position, obj_name) {
			console.log('eeee', position);
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

				materials[i] = new THREE.ParticleBasicMaterial( { size: size, opacity: 0.3 , color: 0xffffff , map: THREE.ImageUtils.loadTexture( 'assets/particle.png' ), transparent: true } );
				particles = new THREE.ParticleSystem( geometry, materials[i] );

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
}])

app.directive("editform", [ '$route', '$sce', '$location', '$http','$rootScope','HalloVR', '$compile', '$timeout', '$document',
	function($route,$sce,$location,$http,$rootScope, HalloVR, $compile, $timeout,$document) {
	return {
		restrict: "EA",
		replace: true,
		templateUrl: '/editor/tpl/editor.html',
	    link: function(scope, el, attr) {
	    	scope.newVrObjectForm = {};
	    	scope.indexId = 0;
	   		scope.selectOptions = [
				{ id: "item",  type: 'Item' },
				{ id: "menu",  type: 'Menu' }, 
				{ id: "footer",  type: 'Footer' }
			];
			scope.selectPlugins =  [
				{ id: "logo",  type: 'Logo' },
				{ id: "gallery",  type: 'Gallery' },
				{ id: "blog-post-list",  type: 'Blog Posts List' }, 
				{ id: "portfolio",  type: 'Portfolio' }, 
				{ id: "services",  type: 'Services' }, 
				{ id: "contacts",  type: 'Contacts' },
				{ id: "html",  type: 'HTML' }
			];
			scope.selectObj3D =  [
				{ id: "object_5",  type: 'object_5' },
				{ id: "object_6",  type: 'object_6' },
				{ id: "object_7",  type: 'object_7' }
			];

			
		 	// scope.selectMenuItems = [ {id:"menu",type:"menu"}];
		 	// scope.selectFooterItems = [ {id:"footer",type:"footer"}]

		 	scope.forItem = false;
			scope.forMenu = false;
			scope.forFooter = false;
			
		 	scope.forLogo = false;
			scope.forGallery = false;
			scope.forBlogPostsList = false;
			scope.forPortfolio = false;
			scope.forServices = false;
			scope.forContacts = false;
			scope.forHTML = false;

			scope.halloVRObj = {};
			scope.halloVRObj.position = {};

			scope.halloObj = function(){
				scope.halloVRObj = {
					"id": scope.newVrObjectForm.type + "-" + (scope.indexId++),
					"type": scope.newVrObjectForm.type,
					"vrElement": false,
					"isWhich": false,
					"draw": false,
					// "itemName": scope.newVrObjectForm.itemName,
					// "position":{
					// 	"x": 0,
					// 	"y": 0,
					// 	"z": 0
					// },
					"content": [{
						"isMargined": false,
						"d": "M500 500 L" + (200 + 5)+ " " + (300 + 5),
						"x": 200,
						"y": 300,
						"htmlBinder": $sce.trustAsHtml(scope.newVrObjectForm.htmlBinder),
						"vrChildren":[]
					}]
				}

	    		if(scope.newVrObjectForm.type == "item"){
					if(scope.newVrObjectForm.service)
						scope.halloVRObj.service = scope.newVrObjectForm.service;
					
					if(scope.newVrObjectForm.services){
						_.each(scope.newVrObjectForm.services, function(itemservice,key){
							scope.halloVRObj.itemBind = typeOfFunctions[key](itemservice);

							if(scope.halloVRObj.type == "item" && scope.halloVRObj.service != "logo"){ 
								HalloVR.load_object_for(scope.halloVRObj.position, itemservice.itemObj3D);
							}
						})
					}
				}

				$rootScope.halloVRItems.push(scope.halloVRObj);
				console.log('scope.halloVRObj', scope.halloVRObj);
				var content = $compile(angular.element("<div id=\"" + scope.halloVRObj.id + "\" type=\"" + scope.halloVRObj.type + "\" ng-class=\"{ 'vrElement':halloVRObj.vrElement}\">" +
			                    			scope.halloVRObj.itemBind + "</div>"))(scope);

    			// ng-repeat=\"(key, item) in halloVRObj\" 
                angular.element('body').append(content);
                
                $timeout(function(){
                	HalloVR.addItem(scope.halloVRObj);

					scope.close();
                },500)
				
	    	}
	    	
	    	scope.close = function(){
	    		$rootScope.vrweb.form = false;
	    		scope.newVrObjectForm = {};
	    		scope.halloVRObj = {};

	    		scope.forItem = false;
				scope.forMenu = false;
				scope.forFooter = false;

			 	scope.forLogo = false;
				scope.forGallery = false;
				scope.forBlogPostsList = false;
				scope.forPortfolio = false;
				scope.forServices = false;
				scope.forContacts = false;
				scope.forHTML = false;

	    	}

	    	scope.newElements = function(){
	    		HalloVR.addFrame();
				angular.element('body').css('cursor','crosshair');
				$document.on("dblclick", function($event){

					scope.halloVRObj.position = HalloVR.onDocumentMouseDown($event);
					scope.$apply(function() {
						HalloVR.removeFrame();
						$rootScope.vrweb.form = true;
						angular.element('body').css('cursor','default');
						$document.off('dblclick');
					})
				})
	    	};

	    	scope.isItem = function(selectedItem){
	    		scope.forItem = false;
	    		scope.forSubItem = false;
	    		scope.forMenu = false;
	    		scope.forFooter = false;
	    		switch(selectedItem){
	    			case 'item':
	    				scope.forItem = true; break;
	    			case 'sub-item':
	    				scope.forSubItem = true; break;
	    			case 'menu':
	    				scope.forMenu = true; break;
	    			case 'footer':
	    				scope.forFooter = true; break;
	    			default: break;
	    		}
	    	}

	    	scope.isService = function(services){
	    		scope.forLogo = false;
				scope.forGallery = false;
				scope.forBlogPostsList = false;
				scope.forPortfolio = false;
				scope.forServices = false;
				scope.forContacts = false;
				scope.forHTML = false;
				
	    		switch(services){
	    			case 'logo':
	    				scope.forLogo = true; break;
	    			case 'gallery':
	    				scope.forGallery = true; break;
	    			case 'blog-post-list':
	    				scope.forBlogPostsList = true; break;
	    			case 'portfolio':
	    				scope.forPortfolio = true; break;
	    			case 'services':
	    				scope.forServices = true; break;
	    			case 'contacts':
	    				scope.forContacts = true; break;
	    			case 'html':
	    				scope.forHTML = true; break;
	    			default: break;
	    		}
		 	
	    	}

	    }
	};
}]);

var typeOfFunctions = {};
typeOfFunctions['logo'] = function(logoObj){
	var width = (logoObj.width)?logoObj.width:200;
	var height = (logoObj.height)?logoObj.height:200;
	var style = "\"width: " + width + "px;"+
		"height: " + height + "px;"+
		"background-image: url('"+logoObj.url+"');"+
		"background-repeat: no-repeat;"+
		"background-size: 100% auto;\"";
	return "<div id=\"logo\" style=" + style + "></div>";
}

typeOfFunctions['portfolio'] = function(htmlObj){
	var portfolioItem = "<svg>";
	portfolioItem +="<defs>";
	portfolioItem +="<mask id='hide_lines'>";
	portfolioItem +="<circle cx='0' cy='0' r='10000' fill='white' />";
	portfolioItem +="<path transform='translate(500,480)' fill='rgba(0,0,0,1)'  d='M -25, 0 m -75, 0 a 75,75 0 1,0 200,0 a 75,75 0 1,0 -200,0'  />";
	portfolioItem +="</mask>";
	portfolioItem +="</defs>";
	portfolioItem +="<g>";
	portfolioItem +="<circle cx='500' cy='480' r='100' class='itemOpener'  ng-click='vrContentvsvrChild(halloVRObj, $event)'/>";
	portfolioItem +="<g class='mainCircle' fill-rule='evenodd'>";
	portfolioItem +="<path transform='translate(500,480)' stroke-dashoffset='0' id='mainBodyCircle' stroke-dashoffset='1000' d='M -25, 0 m -75, 0 a 75,75 0 1,0 200,0 a 75,75 0 1,0 -200,0'  />";
	portfolioItem +="<path-line d='{{ content.d }}' stroke='white' mask='url(#hide_lines)' ng-repeat='(k, content) in halloVRObj.content' strokedashoffset='0'></path-line>";
	portfolioItem +="</g>";
	portfolioItem +="</g>";
	portfolioItem +="</svg>";
	return portfolioItem;
}