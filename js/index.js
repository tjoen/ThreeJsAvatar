$(function(){

    /*global variables*/
	var scene, camera, renderer;
	var controls, guiControls, datGUI;
	var stats;
	var spotLight, hemi;
	var SCREEN_WIDTH, SCREEN_HEIGHT;
	var loader, model;


	function init(){
		/*creates empty scene object and renderer*/
		scene = new THREE.Scene();
		camera =  new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, .1, 500);
		renderer = new THREE.WebGLRenderer({antialias:true});

		renderer.setClearColor(0x000000);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMapEnabled= true;
		renderer.shadowMapSoft = true;

		/*add controls*/
		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.addEventListener('change', render );

		camera.position.x = 200;
		camera.position.y = 200;
		camera.position.z = 200;
		camera.lookAt(scene.position);

		/*datGUI controls object*/
		guiControls = new function(){
            this.Stomach = 0.0;
            this.Chest = 0.0;
            this.Head = 0.0;
            this.UpperArm_L = 0.0;

            //Added for Arpit's model
            this.LowerArm_L = 0.0;
            this.Hand_L = 0.0;
            this.UpperArm_R = 0.0;
            this.LowerArm_R = 0.0;
            this.Hand_R = 0.0;

			this.rotationX  = 0.0;
			this.rotationY  = 0.0;
			this.rotationZ  = 0.0;

			this.lightX = 131;
			this.lightY = 107;
			this.lightZ = 180;
			this.intensity = 1.5;
			this.distance = 373;
			this.angle = 1.6;
			this.exponent = 38;
			this.shadowCameraNear = 34;
			this.shadowCameraFar = 2635;
			this.shadowCameraFov = 68;
			this.shadowCameraVisible=false;
			this.shadowMapWidth=512;
			this.shadowMapHeight=512;
			this.shadowBias=0.00;
			this.shadowDarkness=0.11;

            this.scene = function(){
                console.log(scene);
            };

		}

        //add some nice lighting
        hemi = new THREE.HemisphereLight( 0xff0090, 0xff0011 );
        scene.add(hemi);
        //add some fog
        scene.fog = new THREE.Fog( 0xffff90, .01, 500 );

		/*adds spot light with starting parameters*/
		spotLight = new THREE.SpotLight(0xffffff);
		spotLight.castShadow = true;
		spotLight.position.set (20, 35, 40);
		spotLight.intensity = guiControls.intensity;
		spotLight.distance = guiControls.distance;
		spotLight.angle = guiControls.angle;
		spotLight.exponent = guiControls.exponent;
		spotLight.shadowCameraNear = guiControls.shadowCameraNear;
		spotLight.shadowCameraFar = guiControls.shadowCameraFar;
		spotLight.shadowCameraFov = guiControls.shadowCameraFov;
		spotLight.shadowCameraVisible = guiControls.shadowCameraVisible;
		spotLight.shadowBias = guiControls.shadowBias;
		spotLight.shadowDarkness = guiControls.shadowDarkness;
		scene.add(spotLight);

        /*add loader call add model function*/
        loader = new THREE.JSONLoader();
        //loader.load( 'https://ucarecdn.com/b229522f-bde3-49d4-bd0f-5b6313bb593f/', addModel );
        loader.load('https://ucarecdn.com/9e0bcdac-01d8-476f-a459-00ea7f2ff9c8/', addModel);

		/*adds controls to scene*/
		datGUI = new dat.GUI();

        /*edit bones*/
        datGUI.add(guiControls, "scene");
        var cfolder = datGUI.addFolder('Controls');

		cfolder.add(guiControls, 'Stomach',-3.14, 3.14);
		cfolder.add(guiControls, 'Chest',-3.14, 3.14);
		cfolder.add(guiControls, 'Head',-3.14, 3.14);
		cfolder.add(guiControls, 'UpperArm_L',-3.14, 3.14);

        // Added for Arpit's avatar model
        cfolder.add(guiControls, 'LowerArm_L',-3.14, 3.14);
        cfolder.add(guiControls, 'Hand_L',-3.14, 3.14);
        cfolder.add(guiControls, 'UpperArm_R',-3.14, 3.14);
        cfolder.add(guiControls, 'LowerArm_R',-3.14, 3.14);
        cfolder.add(guiControls, 'Hand_R',-3.14, 3.14);

		var lfolder = datGUI.addFolder('Lights');
		lfolder.add(guiControls, 'lightX',-60,400);
		lfolder.add(guiControls, 'lightY',0,400);
		lfolder.add(guiControls, 'lightZ',-60,400);

		lfolder.add(guiControls, 'intensity',0.01, 5).onChange(function(value){
			spotLight.intensity = value;
		});
		lfolder.add(guiControls, 'distance',0, 1000).onChange(function(value){
			spotLight.distance = value;
		});
		lfolder.add(guiControls, 'angle',0.001, 1.570).onChange(function(value){
			spotLight.angle = value;
		});
		lfolder.add(guiControls, 'exponent',0 ,50 ).onChange(function(value){
			spotLight.exponent = value;
		});
		lfolder.add(guiControls, 'shadowCameraNear',0,100).name("Near").onChange(function(value){
			spotLight.shadowCamera.near = value;
			spotLight.shadowCamera.updateProjectionMatrix();
		});
		lfolder.add(guiControls, 'shadowCameraFar',0,5000).name("Far").onChange(function(value){
			spotLight.shadowCamera.far = value;
			spotLight.shadowCamera.updateProjectionMatrix();
		});
		lfolder.add(guiControls, 'shadowCameraFov',1,180).name("Fov").onChange(function(value){
			spotLight.shadowCamera.fov = value;
			spotLight.shadowCamera.updateProjectionMatrix();
		});
		lfolder.add(guiControls, 'shadowCameraVisible').onChange(function(value){
			spotLight.shadowCameraVisible = value;
			spotLight.shadowCamera.updateProjectionMatrix();
		});
		lfolder.add(guiControls, 'shadowBias',0,1).onChange(function(value){
			spotLight.shadowBias = value;
			spotLight.shadowCamera.updateProjectionMatrix();
		});
		lfolder.add(guiControls, 'shadowDarkness',0,1).onChange(function(value){
			spotLight.shadowDarkness = value;
			spotLight.shadowCamera.updateProjectionMatrix();
		});

		datGUI.close();

		$("#webGL-container").append(renderer.domElement);
		/*stats*/
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';
		$("#webGL-container").append( stats.domElement );
	}

    var set = [];
    var helpset = [];
    var scaleVal = 3;

    function addModel( geometry,  materials ){
        //Added for Arpit's model
        /*materials = [
            new THREE.MeshBasicMaterial({color:0x33AA55, transparent:true, opacity:1, side: THREE.DoubleSide}),
            new THREE.MeshBasicMaterial({color:0x55CC00, transparent:true, opacity:1, side: THREE.DoubleSide}),
            new THREE.MeshBasicMaterial({color:0x000000, transparent:true, opacity:1, side: THREE.DoubleSide}),
            new THREE.MeshBasicMaterial({color:0xFF0000, transparent:true, opacity:1, side: THREE.DoubleSide}),
            new THREE.MeshBasicMaterial({color:0xFF0000, transparent:true, opacity:1, side: THREE.DoubleSide}),
            new THREE.MeshBasicMaterial({color:0x5555AA, transparent:true, opacity:1, side: THREE.DoubleSide}),
        ];*/
        for (var i = 0;i < 800; i++){
            materials[0].skinning = true;

            var cs = scaleVal * Math.random();

            set[i]= new THREE.SkinnedMesh( geometry, new THREE.MeshFaceMaterial(materials) );
            set[i].position.set(Math.random()*250,Math.random()*250,Math.random()*250);
            set[i].scale.set (cs, cs, cs);
            set[i].castShadow = true;
            set[i].receiveShadow = true;

            scene.add(set[i]);
            helpset[i] = new THREE.SkeletonHelper(set[i]);
            scene.add(helpset[i]);

        }
    }

	function render() {
		spotLight.position.x = guiControls.lightX;
		spotLight.position.y = guiControls.lightY;
		spotLight.position.z = guiControls.lightZ;

        scene.traverse(function(child){
            if (child instanceof THREE.SkinnedMesh){
                child.rotation.y += .01;

                child.skeleton.bones.forEach(function(item){
                    switch (item.name) {
                        case "Stomach":
                            item.rotation.z = guiControls.Stomach;
                            break;
                        case "Chest":
                            item.rotation.z = guiControls.Chest;
                            break;
                        case "Head":
                            item.rotation.z = guiControls.Head;
                            break;
                        case "UpperArm.L":
                            item.rotation.z = guiControls.UpperArm_L;
                            break;
                        case "LowerArm.L":
                            item.rotation.z = guiControls.LowerArm_L;
                            break;
                        case "Hand.L":
                            item.rotation.z = guiControls.Hand_L;
                            break;
                        case "UpperArm.R":
                            item.rotation.y = guiControls.UpperArm_R;
                            break;
                        case "LowerArm.R":
                            item.rotation.y = guiControls.LowerArm_R;
                            break;
                        case "Hand.R":
                            item.rotation.y = guiControls.Hand_R;
                            break;
                        default:
                            break;
                    }
                });

                /*child.skeleton.bones[0].rotation.z = guiControls.Bone_0;
                child.skeleton.bones[1].rotation.z = guiControls.Bone_1;
                child.skeleton.bones[2].rotation.z = guiControls.Bone_2;
                child.skeleton.bones[3].rotation.z = guiControls.Bone_3;
                //Added for Arpit's model
                child.skeleton.bones[4].rotation.z = guiControls.Bone_4;
                child.skeleton.bones[5].rotation.z = guiControls.Bone_5;
                child.skeleton.bones[6].rotation.z = guiControls.Bone_6;
                child.skeleton.bones[7].rotation.z = guiControls.Bone_7;
                child.skeleton.bones[8].rotation.z = guiControls.Bone_8;*/
            }
            else if  (child instanceof THREE.SkeletonHelper){
                child.update();
            }
        });
	}

	function animate(){
		requestAnimationFrame(animate);
		render();
		stats.update();
		renderer.render(scene, camera);
	}

    init();
    animate();

    $(window).resize(function(){
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;
        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    });

});
