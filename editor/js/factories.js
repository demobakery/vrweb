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
			this.items[halloObject.id] = objectCSS;
			// -- Adding out object to scene --
			sceneCSS.add( objectCSS );
		},
		addFrame: function(){
			sceneGL.add(sphereFrame);
		},
		removeFrame: function(){
			sceneGL.remove(sphereFrame);
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
}])

app.directive("editform", [ '$route', '$sce', '$location', '$http','$rootScope','HalloVR', 'generator', '$compile', '$timeout', '$document',
	function($route,$sce,$location,$http,$rootScope, HalloVR, generator, $compile, $timeout,$document) {
	return {
		restrict: "EA",
		replace: true,
		templateUrl: '/editor/tpl/editor.html',
	    link: function(scope, el, attr) {
	    	scope.settings = function(){

				scope.forItem = false;
				scope.forMenu = false;
				scope.forFooter = false;
				scope.subItem = false;

				scope.forLogo = false;
				scope.forTopLevel = false;
				scope.forGallery = false;
				scope.forBlogPostsList = false;
				scope.forPortfolio = false;
				scope.forServices = false;
				scope.forContacts = false;
				scope.forHTML = false;

				scope.subPortfolioItem = false;
				scope.subPlugins = false;
				scope.subHtml = false;

				scope.itemSubLevelHtml = false;
				scope.subHtmlIconTitle = false;
				scope.subHtmlImageTitle = false;
				scope.subHtmlImageTitleText = false;
				scope.subVideoTitle = false; 
				scope.subVideoTitleText = false;

	    	};

	    	scope.newVrObjectForm = {};
	    	scope.indexId = 0;
	   		scope.settings();
			scope.halloVRObj = {};

			scope.selectOptions = [
				{ id: "item",  type: 'Item' },
				{ id: "menu",  type: 'Menu' }, 
				{ id: "footer",  type: 'Footer' }
			];
			scope.selectService =  [
				{ id: "logo",  type: 'Logo' },
				{ id: "top-level", type: "ITEM top level" }
			];
			scope.subLevelItems =  [
				{ id: "html",  type: 'HTML' },
				{ id: "portfolio-item",  type: 'Portfolio Item' },
				{ id: "plugins",  type: 'Plugins' }
			]
			scope.selectObj3D =  [
				{ id: "object_5",  type: 'object_5' },
				{ id: "object_6",  type: 'object_6' },
				{ id: "object_7",  type: 'object_7' }
			];
			scope.itemSubLevelHtmlList = [
				{ id: "IconTitle",  type: 'Icon + Title' },
				{ id: "ImageTitle",  type: 'Image + Title' },
				{ id: "ImageTitleText",  type: 'Image + Title + Text' },
				{ id: "VideoTitle",  type: 'Video + Title' },
				{ id: "VideoTitleText",  type: 'Video + Title + Text' }
			];
			scope.itemSubLevelPluginsList = [
				{ id: "portfolio",  type: 'Portfolio', dir: '/plugins' },
				{ id: "gallery",  type: 'Gallery', dir: '/gallery' },
				{ id: "blog-post-list",  type: 'Blog Posts List', dir: '/blog-post-list'  }, 
				{ id: "services",  type: 'Services', dir: '/services'  }, 
				{ id: "contacts",  type: 'Contacts', dir: '/contacts'  },
				{ id: "html",  type: 'HTML', dir: '/html'  }
			];
	    	scope.createHTMLBIND = function(data){
	    		
				var htmlBind = "";

				if(data.isContent){
					
					_.each($rootScope.halloVRItems, function(halloVRItem){
						if(halloVRItem.id === data.parentId){
							if(!halloVRItem.content) halloVRItem.content = [];
							halloVRItem.content.push(data);
						}
					}) 
					
					htmlBind += "<div class=\"vrContent\" id=\""+ data.id +"\" ng-style=\"{ 'left':"+ data.x +", 'top':"+ data.y +"}\" x=\""+data.x +"\" y=\""+data.y +"\" ng-repeat=\"(k, content) in item.content\" ng-show=\""+ data.isMargined +"\" >";
					htmlBind += "<div class=\"icon\"></div>";
					htmlBind += "<div class=\"content margined\" >";
					
					htmlBind += data.htmlBind;
					
					// <div class="vrChild" ng-if="content.vrChildren.length" ng-style="{ 'left': vrChild.x, 'top': vrChild.y }" x="{{vrChild.x}}" y="{{vrChild.y}}" ng-repeat="vrChild in content.vrChildren">
					// 	<div class="icon"></div>
					// 	<!-- <div class="content" ng-class="{ 'margined': !content.isMargined }" ng-bind-html="vrChild.htmlBinder"></div> -->
					// 	<div class="content" ng-class="{ 'margined': !content.isMargined }">
					// 		<iframe width="560" height="315" src="https://www.youtube.com/embed/nH7bjV0Q_44" frameborder="0" allowfullscreen></iframe>
					// 	</div>
					// 	<span svg-line child="{{vrChild}}" parent="{{ content }}" parentIndex="{{ k }}"></span>
					// </div>
					htmlBind += "</div></div>";
					// htmlBind = $compile(angular.element(htmlBind))(scope);
					htmlBind = angular.element(htmlBind);

					angular.element(document.querySelector("#" + data.parentId)).append(htmlBind);
					
/*add path line*/



					// scope.$apply(function() {
					//   angular.element(document.querySelector("#" + data.parentId)).append(htmlBind);
					// });
					
				}
					
				scope.close();
			};

			var position = {};
	    	scope.newElements = function(){
	    		HalloVR.addFrame();
				angular.element('body').css('cursor','crosshair');
				$document.on("dblclick", function($event){

					position = HalloVR.onDocumentMouseDown($event);

					scope.$apply(function() {
						HalloVR.removeFrame();
						$rootScope.vrweb.form = true;
						angular.element('body').css('cursor','default');
						$document.off('dblclick');
					})
				})
	    	};

			scope.vrContentvsvrChild = function(objId, event){
				console.log('vrContentvsvrChild',objId);
				var item = event.currentTarget.closest("#"+ objId);
				var svg = event.currentTarget.closest("svg");
				var svgElement = event.currentTarget.closest(".vrElement");
				var mainCircle = angular.element(svg.querySelectorAll('.mainCircle path'));
				var path = angular.element(svgElement.querySelectorAll("[class^='svg_'] path"));

				var vrContent = angular.element(item.querySelectorAll('.vrContent'));
				var contentObj = angular.element(item.querySelectorAll('.content'));

				angular.element(document.querySelectorAll('path')).attr('class','');

	    		_.each($rootScope.halloVRItems, function(halloVRObj){
	    			if(halloVRObj.id != objId){
		    			_.each(halloVRObj.content, function(content){    		
		    				content.isMargined = false;

		    				mainCircle.attr('class','');
							path.attr('class','');
							vrContent.attr('class', 'vrContent');
							contentObj.attr('class', 'content');
		    			});
		    		}else{
						_.each(halloVRObj.content, function(content){																																																								
							content.isMargined = content.isMargined?false:true;
							var vrcontent = content.isMargined?'vrContent':'vrContent margined';
							var contentobj = content.isMargined?'content margined':'content';

							vrContent.attr('class', vrcontent);
							contentObj.attr('class', contentobj);

							if(content.isMargined){

								mainCircle.attr('class','draw');
								path.attr('class','draw');
							}
						});
		    		}
	    		})
	    		
				HalloVR.hatsDown = true;				
	    	};  

	    	scope.halloVRObj = {
				// "id": scope.newVrObjectForm.type + "-" + (scope.indexId++),
				"isWhich": false,
				"draw": false,
				"template": "",
				"content":[]
				// "position": position
			}
			scope.content = {
				"isMargined": false,
				"vrChildren": []
				// "htmlBind": null
			}
			scope.vrChild = {
				"id": "child2",
				"isMargined": false,
				// "x": 700,
				// "y": 100,
				// "htmlBind": null
			}
			scope.halloObj = function(isChild){

				if(!isChild){
					
					scope.halloVRObj.id = scope.newVrObjectForm.type + "-" + (scope.indexId++);
					scope.halloVRObj.position = position;

					angular.extend(scope.halloVRObj, scope.newVrObjectForm);

		    		if(scope.newVrObjectForm.type == "item"){
		    			if(scope.newVrObjectForm.itemTopLevel){
							
							scope.halloVRObj.template = topLevelType(scope.halloVRObj);
							
							if(scope.newVrObjectForm.itemTopLevel.itemObj3D){ 
								HalloVR.load_object_for(scope.halloVRObj.position,  scope.newVrObjectForm.itemTopLevel.itemObj3D);
							}
						}
					}
					
					if(scope.newVrObjectForm.logo){
						scope.halloVRObj.template = typeOfFunctions["logo"](scope.newVrObjectForm.logo);
					}
					
					if(scope.newVrObjectForm.menu){
						scope.halloVRObj.template = typeOfFunctions["menu"](scope.newVrObjectForm.menu);
					}
					
					var notLogo = (!scope.newVrObjectForm.logo)?"<md-button class=\"md-fab md-mini create-child\" aria-label=\"FAB\" ng-click=\"createChild('" + scope.halloVRObj.id + "')\">+</md-button>":'';
					
					$rootScope.halloVRItems.push(scope.halloVRObj);
					
					var content = $compile(angular.element("<div id=\"" + scope.halloVRObj.id + 
												"\" type=\"" + scope.halloVRObj.type + "\" class=\"vrElement\" ng-repeat=\"(key, item) in halloVRItems\">" +
												notLogo +
				                    			scope.halloVRObj.template + "</div>"))(scope);

	    			angular.element('body').append(content);
	                
	                $timeout(function(){
	                	HalloVR.addItem(scope.halloVRObj);

						scope.close();
	                },10)
	            }

	            if(isChild){

	            	angular.extend(scope.content, {"id": scope.newVrObjectForm.parent + "-content-"+ generator.ID() });


	            	if(scope.newVrObjectForm.subLevelItemHtml){
	            		angular.extend(scope.content, {
	            			htmlBind: "",
	            			parentId: scope.newVrObjectForm.parent,
	            			isContent: scope.newVrObjectForm.isVrChild,
	            			x: scope.newVrObjectForm.vrContentPosition.x,
	            			y: scope.newVrObjectForm.vrContentPosition.y
	            		});

	            		if(scope.newVrObjectForm.itemSubLevel.html.title){
	            			scope.content.htmlBind += "<h2>"+ scope.newVrObjectForm.itemSubLevel.html.title +"</h2>";
	            		}
	            		if(scope.newVrObjectForm.itemSubLevel.html.icon){
	            			scope.content.htmlBind += "<img src='"+ scope.newVrObjectForm.itemSubLevel.html.icon +"' />";
	            		}
	            		if(scope.newVrObjectForm.itemSubLevel.html.image){
	            			scope.content.htmlBind += "<img src='"+ scope.newVrObjectForm.itemSubLevel.html.image +"' />";
	            		}
	            		if(scope.newVrObjectForm.itemSubLevel.html.text){
	            			scope.content.htmlBind += "<div>" + scope.newVrObjectForm.itemSubLevel.html.text + "</div>";
	            		}
	            		if(scope.newVrObjectForm.itemSubLevel.html.video){
							// var iframe = document.createElement('iframe');
							// 	iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(scope.newVrObjectForm.itemSubLevel.html.video);
							var iframe = "<iframe width=\"560\" height=\"315\" src=\""+encodeURI(scope.newVrObjectForm.itemSubLevel.html.video)+"\" ></iframe>";
		            			scope.content.htmlBind += iframe;
	            		}
	            		
	            		scope.createHTMLBIND(scope.content);

	            	}

					console.log('scope.halloVRObj', scope.halloVRObj);
	            	
	            	if(scope.newVrObjectForm.itemSubLevelPlugins){

	            	}
	            }
				
	    	}
	    	scope.createChild = function(parent){
	    		
	    		scope.newVrObjectForm.parent = parent;
	    		$rootScope.vrweb.form = true;
	    		scope.subItem = true;
	    		
	    	}

	    	scope.addVRChild = function(){
	    	}
	    	scope.addContent = function(){
	    	}

	    	scope.close = function(){
	    		$rootScope.vrweb.form = false;
	    		scope.newVrObjectForm = {};
	    		scope.halloVRObj = {};

	    		scope.settings();
	    	}

	    	/** Onchange functions*/
	    	scope.isItem = function(selectedItem){
	    		scope.forItem = false;
	    		scope.forMenu = false;
	    		scope.forFooter = false;

	    		switch(selectedItem){
	    			case 'item':
	    				scope.forItem = true; break;
	    			case 'menu':
	    				scope.forMenu = true; break;
	    			case 'footer':
	    				scope.forFooter = true; break;
	    			default: break;
	    		}
	    	}
	    	scope.isSubHTML = function(selectedType){
				scope.subHtmlIconTitle = false;
				scope.subHtmlImageTitle = false;
				scope.subHtmlImageTitleText = false;
				scope.subVideoTitle = false; 
				scope.subVideoTitleText = false;

				scope.itemSubLevelHtml = true;

	    		switch(selectedType){
	    			case 'IconTitle':
	    				scope.subHtmlIconTitle = true; break;
	    			case 'ImageTitle':
	    				scope.subHtmlImageTitle = true; break;
	    			case 'ImageTitleText':
	    				scope.subHtmlImageTitleText = true; break;
	    			case 'VideoTitle':
	    				scope.subVideoTitle = true; break;
	    			case 'VideoTitleText':
	    				scope.subVideoTitleText = true; break;
	    			default: break;
	    		}
	    		
	    	}

	    	scope.isSubItem = function(selectedSubItem){
				scope.subPortfolioItem = false;
				scope.subPlugins = false;
				scope.subHtml = false;
				scope.itemSubLevelHtml = false;

	    		switch(selectedSubItem){
	    			case 'html':
	    				scope.subHtml = true; break;
	    			case 'portfolio-item':
	    				scope.subPortfolioItem = true; break;
	    			case 'plugins':
	    				scope.subPlugins = true; break;
	    			default: break;
	    		}
	    		
	    	}

	    	scope.isService = function(services){
	    		scope.forLogo = false;
				scope.forGallery = false;
				scope.forTopLevel = false;
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
	    			case 'top-level':
	    				scope.forTopLevel = true; break;
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

typeOfFunctions['menu'] = function(menuObj){
	
	var width = (menuObj.width)?menuObj.width:100;
	var height = (menuObj.height)?menuObj.height:60;
	console.log('menuObj', menuObj);
	var style = "\"width: " + width + "px;"+
		"height: " + height + "px;"+
		"background-image: url('"+menuObj.url+"');"+
		"background-repeat: no-repeat;"+
		"background-size: 100% auto;\"";
	return "<div id=\"menu\" style=" + style + "></div>";

}
typeOfFunctions['footer'] = function(footerObj){
	
	console.log('sdfsdf', footerObj);
}

/*SubItem*/
typeOfFunctions['portfolio'] = function(htmlObj){
	console.log('htmlObj', htmlObj);
}
typeOfFunctions['gallery'] = function(htmlObj){
	console.log('htmlObj', htmlObj);

}
typeOfFunctions['blog-post-list'] = function(htmlObj){
	console.log('htmlObj', htmlObj);

}
typeOfFunctions['services'] = function(htmlObj){
	console.log('htmlObj', htmlObj);

}
typeOfFunctions['contacts'] = function(htmlObj){
	console.log('htmlObj', htmlObj);

}
typeOfFunctions['html'] = function(htmlObj){
	console.log('htmlObj', htmlObj);

}

var topLevelType = function(typeObj){
	
	typeObj.pathSettings.wireColorStart = typeObj.pathSettings.wireColorStart? typeObj.pathSettings.wireColorStart : "#ffff00";
	typeObj.pathSettings.wireColorStop = typeObj.pathSettings.wireColorStop? typeObj.pathSettings.wireColorStop : "#ff0000";
	
	var tItem = "<svg>";
		tItem +="<defs>";
		tItem +="<mask id='hide_lines'>";
		tItem +="<circle cx='0' cy='0' r='10000' fill='white' />";
		tItem +="<path transform='translate(500,480)' fill='#"+typeObj.id +"-"+ typeObj.itemTopLevel.name +"'  d='M -25, 0 m -75, 0 a 75,75 0 1,0 200,0 a 75,75 0 1,0 -200,0'  />";
		tItem +="</mask>";
		tItem += "<linearGradient id=\""+typeObj.id +"-"+ typeObj.itemTopLevel.name+"\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\">";
		tItem += "<stop offset=\"0%\" style=\"stop-color:"+ typeObj.pathSettings.wireColorStart +";stop-opacity:1\" />";
		tItem += "<stop offset=\"100%\" style=\"stop-color:"+ typeObj.pathSettings.wireColorStop +";stop-opacity:1\" />";
		tItem += "</linearGradient>";
		tItem +="</defs>";
		tItem +="<g>";
		tItem +="<circle cx='500' cy='480' r='100' class='itemOpener'  ng-click='vrContentvsvrChild(\""+typeObj.id+"\", $event)' />"; //JSON.stringify(typeObj)
		tItem +="<g class='mainCircle' fill-rule='evenodd'>";
		tItem +="<path transform='translate(500,480)' stroke-dashoffset='0' id='mainBodyCircle' stroke-dashoffset='1000' d='M -25, 0 m -75, 0 a 75,75 0 1,0 200,0 a 75,75 0 1,0 -200,0'  />";
		// tItem +="<path-line d='"+ typeObj.content[0].d +"' stroke='white' mask='url(#hide_lines)' strokedashoffset='0'></path-line>";
		tItem +="</g>";
		tItem +="</g>";
		tItem +="</svg>";
	return tItem;
};