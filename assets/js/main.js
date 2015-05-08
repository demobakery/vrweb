// -- Welcome to HelloVR :) -- //

var HalloVR = {

  init: function(){
    // -- Calling Three.js Installer -- //
    this.installThree();

  },
  items: {},
  tools: {
	  pageFocus: true
  },
  map: null,
  hatsDown: true,
  initializeMap: function() {
	// Create an array of styles.
  var styles = [{"featureType":"road","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"administrative","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"weight":1}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"weight":0.8}]},{"featureType":"landscape","stylers":[{"color":"#ffffff"}]},{"featureType":"water","stylers":[{"visibility":"off"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"elementType":"labels","stylers":[{"visibility":"off"}]},{"elementType":"labels.text","stylers":[{"visibility":"on"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#000000"}]},{"elementType":"labels.icon","stylers":[{"visibility":"on"}]}];


  // Create a new StyledMapType object, passing it the array of styles,
  // as well as the name to be displayed on the map type control.
  var styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});

  // Create a map object, and include the MapTypeId to add
  // to the map type control.
  var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(55.6468, 37.581),
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    }
  };
  HalloVR.map = new google.maps.Map(document.getElementById('map_canvas'),
    mapOptions);

  //Associate the styled map with the MapTypeId and set it to display.
  HalloVR.map.mapTypes.set('map_style', styledMap);
  HalloVR.map.setMapTypeId('map_style');
  },
  installThree: function(){

      var t = Math.PI/2;

      function animate(){
		  
				 
        // -- Requesting new animation frame --
		   
		requestAnimationFrame(function(){
			animate();
		});

		HalloVR.items['top-menu'].rotation = camera.rotation;
		HalloVR.items['item-2'].rotation.y = camera.rotation.y;
		HalloVR.items['item-3'].rotation.y = camera.rotation.y;
		HalloVR.items['item-4'].rotation.y = camera.rotation.y;


		Objects3D[0].rotation.y += camera.rotation.y/50;
		Objects3D[1].rotation.y -= camera.rotation.y/50;
		Objects3D[2].rotation.y += camera.rotation.y/50;

        // render
        rendererGl.render(sceneGL, camera);
        rendererCss.render(sceneCSS, camera);
		  
		spherePoli[1].rotation.y += 0.005;
		spherePoli[2].rotation.y += 0.009;
		spherePoli[3].rotation.y += 0.007;

		// -- Rendering our blue hats animation --
		  
		t += Math.PI/180 * 0.1; 
		  
		if(!HalloVR.hatsDown) {
			if( spherePoli[1].material.map.offset.y > -0.3 )  
				spherePoli[1].material.map.offset.y -= 0.3 / Math.PI/(t);
			
			if( spherePoli[2].material.map.offset.y > -0.3 )  
				spherePoli[2].material.map.offset.y -= 0.2 / Math.PI/(t);
			
			if( spherePoli[3].material.map.offset.y > -0.3 )  
				spherePoli[3].material.map.offset.y -= 0.1 / Math.PI/(t);
		} else {
			if( spherePoli[1].material.map.offset.y < 0 )  
				spherePoli[1].material.map.offset.y += 0.1 / Math.PI/(t);
			
			if( spherePoli[2].material.map.offset.y < 0 )  
				spherePoli[2].material.map.offset.y += 0.2 / Math.PI/(t);
			
			if( spherePoli[3].material.map.offset.y < 0 )  
				spherePoli[3].material.map.offset.y += 0.3 / Math.PI/(t);
		}

		// -- / Blue hats Animation --
		 

		// -- Animating and rendering our particles
		  
		time = Date.now() * 0.00005;
		  
		for ( i = 0; i < sceneGL.children.length; i ++ ) {

			var object = sceneGL.children[ i ];

			if ( object instanceof THREE.ParticleSystem ) {

				object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) ) * 0.02;

			}

		}
		  
		// -- /Particle animation --
      }

   	var addItem = function(id, lat, lng){
		
		phi   = ( 85 - lat ) * ( Math.PI/180 );
		theta = ( lng + 279 ) * ( Math.PI/180 );
		radius = 800;

		// -- Getting the element with this id --

		element = document.querySelector('#' + id);

		// -- Positioning it to our Frame Sphere fot lat, lng --
		
		pos_x = -( ( radius ) * Math.sin( phi ) * Math.cos( theta )); // Position x
		pos_z = ( ( radius ) * Math.sin( phi ) * Math.sin( theta )); // Position z
		pos_y = ( ( radius ) * Math.cos( phi ) ); // Position y

		// -- Creating CSS Object for our scene -- 

   		objectCSS   = new THREE.CSS3DObject( element );
		
  		window.objectCSS  = objectCSS;
   		objectCSS.position.z = pos_z || 0;
   		objectCSS.position.y = pos_y || 0;
   		objectCSS.position.x = pos_x || 0;
		objectCSS.lookAt( camera.position );
		
		HalloVR.items[id] = objectCSS;

		// -- Adding out object to scene --
		
  		sceneCSS.add( objectCSS );
   	};
   	  var mouse = new THREE.Vector2();
      var container = document.querySelector("#container");
      var projector = new THREE.Projector();

      // renderer
      var rendererCss = new THREE.CSS3DRenderer();
      rendererCss.setSize(window.innerWidth, window.innerHeight);
      rendererCss.domElement.id = 'rendererCSS';

      var rendererGl = new THREE.WebGLRenderer({alpha:true, antialias: true });
      rendererGl.setClearColor(0x00ff00, 0.0);
      rendererGl.domElement.id = 'rendererGL';

      rendererGl.setSize(window.innerWidth, window.innerHeight);
      rendererCss.domElement.appendChild(rendererGl.domElement);

      container.appendChild(rendererCss.domElement);

      var domEvents	= new THREEx.DomEvents(camera, rendererGl.domElement);

      console.log(domEvents);

      // scene
      var sceneGL = new THREE.Scene();
      var sceneCSS = new THREE.Scene();

      // camera
      var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
      camera.position.z = 500;
      camera.position.y = 0;
      sceneGL.add(camera);
	  
	  HalloVR.tools.camera = camera;

      var controls = new THREE.OrbitControls(camera);
      controls.noPan = true;
      controls.noZoom = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0;

      // -- Dear Coder, here you can add an Item to your HelloVR world --

      addItem("item-1", 0, 0);
	  addItem("item-2", -5, -50);
	  addItem("item-3", -5, 35);
	  addItem("item-4", -5, -100);
	  addItem("top-menu", 87, -22);


      // -- Creating our Sphere with Texture --
      var sphereBack = new THREE.Mesh(
        new THREE.SphereGeometry(2000, 20, 20),
        new THREE.MeshBasicMaterial({
          map: THREE.ImageUtils.loadTexture('assets/picsart.jpg')
        })
      );
	  
      // -- Adding scale with x axis --
      sphereBack.scale.x = -1;
      sceneGL.add(sphereBack);
	  
	  var sphereFrame = new THREE.Mesh(
        new THREE.SphereGeometry(800, 200, 200),
        new THREE.MeshBasicMaterial({
       		wireframe: true,
			color: 0xffffff,
			transparent: true,
			opacity: 0.05
        })
      );

      sceneGL.add(sphereFrame);

      domEvents.addEventListener(sphereBack, 'click', function(event){
			console.log('you clicked on mesh', sphereBack)
		}, false)
	  
	  // -- Adding particles 
	  
	  var particles, geometry, materials = [], parameters, i, h, color, size;
	  
	  geometry = new THREE.Geometry();

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
	  
	  // -- / Particles --
	  
	  
	  var spherePoli = [];
	  
	  spherePoli[1] = new THREE.Mesh(
        new THREE.SphereGeometry(920, 200, 200),
        new THREE.MeshBasicMaterial({
       		map: new THREE.ImageUtils.loadTexture('assets/hat.png'),
			transparent: true,
			opacity: 0.3
        })
      );
	  spherePoli[1].material.side = THREE.DoubleSide;
	  spherePoli[1].rotation.z = 5 * Math.PI/180;
      sceneGL.add(spherePoli[1]);
	  
	  
	  spherePoli[2] = new THREE.Mesh(
        new THREE.SphereGeometry(921, 200, 200),
        new THREE.MeshBasicMaterial({
       		map: new THREE.ImageUtils.loadTexture('assets/hat.png'),
			transparent: true,
			opacity: 0.2
        })
      );
	  spherePoli[2].material.side = THREE.DoubleSide;
	  spherePoli[2].rotation.z = 10 * Math.PI/180 ;
      sceneGL.add(spherePoli[2]);
	  
	  
	  spherePoli[3] = new THREE.Mesh(
        new THREE.SphereGeometry(922, 200, 200),
        new THREE.MeshBasicMaterial({
       		map: new THREE.ImageUtils.loadTexture('assets/hat.png'),
			transparent: true,
			opacity: 0.05
        })
      );
	  spherePoli[3].material.side = THREE.DoubleSide;
	  spherePoli[3].rotation.z = -7 * Math.PI/180 ;
      sceneGL.add(spherePoli[3]);
	  
	var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 'white', wireframe: true, transparent: true, wireframeLinewidth: 0.6 } ); 
	var multiMaterial = [ wireframeMaterial ];

	var Objects3D = [];
	  
	  
	// -- 3d Objects for Menus -- //  


	  
	Objects3D[0] = THREE.SceneUtils.createMultiMaterialObject( 
		// radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight,
		new THREE.CylinderGeometry( 0, 85, 125, 4, 1 ), 
		multiMaterial );
	Objects3D[0].rotation.z = -Math.PI;
	Objects3D[0].position = HalloVR.items['item-2'].position;
	sceneGL.add( Objects3D[0] );



	Objects3D[1] = THREE.SceneUtils.createMultiMaterialObject( 
		// radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight,
		new THREE.CylinderGeometry( 0, 85, 125, 4, 1 ), 
		multiMaterial );
	Objects3D[1].rotation.z = -Math.PI;
	Objects3D[1].position = HalloVR.items['item-3'].position;
	sceneGL.add( Objects3D[1] );

	Objects3D[2] = THREE.SceneUtils.createMultiMaterialObject( 
		// radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight,
		new THREE.CylinderGeometry( 0, 85, 125, 4, 1 ), 
		multiMaterial );
	Objects3D[2].rotation.z = -Math.PI;
	Objects3D[2].position = HalloVR.items['item-4'].position;
	sceneGL.add( Objects3D[2] );

	  
	  
	// -- / 3d Objects for Menus  -- //  
	  
	  
	  
    	/*
      var geometry = new THREE.SphereGeometry(10000, 60, 40 );
			geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );

			var video = document.createElement( 'video' );
			video.width = 640;
			video.height = 360;
			video.autoplay = true;
			video.loop = true;
			video.src = "assets/la.mp4";
			video.volume = 0;

			// Background animation goes here

			var texture = new THREE.VideoTexture( video );
			texture.minFilter = THREE.LinearFilter;
			var material = new THREE.MeshBasicMaterial( { map : texture } );
			mesh = new THREE.Mesh( geometry, material );

			sceneGL.add( mesh );*/

      // -- Scene code ends here -- //

      // start animation
      animate();
  }

};

// -- Initializing our HalloVR world -- //
HalloVR.init();

$(document).ready(function(){

	HalloVR.initializeMap();

	$('body').fadeIn(1500);
	$(window).blur(function(e) {
    	HalloVR.tools.pageFocus = false;
	});
	$(window).focus(function(e) {
		HalloVR.tools.pageFocus = true;
	});
});