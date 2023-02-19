import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
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

  container.style.touchAction = "none";
  // Instantiate a loader
  manager = new THREE.LoadingManager();
  loader = new GLTFLoader(manager);
  fontLoader = new FontLoader(manager);

  //Loaders
  // new RGBELoader(manager).load("bridge.hdr", async (texture) => {
  //   texture.mapping = THREE.EquirectangularReflectionMapping;

  //   // scene.background = texture;
  //   scene.environment = texture;
  // });

  new EXRLoader().load("outdoors.exr", function (texture, textureData) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
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
    camera.lookAt(0.25, 0, 0);
    //Controls
    // controls = controlsUtils;

    //GROUND
    ground = groundUtil;

    scene.add(ground);

    //Lights
    lights.push(
      createLight([0, 20, 0], 1, "directional", false, brockton),
      createLight([20, 0, 0], 1, "directional", false, brockton),
      createLight([0, 0, 20], 1, "directional", false, brockton)
      // createLight([0, 10, 0], 50000, "ambient", true)
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

    // EVENTS
    document.querySelectorAll(".background .btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        switch (e.target.classList[0]) {
          case "green":
            console.log(ground);
            ground.material.color = new THREE.Color(0x16a085);
            break;
          case "red":
            console.log(ground);
            ground.material.color = new THREE.Color(0xc0392b);
            break;
          case "black":
            console.log(ground);
            ground.material.color = new THREE.Color(0x2c3e50);
            break;
          case "blue":
            console.log(ground);
            ground.material.color = new THREE.Color(0x2980b9);
            break;
          case "green":
            console.log(ground);
            ground.material.color = new THREE.Color(0x16a085);
            break;
          default:
            break;
        }
      });
    });
    const brocktonColor = brockton.children[0].material.color;
    document.querySelectorAll(".brockton-btn-container .btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        switch (e.target.classList[0]) {
          case "brass":
            changeColor(brockton, brocktonColor);
            break;
          case "silver":
            changeColor(brockton, 0xc0c0c0);
            break;
          default:
            break;
        }
      });
    });
    function changeColor(object, color) {
      const children = object.children;
      for (const key in children) {
        if (Object.hasOwnProperty.call(children, key)) {
          const element = children[key];
          element.material.color = new THREE.Color(color);
        }
      }
    }

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
      if (!isMoving) {
        if (mixer) mixer.update(delta);
      }

      renderer.render(scene, camera);
    };
    /* */

    function onPointerDown(event) {
      console.log(event);
      if (!event.target.classList.contains("container")) return;
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
