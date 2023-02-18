import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { nodeFrame } from "three/examples/jsm/renderers/webgl/nodes/WebGLNodes.js";

import {
  rendererUtils,
  cameraUtils,
  controlsUtils,
  groundUtil,
  createLight,
  createFont,
  handleGLTF,
  handleAnimations,
} from "./scene";

import { onWindowResize } from "./utils";

export const init = () => {
  let camera,
    controls,
    renderer,
    mixer,
    lights = [],
    ground,
    loader,
    fontLoader,
    scene = new THREE.Scene(),
    clock = new THREE.Clock();

  // Instantiate a loader
  loader = new GLTFLoader();
  fontLoader = new FontLoader();

  //Scene
  scene.background = new THREE.Color(0xffffff);
  scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

  //Renderer
  renderer = rendererUtils;

  //Camera
  camera = cameraUtils;

  //Controls
  controls = controlsUtils;

  //GROUND
  ground = groundUtil;

  scene.add(ground);

  //Lights
  lights.push(
    createLight([0, 10, 0], 5, "directional"),
    createLight([10, 0, 0], 5, "directional"),
    createLight([0, 0, 10], 5, "directional")
  );

  scene.add(...lights.flat());

  //Other Objects
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  material.color = new THREE.Color(0xfedd82);
  material.metalness = 1;
  material.roughness = 0;

  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(2, 1, 1);
  //scene.add(cube);

  //Loaders
  new RGBELoader().load("bridge.hdr", async (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;

    // scene.background = texture;
    scene.environment = texture;
  });

  fontLoader.load(
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json",
    (tex) => scene.add(createFont(tex))
  );

  loader.load(
    // resource URL
    "./BrocktonMK2.gltf",
    // called when the resource is loaded
    function (gltf) {
      scene.add(gltf.scene);
      scene.traverse(async (object) => {
        object = handleGLTF(object);
      });
      mixer = handleAnimations(gltf);
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

  window.addEventListener(
    "resize",
    () => ([camera, renderer] = onWindowResize(window, camera, renderer)),
    false
  );

  const animate = () => {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    if (mixer) mixer.update(delta);
    nodeFrame.update();

    renderer.render(scene, camera);
  };

  animate();
};
