var camera, scene, renderer;

			var texture_placeholder,
			isUserInteracting = false,
			onMouseDownMouseX = 0, onMouseDownMouseY = 0,
			lon = 0, onMouseDownLon = 0,
			lat = 0, onMouseDownLat = 0,
			phi = 0, theta = 0;
			var planeLogo;

			init();
			animate();

			function init() {

				var container, mesh;

				container = document.getElementById( 'container' );

				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 );
				camera.target = new THREE.Vector3( 0, 0, 0 );
				camera.position.x = 0;
				camera.position.y = 100;
				camera.position.z = 0;
				renderer = new THREE.WebGLRenderer( {antialias:true, alpha: true} );
				//renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				scene = new THREE.Scene();

				var geometry = new THREE.SphereGeometry( 500, 60, 40 );
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

				scene.add( mesh );

				var element	= document.createElement('div')
      	element.id = 'contact_info'
      	element.innerHTML = 'Some Information';

      	// var element = document.createElement( 'div' );
      	// element.style.width = '100px';
      	// element.style.height = '100px';
      	// element.style.background = new THREE.Color( Math.random() * 0xffffff ).getStyle();

      	var objectCSS 	= new THREE.CSS3DObject( element );
        window.objectCSS	= objectCSS;
      	objectCSS.position.x = 100;
      	objectCSS.position.z = -1000;
      	scene.add( objectCSS );

				// Logo Part goes here

				var textureLogo = THREE.ImageUtils.loadTexture( "assets/logo.png" );

				var materialLogo = new THREE.MeshLambertMaterial({ map : textureLogo, transparent: true});
				planeLogo = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), materialLogo);
				planeLogo.material.side = THREE.DoubleSide;
				planeLogo.anisotropy = 2;
				planeLogo.position.x = 80;
				planeLogo.position.z = 0;
				planeLogo.rotation.y = -Math.PI/2;
				planeLogo.position.y = 90;

				scene.add(planeLogo);


				document.addEventListener( 'mousedown', onDocumentMouseDown, false );
				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'mouseup', onDocumentMouseUp, false );
				document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
				document.addEventListener( 'DOMMouseScroll', onDocumentMouseWheel, false);

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function onDocumentMouseDown( event ) {

				event.preventDefault();

				isUserInteracting = true;

				onPointerDownPointerX = event.clientX;
				onPointerDownPointerY = event.clientY;

				onPointerDownLon = lon;
				onPointerDownLat = lat;

			}

			function onDocumentMouseMove( event ) {

				if ( isUserInteracting === true ) {

					lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
					lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

				}

			}

			function onDocumentMouseUp( event ) {

				isUserInteracting = false;

			}

			function onDocumentMouseWheel( event ) {

				// WebKit

				if ( event.wheelDeltaY ) {

					camera.fov -= event.wheelDeltaY * 0.05;

				// Opera / Explorer 9

				} else if ( event.wheelDelta ) {

					camera.fov -= event.wheelDelta * 0.05;

				// Firefox

				} else if ( event.detail ) {

					camera.fov += event.detail * 1.0;

				}

				camera.updateProjectionMatrix();

			}

			function animate() {

				requestAnimationFrame( animate );
				update();

			}

			function update() {

				lat = Math.max( - 85, Math.min( 85, lat ) );
				phi = THREE.Math.degToRad( 90 - lat );
				theta = THREE.Math.degToRad( lon );

				camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
				camera.target.y = 500 * Math.cos( phi );
				camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

				camera.lookAt( camera.target );

				/*
				// distortion
				camera.position.copy( camera.target ).negate();
				*/

				renderer.render( scene, camera );

			}