import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

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
    manager,
    isMoving,
    scene = new THREE.Scene(),
    clock = new THREE.Clock(),
    brockton,
    container = document.getElementById("bg");

  // Instantiate a loader
  manager = new THREE.LoadingManager();
  loader = new GLTFLoader(manager);
  fontLoader = new FontLoader(manager);

  //Loaders
  new RGBELoader(manager).load("bridge.hdr", async (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;

    // scene.background = texture;
    scene.environment = texture;
  });

  // fontLoader.load(
  //   "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json",
  //   (tex) => scene.add(createFont(tex))
  // );

  loader.load(
    // resource URL
    "./BrocktonMK2.gltf",
    // called when the resource is loaded
    function (gltf) {
      scene.add(gltf.scene);
      scene.traverse(async (object) => {
        let mesh = object;
        if (mesh.name === "Brockton") {
          brockton = mesh;
        }
        if (mesh.isMesh) {
          if (mesh.parent && object.parent.name === "Brockton") {
          }
        }
      });
      mixer = handleAnimations(gltf);
    }
  );

  manager.onLoad = function () {
    console.log("Loading complete!");

    //Scene
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

    //Brockton
    brockton.position.set(0, -0.1, 0);
    brockton.rotation.z = -1;

    //Brockton Rotation
    let targetRotationY = 1;
    let targetRotationYOnPointerDown = 0;

    let targetRotationX = 1;
    let targetRotationXOnPointerDown = 0;

    let pointerX = 0;
    let pointerXOnPointerDown = 0;

    let pointerY = 0;
    let pointerYOnPointerDown = 0;

    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    //Renderer
    renderer = rendererUtils;

    //Camera
    camera = cameraUtils;

    //Controls
    // controls = controlsUtils;

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
    cube.position.set(0, 0, 0);
    // scene.add(cube);

    // camera.lookAt(brockton);
    camera.lookAt(0, 0, 0);
    console.log(camera);
    // EVENTS

    container.style.touchAction = "none";

    // document.addEventListener("mousedown", mousedown);
    // document.addEventListener("mousemove", mousemove);
    // document.addEventListener("mouseup", mouseup);

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener(
      "resize",
      () => ([camera, renderer] = onWindowResize(window, camera, renderer)),
      false
    );

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (brockton) {
        brockton.rotation.y += (targetRotationX - brockton.rotation.y) * 0.05;
        brockton.rotation.x += (targetRotationY - brockton.rotation.x) * 0.05;
      }
      //
      //   if (mixer) mixer.update(delta);
      // }

      renderer.render(scene, camera);
    };
    /* */

    function onPointerDown(event) {
      if (event.isPrimary === false) return;
      isMoving = true;

      pointerXOnPointerDown = event.clientX - windowHalfX;
      pointerYOnPointerDown = event.clientY - windowHalfY;

      targetRotationYOnPointerDown = targetRotationY;
      targetRotationXOnPointerDown = targetRotationX;

      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    }

    function onPointerMove(event) {
      if (event.isPrimary === false) return;
      pointerX = event.clientX - windowHalfX;
      pointerY = event.clientY - windowHalfY;

      targetRotationX =
        targetRotationXOnPointerDown +
        (pointerX - pointerXOnPointerDown) * 0.02;

      targetRotationY =
        targetRotationYOnPointerDown +
        (pointerY - pointerYOnPointerDown) * 0.02;
    }

    function onPointerUp() {
      if (event.isPrimary === false) return;
      isMoving = false;

      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    }
    animate();
  };
};
