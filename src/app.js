import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

import {
  rendererUtils,
  cameraUtils,
  controlsUtils,
  backdropUtil,
  createLight,
  createFont,
  objects,
  animations,
} from "./scene";

import utils from "./utils";

import { state } from "./state";

let container = document.getElementById("bg"),
  progressBar = document.querySelector(".progress"),
  camera,
  controls,
  renderer,
  mixer,
  backdrop,
  lights = [],
  clock = new THREE.Clock(),
  scene,
  manager = new THREE.LoadingManager();

container.style.touchAction = "none";

export const init = () => {
  // Instantiate a loader
  state.scene.set(new THREE.Scene());
  scene = state.scene.value;

  //Loaders

  new FontLoader(manager).load(
    // resource URL
    "AL_LePORSCHE.json",

    // onLoad callback
    function (font) {
      // do something with the font
      state.loadedFont.set(font);
    }
  );

  new EXRLoader(manager).load("outdoors.exr", function (texture, textureData) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
  });

  new GLTFLoader(manager).load(
    // resource URL
    "./BrocktonMK2.gltf",
    // called when the resource is loaded
    function (gltf) {
      scene.add(gltf.scene);
      scene.traverse(async (object) => {
        let mesh = object,
          brockton;
        if (mesh.name === "Brockton") {
          mesh.position.set(0, -0.1, 0);
          mesh.rotation.z = -1;
          mesh.castShadow = true;
          mesh.recieveShadow = false;
          brockton = mesh;
          state.brockton.set(brockton);
          state.brocktonStartingPos.set(
            new THREE.Vector3().setFromMatrixPosition(brockton.matrixWorld)
          );
          state.brocktonStartingRot.set(brockton.rotation);
          state.brocktonColor.set(brockton.children[0].material.color);
        }
        if (mesh.isMesh) {
          if (mesh.parent && object.parent.name === "Brockton") {
            mesh.castShadow = true;
            mesh.recieveShadow = false;
          }
        }
      });
      mixer = utils.handleAnimations(gltf);
    }
  );
  manager.onProgress = function (item, loaded, total) {
    const percentage = (loaded / total) * 100;
    progressBar.style.width = percentage + "%";
    if (percentage === 100) {
      state.assetsLoaded.set(true);
    }
  };
  manager.onLoad = function () {
    console.log("Loading complete!");
    //Animations
    animations();

    //Brocton
    let brockton = state.brockton;

    //Scene
    scene.background = new THREE.Color(0xf9f9f9);
    scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

    //Renderer
    renderer = rendererUtils;

    //Camera
    camera = cameraUtils;
    console.log(camera);
    camera.lookAt(0.25, 0, 0);

    //Controls
    // controls = controlsUtils;

    //backdrop
    backdrop = backdropUtil;
    state.backdrop.set(backdrop);

    scene.add(backdrop);

    //Lights
    lights.push(
      createLight([0, 20, 0], 1, "directional", false),
      createLight([20, 0, 0], 1, "directional", false),
      createLight([0, 0, 20], 1, "directional", false)
      // createLight([0, 10, 0], 5, "ambient", true)
    );

    // const helper = new THREE.CameraHelper(lights[0][0].shadow.camera);
    // scene.add(helper);

    scene.add(...lights.flat());

    //Other Objects

    scene.add(...objects);

    // EVENTS
    document
      .querySelectorAll(".control-panel .btn")
      .forEach((btn) => btn.addEventListener("click", utils.handleButtons));

    document
      .querySelectorAll(".play-controls .btn")
      .forEach((btn) => btn.addEventListener("click", utils.playButtons));

    document.addEventListener("mousewheel", (event) =>
      utils.handleMouseWheelDown(event, camera)
    );
    document.addEventListener("pointerdown", utils.onPointerDown);
    window.addEventListener(
      "resize",
      () =>
        ([camera, renderer] = utils.onWindowResize(window, camera, renderer)),
      false
    );

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (!state.isMoving.value) {
        if (mixer) mixer.update(delta);
      }
      if (brockton.value) {
        brockton.value.rotation.y +=
          (state.targetRotationX.value - brockton.value.rotation.y) * 0.05;
        brockton.value.rotation.x +=
          (state.targetRotationY.value - brockton.value.rotation.x) * 0.05;
      }

      renderer.render(scene, camera);
    };
    /* */

    animate();
  };
};
