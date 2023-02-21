import * as THREE from "three";

import gsap from "gsap";

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
    manager,
    fontLoaded,
    isMoving,
    scene = new THREE.Scene(),
    clock = new THREE.Clock(),
    brockton,
    brocktonCurrentRotX,
    brocktonCurrentRotY,
    brocktonCurrentRotZ,
    container = document.getElementById("bg"),
    progressBarContainer = document.querySelector(".progress-bar"),
    progressBar = document.querySelector(".progress"),
    tl = gsap.timeline();

  container.style.touchAction = "none";
  // Instantiate a loader
  manager = new THREE.LoadingManager();

  //Loaders
  // new RGBELoader(manager).load("bridge.hdr", async (texture) => {
  //   texture.mapping = THREE.EquirectangularReflectionMapping;
  //   // scene.background = texture;
  //   scene.environment = texture;
  // });

  new FontLoader(manager).load(
    // resource URL
    "AL_LePORSCHE.json",

    // onLoad callback
    function (font) {
      // do something with the font
      fontLoaded = font;
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
        let mesh = object;
        if (mesh.name === "Brockton") {
          brockton = mesh;
          mesh.castShadow = true;
          mesh.recieveShadow = false;
        }
        if (mesh.isMesh) {
          if (mesh.parent && object.parent.name === "Brockton") {
            mesh.castShadow = true;
            mesh.recieveShadow = false;
          }
        }
      });
      mixer = handleAnimations(gltf);
    }
  );
  manager.onProgress = function (item, loaded, total) {
    const percentage = (loaded / total) * 100;
    progressBar.style.width = percentage + "%";
    if (percentage === 100) {
      tl.to(progressBarContainer, {
        opacity: 0,
        display: "none",
        duration: 1,
      });
      tl.to("#bg,.container", { opacity: 1, duration: 1 });
    }
  };
  manager.onLoad = function () {
    console.log("Loading complete!");

    //Scene
    scene.background = new THREE.Color(0xf9f9f9);
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
      // createLight([0, 10, 0], 5, "ambient", true)
    );
    // console.log(lights[0][0]);
    // const helper = new THREE.CameraHelper(lights[0][0].shadow.camera);
    // scene.add(helper);

    scene.add(...lights.flat());

    //Other Objects

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1.25, 1, 1.25),
      new THREE.MeshPhongMaterial({ color: 0xe1c16e })
    );
    cube.receiveShadow = true;
    cube.position.set(0, -1.5, 0);
    cube.rotation.set(0, 0, 0);
    scene.add(cube);
    tl.add("start", ">-1");
    tl.from(brockton.position, { duration: 2, y: 0.5 }, "start");

    tl.to(cube.position, { duration: 2, y: -0.9 }, "start");
    tl.to(cube.rotation, { duration: 2, y: -0.75 }, "start");

    // EVENTS
    document.querySelectorAll(".background .btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const c = {
          white: new THREE.Color(0xf9f9f9),
          green: new THREE.Color(0x16a085),
          red: new THREE.Color(0xc0392b),
          black: new THREE.Color(0x0d0d0d),
          blue: new THREE.Color(0x2980b9),
        };
        const color = e.target.classList[0];

        if (color !== "party") {
          gsap.to(ground.material.color, {
            duration: 1,
            r: c[color].r,
            g: c[color].g,
            b: c[color].b,
          });
          if (color === "black") {
            gsap.to("h2,h3,button,p", { duration: 0.5, color: "#ffffff" });
          } else {
            gsap.to("h2,h3,button,p", { duration: 0.5, color: "#000000" });
          }
        } else {
          const tl = gsap.timeline({ repeat: 2 });
          for (const key in c) {
            if (Object.hasOwnProperty.call(c, key)) {
              const color = c[key];
              tl.to(ground.material.color, {
                duration: 0.5,
                r: color.r,
                g: color.g,
                b: color.b,
              });
            }
          }
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
    document.querySelectorAll(".brockton-parts-container .btn").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        const className = e.target.classList[0];
        focusOnPart(className, brockton);
      })
    );
    function focusOnPart(className, brockton) {
      const name = className;
      const children = brockton.children;
      if (name === "reset") {
        for (const key in children) {
          if (Object.hasOwnProperty.call(children, key)) {
            const child = children[key];
            child.visible = true;
            isMoving = false;
          }
        }
      } else {
        const part = brockton.children.filter((obj) => {
          return obj.name.toLowerCase() === name;
        })[0];
        brockton.position.set(0, -0.1, 0);
        gsap.to(brockton.rotation, 1, { z: -1 });
        isMoving = true;
        // gsap.to(part.position, 1, { y: 40 });
        for (const key in children) {
          if (Object.hasOwnProperty.call(children, key)) {
            const child = children[key];
            if (child.name.toLowerCase() !== part.name.toLowerCase()) {
              child.visible = false;
            } else {
              child.visible = true;
            }
          }
        }
      }
    }
    document.addEventListener("mousewheel", (event) => {
      var fovMAX = 3;
      var fovMIN = 1.5;
      if (camera.position.z > fovMIN && event.deltaY < 0) {
        camera.position.z += event.deltaY / 500;
      } else if (camera.position.z < fovMAX && event.deltaY > 0) {
        camera.position.z += event.deltaY / 500;
      }
    });
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
      if (
        event.target.classList.contains("controlPanel") ||
        event.target.closest(".controlPanel")
      )
        return;
      if (event.isPrimary === false) return;
      isMoving = true;

      brocktonCurrentRotX = brockton.rotation.x;
      brocktonCurrentRotY = brockton.rotation.y;
      brocktonCurrentRotZ = brockton.rotation.z;

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

      targetRotationX = (pointerX - pointerXOnPointerDown) * 0.02;

      targetRotationY = (pointerY - pointerYOnPointerDown) * 0.02;
    }

    function onPointerUp() {
      if (event.isPrimary === false) return;

      gsap.to(brockton.rotation, {
        duration: 0.5,
        x: brocktonCurrentRotX,
        y: brocktonCurrentRotY,
        z: brocktonCurrentRotZ,
        onComplete: () => {
          isMoving = false;
          document.removeEventListener("pointermove", onPointerMove);
          document.removeEventListener("pointerup", onPointerUp);
        },
      });
    }
    animate();
  };
};
