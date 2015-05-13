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
  isMobile: false,
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
	  var random_fixed = Math.random();

      function animate(){


        // -- Requesting new animation frame --

		requestAnimationFrame(function(){
			animate();
		});

		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			controls.update();
		}

		HalloVR.items['top-menu'].rotation.set(camera.rotation.x, camera.rotation.y, camera.rotation.z);
		HalloVR.items['item-2'].rotation.y = camera.rotation.y;
		HalloVR.items['item-3'].rotation.y = camera.rotation.y;
		HalloVR.items['item-4'].rotation.y = camera.rotation.y;

		if(Objects3D[0])
		{
			Objects3D.forEach(function(item){
				item.rotation.y += camera.rotation.y/ (40 + 10 * Math.random());
				item.rotation.x += camera.rotation.x/ (40 + 10 * Math.random());
				item.rotation.z += camera.rotation.z/ (40 + 10 * Math.random());
			});
		}


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

		if(!HalloVR.isMobile) {
			time = Date.now() * 0.00005;

			for ( i = 0; i < sceneGL.children.length; i ++ ) {

				var object = sceneGL.children[ i ];

				if ( object instanceof THREE.PointCloud ) {

					object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) ) * 0.02;

				}

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

		pos_x = -Math.round( ( radius ) * Math.sin( phi ) * Math.cos( theta )); // Position x
		pos_z = Math.round( ( radius ) * Math.sin( phi ) * Math.sin( theta )); // Position z
		pos_y = Math.round( ( radius ) * Math.cos( phi ) ); // Position y

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

      // add subtle ambient lighting
      var ambientLight = new THREE.AmbientLight(0x000000);
      sceneGL.add(ambientLight);

      // directional lighting
      var directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(400, 0, 0).normalize();
      sceneGL.add(directionalLight);

	  HalloVR.tools.camera = camera;

	  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	 	HalloVR.isMobile = true;
	 	var controls = new THREE.DeviceOrientationControls( camera );
	 	controls.connect();
	  } else {
	  	var controls = new THREE.OrbitControls(camera);
      	controls.noPan = true;
	    controls.noZoom = true;
	    controls.autoRotate = true;
	    controls.autoRotateSpeed = 0;
	  }



      // -- Dear Coder, here you can add an Item to your HelloVR world --

    addItem("item-1", 0, 0);
	  addItem("item-2", -5, -50);
	  addItem("item-3", -5, 35);
	  addItem("item-4", -5, -100);
	  addItem("top-menu", 87, -22);

	  var backgroundTexture = THREE.ImageUtils.loadTexture('assets/picsart.jpg');
	  backgroundTexture.minFilter = THREE.LinearFilter;


      // -- Creating our Sphere with Texture --
      var sphereBack = new THREE.Mesh(
        new THREE.SphereGeometry(2000, 20, 20),
        new THREE.MeshBasicMaterial({
          map: backgroundTexture
        })
      );

      // -- Adding scale with x axis --
      sphereBack.scale.x = -1;
      sceneGL.add(sphereBack);

	  var sphereFrame = new THREE.Mesh(
        new THREE.SphereGeometry(800, 20, 20),
        new THREE.MeshBasicMaterial({
       		wireframe: true,
			color: 0xffffff,
			transparent: true,
			opacity: 0.05
        })
      );

      sceneGL.add(sphereFrame);

        var raycaster = new THREE.Raycaster();
		var mouse = new THREE.Vector2();


		document.onclick = function(event){
			onDocumentMouseDown(event);
		};

		function onDocumentMouseDown( event ) {

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

		}

	  // -- Adding particles

	  var particles, geometry, materials = [], parameters, i, h, color, size;

	  geometry = new THREE.Geometry();

		  for ( i = 0; i < 5000; i++ ) {

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

			  materials[i] = new THREE.PointCloudMaterial( { size: size, opacity: 0.4 , color: 0xffffff, emissive: '#ffffff', specular: '#ffffff' , map: THREE.ImageUtils.loadTexture( 'assets/particle.png' ), transparent: true, alphaTest: 0.2 } );

			  particles = new THREE.PointCloud( geometry, materials[i] );

			  particles.rotation.x = Math.random() * 0.5 ;
			  particles.rotation.y = Math.random() * 0.5 ;
			  particles.rotation.z = Math.random() * 0.5 ;
			  particles.overdraw = true;

			  if(!HalloVR.isMobile)
				  {
					  sceneGL.add( particles );
				  }


		  }

	  // -- / Particles --


	  var spherePoli = [];

	  var textureHat = new THREE.ImageUtils.loadTexture('assets/hat.png');
	  textureHat.minFilter = THREE.LinearFilter;

	  spherePoli[1] = new THREE.Mesh(
        new THREE.SphereGeometry(800, 200, 200),
        new THREE.MeshBasicMaterial({
       		map: THREE.ImageUtils.loadTexture('assets/hat.png'),
			transparent: true,
			opacity: 0.3
        })
      );
	  spherePoli[1].material.side = THREE.DoubleSide;
	  spherePoli[1].rotation.z = 5 * Math.PI/180;
	  if(!HalloVR.isMobile)
      	sceneGL.add(spherePoli[1]);


	  spherePoli[2] = new THREE.Mesh(
        new THREE.SphereGeometry(805, 200, 200),
        new THREE.MeshBasicMaterial({
       		map: THREE.ImageUtils.loadTexture('assets/hat.png'),
			transparent: true,
			opacity: 0.2
        })
      );
	  spherePoli[2].material.side = THREE.DoubleSide;
	  spherePoli[2].rotation.z = 10 * Math.PI/180 ;
	  if(!HalloVR.isMobile)
      	sceneGL.add(spherePoli[2]);


	  spherePoli[3] = new THREE.Mesh(
        new THREE.SphereGeometry(810, 200, 200),
        new THREE.MeshBasicMaterial({
       		map: textureHat,
			transparent: true,
			opacity: 0.05
        })
      );
	  spherePoli[3].material.side = THREE.DoubleSide;
	  spherePoli[3].rotation.z = -7 * Math.PI/180 ;
	  if(!HalloVR.isMobile)
      	sceneGL.add(spherePoli[3]);

	var wireframeMaterial = new THREE.MeshPhongMaterial( { wireframe: true, wireframeLinewidth: 0.6, opacity: 0.2 } );
	var fillMaterial = new THREE.MeshPhongMaterial({ color: 'black', transparent: true, opacity: 0.8, shininess: 200, emissive: '#000000', specular: '#ffffff' });
	var multiMaterial = [ wireframeMaterial, fillMaterial ];

	var Objects3D = [];


	// -- 3d Objects for Menus -- //


	/*Objects3D[0] = THREE.SceneUtils.createMultiMaterialObject(
		// radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight,
		new THREE.CylinderGeometry( 0, 85, 125, 4, 1 ),
		multiMaterial );
	Objects3D[0].rotation.z = -Math.PI;
	Objects3D[0].position = HalloVR.items['item-2'].position;
	Objects3D[0].overdraw = true;
	sceneGL.add( Objects3D[0] );*/

	var loader = new THREE.JSONLoader(); // init the loader util

	// init loading

	  function load_object_for(item_name, obj_name) {
		  loader.load('assets/' + obj_name + '.js', function (geometry) {
			  // create a mesh with models geometry and material
			  object = THREE.SceneUtils.createMultiMaterialObject(
				geometry,
				multiMaterial
			  );

			  object.scale.set(15,15,15);
			  object.lookAt(camera.position);
			  object.position.set(HalloVR.items[item_name].position.x,HalloVR.items[item_name].position.y,HalloVR.items[item_name].position.z);

			  object.rotation.y = -Math.PI/5;

			  Objects3D.push(object);

			  sceneGL.add(object);
			});
	  }


	  load_object_for('item-2', 'object_7');
	  load_object_for('item-3', 'object_6');
	  load_object_for('item-4', 'object_5');




	//console.log(HalloVR.items['item-4'].position);



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
