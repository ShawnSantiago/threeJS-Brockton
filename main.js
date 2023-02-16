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

// NOTE: Helper function
function INT2RGB(int) {
  return [(int & 0xff0000) >>> 16, (int & 0xff00) >>> 8, int & 0xff];
}

// NOTE: Helper function
function RGB2INT(rgb) {
  return (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];
}

function transitionColor(percent, startColor, endColor) {
  if (percent < 0) {
    return startColor;
  } else if (percent > 100) {
    return endColor;
  }
  var pos = percent / 100;
  var rgb1 = INT2RGB(startColor);
  var rgb2 = INT2RGB(endColor);
  var r = Math.trunc((1 - pos) * rgb1[0] + pos * rgb2[0] + 0.5);
  var g = Math.trunc((1 - pos) * rgb1[1] + pos * rgb2[1] + 0.5);
  var b = Math.trunc((1 - pos) * rgb1[2] + pos * rgb2[2] + 0.5);
  return RGB2INT([r, g, b]);
}

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
    "./BrocktonMK2.gltf",
    // called when the resource is loaded
    function (gltf) {
      const root = gltf.scene;
      scene.add(gltf.scene);

      console.log(scene);
      let sceneChildren = scene.children[0].children;
      for (const key in sceneChildren) {
        if (Object.hasOwnProperty.call(sceneChildren, key)) {
          const sceneChild = sceneChildren[key];
          console.log(sceneChild);
          if (sceneChild.name === "Brockton_MK2_v4") {
            function findEnd()
            // const sceneChildChildren = sceneChild.children;
            // for (const key in sceneChildChildren) {
            //   const child = sceneChildChildren[key];

            //   if (Object.hasOwnProperty.call(sceneChildChildren, key)) {
            //     console.log(child);
            //     //sceneChild.material.color = new THREE.Color(0xffdd82);
            //   }
            // }

            // console.log(Brockton);
          }
          if (sceneChild.type === "DirectionalLight") {
            sceneChild.intensity = 2000;
            // console.log(element);
            // element.target = Brockton;
          }
          if (sceneChild.type === "PointLight") {
            sceneChild.intensity = 200;
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
