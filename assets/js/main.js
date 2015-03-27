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
  hatsDown: true,
  installThree: function(){

      var t = Math.PI/2;

      function animate(){
		  
				 
        // request new frame
		   
		  requestAnimationFrame(function(){
			  animate();
		  }); 

        // render
        rendererGl.render(sceneGL, camera);
        rendererCss.render(sceneCSS, camera);
		  
		spherePoli[1].rotation.y += 0.005;
		spherePoli[2].rotation.y += 0.009;
		spherePoli[3].rotation.y += 0.007;
		  
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
		 

		//Particle animation
		  
		time = Date.now() * 0.00005;
		  
		for ( i = 0; i < sceneGL.children.length; i ++ ) {

			var object = sceneGL.children[ i ];

			if ( object instanceof THREE.ParticleSystem ) {

				object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) ) * 0.02;

			}

		}
		  
		// /Particle animation
      }

   	var addPage = function(id, class_name, lat, lng, parent){
		
		phi   = ( 85 - lat ) * ( Math.PI/180 );
		theta = ( lng + 279 ) * ( Math.PI/180 );
		radius = 800;

		element = document.querySelector('#' + id);
		
		pos_x = -( ( radius ) * Math.sin( phi ) * Math.cos( theta ));
		pos_z = ( ( radius ) * Math.sin( phi ) * Math.sin( theta ));
		pos_y = ( ( radius ) * Math.cos( phi ) );

   		objectCSS   = new THREE.CSS3DObject( element );
		
  		window.objectCSS  = objectCSS;
   		objectCSS.position.z = pos_z || 0;
   		objectCSS.position.y = pos_y || 0;
   		objectCSS.position.x = pos_x || 0;
		objectCSS.lookAt( camera.position );
		
		if(!parent) {
			HalloVR.items[id] = objectCSS;
		} else {
			HalloVR.items[parent].childs = [];
			HalloVR.items[parent].childs[id] = objectCSS;
		}
		
  		sceneCSS.add( objectCSS );
   	};

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

      // -- Scene Code Goes Here -- //

      addPage("item-1", "", 0, 0);
      //addPage("components/video_component/", "1424px", "1424px", "", "", -1000 , 0 , -500, 0, Math.PI/3, 0);
	  //addPage("components/gallery_component/", "1624px", "1424px", "", "", 1500 , 0 , -500, 0, -Math.PI/2.5, 0);
	  addPage("item-2", "", -5, -50);
	  	//addPage("item-2-1", "", -4, -70, 'item-2');


      //Creating our Sphere with Texture
      var sphereBack = new THREE.Mesh(
        new THREE.SphereGeometry(2000, 20, 20),
        new THREE.MeshBasicMaterial({
          map: THREE.ImageUtils.loadTexture('assets/picsart.jpg')
        })
      );
	  
      //Adding scale with x axis
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
      //sceneGL.add(sphereFrame);
	  
	  //Particles 
	  
	  var particles, geometry, materials = [], parameters, i, h, color, size;
	  
	  geometry = new THREE.Geometry();

		  for ( i = 0; i < 15000; i++ ) {

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
	  
	  // / Particles
	  
	  
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
	  
	var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 'white', wireframe: true, transparent: true, wireframeLinewidth: 1 } ); 
	var multiMaterial = [ wireframeMaterial ];
	  
	  
	// -- 3d Objects for Menus -- //  
	  
	var pyramide = THREE.SceneUtils.createMultiMaterialObject( 
		// radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight,
		new THREE.CylinderGeometry( 0, 85, 125, 4, 1 ), 
		multiMaterial );
	pyramide.rotation.z = -Math.PI;
	pyramide.position = HalloVR.items['item-2'].position;
	sceneGL.add( pyramide );
	  
	  
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

HalloVR.init();


$(document).ready(function(){
	$('body').fadeIn(1500);
	$(window).blur(function(e) {
    	HalloVR.tools.pageFocus = false;
	});
	$(window).focus(function(e) {
		HalloVR.tools.pageFocus = true;
	});
});