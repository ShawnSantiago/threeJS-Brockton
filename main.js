import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { MaterialXLoader } from "three/examples/jsm/loaders/MaterialXLoader";
import { nodeFrame } from "three/examples/jsm/renderers/webgl/nodes/WebGLNodes.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import * as Node from "three/examples/jsm/nodes/Nodes";
// Instantiate a loader
const loader = new GLTFLoader();

// // Optional: Provide a DRACOLoader instance to decode compressed mesh data
// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
// loader.setDRACOLoader( dracoLoader );

// Load a glTF resource
const SAMPLE_PATH =
  "https://raw.githubusercontent.com/materialx/MaterialX/main/resources/Materials/Examples/StandardSurface/";
let camera,
  controls,
  scene,
  renderer,
  clock,
  mixer,
  lights = [],
  ground;
const uniforms = THREE.UniformsUtils.clone(THREE.ShaderLib.standard.uniforms);
//const frame = new Node.NodeFrame();
init();
animate();
async function getMaterialX() {
  return await new MaterialXLoader()
    .setPath(SAMPLE_PATH)
    .loadAsync("standard_surface_gold.mtlx")
    .then(({ materials }) => Object.values(materials).pop());
}

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  clock = new THREE.Clock();

  scene.background = new THREE.Color(0xa0a0a0);
  scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector("#bg"),
  });
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.shadowMap.enabled = true;
  renderer.physicallyCorrectLights = true;
  renderer.toneMapping = THREE.LinearToneMapping;
  renderer.toneMappingExposure = 0.5;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.position.set(250, 250, 200);

  new RGBELoader().load("san_giuseppe_bridge_2k.hdr", async (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;

    scene.background = texture;
    scene.environment = texture;
  });

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

  controls.minDistance = 155;
  controls.maxDistance = 555;

  controls.maxPolarAngle = Math.PI / 2;

  // GROUND
  console.log(scene.background);
  ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
  );
  ground.name = "ground";
  ground.position.y = -0.5;
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;

  // scene.add(ground);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);
  // scene.add(hemiLight);

  function createDirectionalLight(position, intensity) {
    const directionalLight = new THREE.DirectionalLight(0xffffff, intensity);
    directionalLight.position.set(...position);
    directionalLight.castShadow = true;
    // directionalLight.shadow.camera.top = 200;
    // directionalLight.shadow.camera.bottom = -200;
    // directionalLight.shadow.camera.right = 200;
    // directionalLight.shadow.camera.left = -200;
    directionalLight.shadow.mapSize.set(4096, 4096);
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight
    );
    return [directionalLight, directionalLightHelper];
  }
  lights.push(
    createDirectionalLight([0, 10, 0], 100),
    createDirectionalLight([10, 0, 0], 100),
    createDirectionalLight([0, 0, 10], 100)
  );

  // scene.add(...lights.flat());

  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  material.color = new THREE.Color(0xfedd82);
  material.metalness = 1;
  material.roughness = 0;

  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(2, 1, 1);
  //scene.add(cube);

  loader.load(
    // resource URL
    "./BrocktonMK2.gltf",
    // called when the resource is loaded
    function (gltf) {
      scene.add(gltf.scene);
      scene.traverse(async function (object) {
        if (object.isMesh) {
          object.castShadow = true;
          //object.receiveShadow = true;
        }
        if (object.name === "Brockton") {
          object.scale.set(2, 2, 2);
        }

        if (object.parent && object.parent.name === "Brockton") {
          // const material = new Nodes.MeshBasicNodeMaterial({ uniforms });
          const mat = await getMaterialX();
          // material.clonm;
          // mat.uniforms = uniforms;
          // object.castShadow = true;

          object.material = mat;
          console.log(mat);
        }
      });
      let sceneChildren = scene.children;
      // for (const key in sceneChildren) {
      //   const sceneChild = sceneChildren[key];

      //   if (sceneChild.name === "Dark_studio_setup") {
      //     const studioChildren = sceneChild.children;
      //     for (const key in studioChildren) {
      //       if (Object.hasOwnProperty.call(studioChildren, key)) {
      //         const studioChild = studioChildren[key];

      //         if (studioChild.name === "Brockton") {
      //           console.log(studioChild);
      //           //camera.lookAt(sceneChild);
      //           studioChild.castShadow = true;
      //           studioChild.receiveShadow = true;
      //         }
      //       }
      //     }
      //   }
      // }

      mixer = new THREE.AnimationMixer(gltf.scene);

      // camera.copy(gltf.cameras[0]);
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
      console.log(scene);
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
  ground.material.color = new THREE.Color(scene.background);
  if (mixer) mixer.update(delta);
  nodeFrame.update();
  // if (scene.children.length > 0) {
  //   let sceneChildren = scene.children[0].children;

  //   for (const key in sceneChildren) {
  //     if (Object.hasOwnProperty.call(sceneChildren, key)) {
  //       const sceneChild = sceneChildren[key];

  //       if (sceneChild.name === "Brockton") {
  //         const sceneChildChildren = sceneChild.children;
  //         const material = sceneChildChildren[0].material;
  //         material.emissive = new THREE.Color(scene.background);
  //         material.emissiveIntensity = 0.3;
  //         for (const key in sceneChildChildren) {
  //           const child = sceneChildChildren[key];
  //           if (Object.hasOwnProperty.call(sceneChildChildren, key)) {
  //             child.material = material;
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  renderer.render(scene, camera);
}
