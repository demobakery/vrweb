app.factory('HalloVR', [function(){
	
	var projector = new THREE.Projector();
			
	// camera
	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
	var rendererGl = new THREE.WebGLRenderer({alpha:true, antialias: true });


	// renderer
	var rendererCss = new THREE.CSS3DRenderer();
		
	// scene
	var sceneGL = new THREE.Scene();
	var sceneCSS = new THREE.Scene();
	
	var sphereFrame = new THREE.Mesh(
		new THREE.SphereGeometry(800, 200, 200),
		new THREE.MeshBasicMaterial({
			wireframe: true,
			color: 0xffffff,
			transparent: true,
			opacity: 0.05
		})
	);

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

		onDocumentMouseDown: function( e ) { 
			e.preventDefault(); 

			var SCREEN_WIDTH = window.innerWidth;
			var SCREEN_HEIGHT = window.innerHeight;

			var mouseVector = new THREE.Vector3(); 
				mouseVector.x = 2 * (e.clientX / SCREEN_WIDTH) - 1; 
				mouseVector.y = 1 - 2 * ( e.clientY / SCREEN_HEIGHT ); 

			var raycaster = projector.pickingRay( mouseVector.clone(), camera ); 
			var intersects = raycaster.intersectObject( e.target ); 
			console.log('intersects', intersects);
			for( var i = 0; i < intersects.length; i++ ) { 
				var intersection = intersects[ i ], obj = intersection.object; 

				console.log("Intersected object", obj); 
			} 
		},
		object3D: function(item){
			var Objects3D = [];
	 console.log('item', item);
	 item.position = {};
	 item.position.x = 0;
	 item.position.y = 10;
	 item.position.z = 52;
			var wireframeMaterial = new THREE.MeshPhongMaterial( { wireframe: true, wireframeLinewidth: 0.6, opacity: 0.2 } );
			var fillMaterial = new THREE.MeshPhongMaterial({ color: 'black', transparent: true, opacity: 0.8, shininess: 200, emissive: '#000000', specular: '#ffffff' }); 
			var multiMaterial = [ wireframeMaterial, fillMaterial ];

			var loader = new THREE.JSONLoader(); // init the loader util

			// init loading
			loader.load('/assets/object_7.js', function (geometry) {	  
			  // create a mesh with models geometry and material
			  Objects3D[0] = THREE.SceneUtils.createMultiMaterialObject( 
			    geometry,
			    multiMaterial
			  );

			  Objects3D[0].scale.set(15,15,15);
			  Objects3D[0].lookAt(camera.position);
			  Objects3D[0].position.set(item.position.x,item.position.y,item.position.z);
			  
			  Objects3D[0].rotation.y = -Math.PI/5;
			  
			  sceneGL.add(Objects3D[0]);
			});
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
		addPage: function(halloObject){
			
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
			
			console.log('halloObject',halloObject, halloObject.parent);
			
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
					self.addPage(halloObject);
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
			
				// -- 3d Objects for Menus -- //  
			// _.each(this.items, function(item, key){
			// 	if(item.type == 'item'){
			// 		var Obj3D = THREE.SceneUtils.createMultiMaterialObject( 
			// 			new THREE.CylinderGeometry( 0, 85, 125, 4, 1 ), 
			// 			multiMaterial 
			// 		);
			// 			Obj3D.rotation.z = -Math.PI;
			// 			Obj3D.position = item.position;
			// 			sceneGL.add( Obj3D );

			// 		Objects3D.push(Obj3D);
			// 	}
			// }); 	  
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


			scope.halloObj = function(){
	    		scope.halloVRObj = [{
					"id": scope.newVrObjectForm.type + "-" + Math.floor((Math.random()*6)+1),
					"type": scope.newVrObjectForm.type,
					// "template": "editor/tpl/types/"+scope.newVrObjectForm.type+".html",
					"vrElement": false,
					"isWhich": false,
					"draw": false,
					// "itemName": scope.newVrObjectForm.itemName,
					"lat":0,
					"lng":0,
					"content": [{
						"isMargined": false,
						"d": "M500 500 L" + (200 + 5)+ " " + (300 + 5),
						"x": 200,
						"y": 300,
						"htmlBinder": $sce.trustAsHtml(scope.newVrObjectForm.htmlBinder),
						"vrChildren":[]
					}]
				}]

				if(scope.newVrObjectForm.type == "item"){
					if(scope.newVrObjectForm.service)
						scope.halloVRObj[0].service = scope.newVrObjectForm.service;
					
					if(scope.newVrObjectForm.services){
						_.each(scope.newVrObjectForm.services, function(itemservice,key){
							// scope.halloVRObj[0].itemBind = window[key](itemservice);
							scope.halloVRObj[0].itemBind = typeOfFunctions[key](itemservice);
							// if(itemservice.obj3D) HalloVR.object3D(itemservice);

							HalloVR.object3D(itemservice);
							console.log('itemservice', itemservice);
						})
					}
				} 
					
				

				// if(scope.newVrObjectForm.type=='menu' && scope.newVrObjectForm.menu) scope.halloVRObj[0].template = "components/"+scope.newVrObjectForm.menu+"/index.html";
				// if(scope.newVrObjectForm.type=='footer') scope.halloVRObj[0].socials = scope.newVrObjectForm.socials;
				// if(scope.newVrObjectForm.type=='item' && scope.newVrObjectForm.other) scope.halloVRObj[0].other = $sce.trustAsHtml("<iframe src='"+ scope.newVrObjectForm.other +"'><p>Your browser does not support iframes.</p></iframe>");
				
				console.log('scope.halloVRObj',scope.newVrObjectForm);
				$rootScope.halloVRItems.push(scope.halloVRObj);
					
				// $http.get(scope.halloVRObj[0].template).then(function(response) {
					
				// 	if(response.status == 200){
				// 		// if(!scope.$$phase) {
				// 			// scope.$apply(function() {
			 //                    var content = $compile("<div id=\"{{ item.id }}\" type=\"{{ item.type }}\" ng-class=\"{ 'vrElement':item.vrElement}\" ng-repeat=\"(key, item) in halloVRObj\" >" +
			 //                    			response.data + "</div>")(scope);
			 //                    angular.element('body').append(content);
			 //                    $timeout(function(){
			 //                    	HalloVR.addPage(scope.halloVRObj[0]);
			 //                    	scope.newVrObjectForm = {};

				// 					scope.forItem = false;
				// 					scope.forMenu = false;
				// 					scope.forFooter = false;

				// 				 	scope.forLogo = false;
				// 					scope.forGallery = false;
				// 					scope.forBlogPostsList = false;
				// 					scope.forPortfolio = false;
				// 					scope.forServices = false;
				// 					scope.forContacts = false;
				// 					scope.forHTML = false;


			 //                    	$rootScope.vrweb.form = false;
			 //                    },1000)
			 //               // })
				// 		// }
				// 	}
				// })
			console.log('qweqweqwe',scope.halloVRObj);
				var content = $compile("<div id=\"{{ item.id }}\" type=\"{{ item.type }}\" ng-class=\"{ 'vrElement':item.vrElement}\" ng-repeat=\"(key, item) in halloVRObj\" >" +
			                    			scope.halloVRObj[0].itemBind + "</div>")(scope);
                angular.element('body').append(content);
                $timeout(function(){
                	HalloVR.addPage(scope.halloVRObj[0]);

					scope.close();
                },500)
				
	    	}
	    	
	    	scope.close = function(){
	    		$rootScope.vrweb.form = false;
	    		scope.newVrObjectForm = {}

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
					HalloVR.onDocumentMouseDown($event);
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
	portfolioItem +="<circle cx='500' cy='480' r='100' class='itemOpener'  ng-click='vrContentvsvrChild(item, $event)'/>";
	portfolioItem +="<g class='mainCircle' fill-rule='evenodd'>";
	portfolioItem +="<path transform='translate(500,480)' stroke-dashoffset='0' id='mainBodyCircle' stroke-dashoffset='1000' d='M -25, 0 m -75, 0 a 75,75 0 1,0 200,0 a 75,75 0 1,0 -200,0'  />";
	portfolioItem +="<path-line d='{{ content.d }}' stroke='white' mask='url(#hide_lines)' ng-repeat='(k, content) in item.content' strokedashoffset='0'></path-line>";
	portfolioItem +="</g>";
	portfolioItem +="</g>";
	portfolioItem +="</svg>";
	return portfolioItem;
}