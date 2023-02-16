import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// Instantiate a loader
const loader = new GLTFLoader();

// // Optional: Provide a DRACOLoader instance to decode compressed mesh data
// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
// loader.setDRACOLoader( dracoLoader );

// Load a glTF resource

let camera, controls, scene, renderer, clock, mixer;

init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera();
  clock = new THREE.Clock();

  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector("#bg"),
  });
  renderer.physicallyCorrectLights = true;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // controls

  controls = new OrbitControls(camera, renderer.domElement);
  controls.listenToKeyEvents(window); // optional
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;

  var centerPosition = controls.target.clone();
  centerPosition.y = 0;
  var groundPosition = camera.position.clone();
  groundPosition.y = 0;
  var d = centerPosition.distanceTo(groundPosition);

  var origin = new THREE.Vector2(controls.target.y, 0);
  var remote = new THREE.Vector2(0, d); // replace 0 with raycasted ground altitude
  var angleRadians = Math.atan2(remote.y - origin.y, remote.x - origin.x);
  controls.maxPolarAngle = angleRadians;

  controls.minDistance = 1;
  controls.maxDistance = 15;

  controls.maxPolarAngle = Math.PI / 2;

  loader.load(
    // resource URL
    "./Brockton1.gltf",
    // called when the resource is loaded
    function (gltf) {
      const root = gltf.scene;
      scene.add(gltf.scene);

      console.log(scene);
      let sceneChildren = scene.children[0].children;
      for (const key in sceneChildren) {
        if (Object.hasOwnProperty.call(sceneChildren, key)) {
          const element = sceneChildren[key];
          let Brockton;
          console.log(element);
          if (element.name === "Empty") {
            Brockton = element;
            // console.log(Brockton);
          }
          if (element.type === "SpotLight") {
            element.intensity = 10;
            // console.log(element);
            // element.target = Brockton;
          }
          if (element.type === "PointLight") {
            element.intensity = 10;
            // element.target = Brockton;
          }
        }
      }

      mixer = new THREE.AnimationMixer(gltf.scene);

      gltf.cameras[0].zoom = 2;
      camera.copy(gltf.cameras[0]);
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
    },
    // called while loading is progressing
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // called when loading has errors
    function (error) {
      console.log("An error happened");
    }
  );

  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  var delta = clock.getDelta();

  if (mixer) mixer.update(delta);

  renderer.render(scene, camera);
}
