import {
  Color,
  LineBasicMaterial,
  Vector3,
  BufferGeometry,
  Line,
  Box3,
} from "three";
import { state } from "../state";
import gsap from "gsap";
import { createFont } from "../scene";

let windowHalfX = window.innerWidth / 2,
  windowHalfY = window.innerHeight / 2;

export function onPointerDown(event) {
  if (
    event.target.classList.contains("control-panel") ||
    event.target.closest(".control-panel") ||
    event.target.classList.contains("play-controls") ||
    event.target.closest(".play-controls")
  )
    return;
  if (event.isPrimary === false) return;

  state.isMoving.update(() => true);

  state.brocktonCurrentRotX.set(state.brockton.value.rotation.x);
  state.brocktonCurrentRotY.set(state.brockton.value.rotation.y);
  state.brocktonCurrentRotZ.set(state.brockton.value.rotation.x);

  state.pointerXOnPointerDown.set(event.clientX - windowHalfX);
  state.pointerYOnPointerDown.set(event.clientY - windowHalfY);

  document.addEventListener("pointermove", onPointerMove);
  document.addEventListener("pointerup", onPointerUp);
}

export function onPointerMove(event) {
  if (event.isPrimary === false) return;
  let pointerX = event.clientX - windowHalfX,
    pointerY = event.clientY - windowHalfY;

  state.targetRotationX.set(
    (pointerX - state.pointerXOnPointerDown.value) * 0.02
  );

  state.targetRotationY.set(
    (pointerY - state.pointerYOnPointerDown.value) * 0.02
  );
}

export function onPointerUp() {
  if (event.isPrimary === false) return;
  document.removeEventListener("pointermove", onPointerMove);
  document.removeEventListener("pointerup", onPointerUp);
}
export function handleButtons(e) {
  const el = e.target,
    className = el.classList[0];
  if (el.closest(".background-btn-container")) {
    const c = {
      white: new Color(0xf9f9f9),
      green: new Color(0x16a085),
      red: new Color(0xc0392b),
      black: new Color(0x0d0d0d),
      blue: new Color(0x2980b9),
    };

    if (className !== "party") {
      gsap.to(state.backdrop.value.material.color, {
        duration: 1,
        r: c[className].r,
        g: c[className].g,
        b: c[className].b,
      });
      if (className === "black") {
        gsap.to("h2,h3,button,p", { duration: 0.5, color: "#ffffff" });
      } else {
        gsap.to("h2,h3,button,p", { duration: 0.5, color: "#000000" });
      }
    } else {
      const tl = gsap.timeline({ repeat: 2 });
      for (const key in c) {
        if (Object.hasOwnProperty.call(c, key)) {
          const color = c[key];
          tl.to(state.backdrop.value.material.color, {
            duration: 0.5,
            r: color.r,
            g: color.g,
            b: color.b,
          });
        }
      }
    }
  }
  if (el.closest(".brockton-color-container")) {
    switch (className) {
      case "brass":
        changeColor(state.brockton.value, state.brocktonColor.value);
        break;
      case "silver":
        changeColor(state.brockton.value, 0xc0c0c0);
        break;
      default:
        break;
    }
  }

  if (el.closest(".brockton-parts-container")) {
    focusOnPart(className, state.brockton.value);
  }
  if (el.closest(".brockton-modes-container")) {
    if (className === "dimensions") {
      console.log("help");
      createDimensions();
    }
  }
}

export function handleMouseWheelDown(event, camera) {
  var fovMAX = 3;
  var fovMIN = -1.5;
  if (camera.position.z > fovMIN && event.deltaY < 0) {
    camera.position.z += event.deltaY / 500;
  } else if (camera.position.z < fovMAX && event.deltaY > 0) {
    camera.position.z += event.deltaY / 500;
  }
}

export function playButtons(e) {
  const el = e.target,
    { x, y, z } = state.brocktonStartingRot.value;
  console.log(el);
  if (el.classList.contains("play") || el.closest(".play")) {
    state.isMoving.set(false);
    return;
  }
  state.isMoving.set(true);
  console.log(x, y, z);
  gsap.to(state.brockton.value.rotation, 0.25, {
    x,
    y,
    z,
  });
  console.log(state.brockton.value.rotation);
}

function createDimensions() {
  if (state.hasDimensions.value) {
    return;
  }
  const dimensions = {
      length: '4.34"',
      height: '1.18"',
      weight: "6oz",
      diameter: '1.2"',
    },
    font = state.loadedFont.value,
    length = createFont({
      text: dimensions.length,
      font: font,
      position: [0, 0.25, 0],
    }),
    head = findPart("Head"),
    mouthPiece = findPart("Mouthpiece"),
    brocktonSize = new Box3().setFromObject(state.brockton.value),
    line = new Line(
      new BufferGeometry().setFromPoints([
        new Vector3().setFromMatrixPosition(head.matrixWorld),
        new Vector3().setFromMatrixPosition(mouthPiece.matrixWorld),
      ]),
      new LineBasicMaterial({ color: 0x000000 })
    ),
    { x, y, z } = state.brockton.value.rotation;
  console.log(mouthPiece);
  console.log(state.brockton.value);

  state.isMoving.set(true);
  line.position.y = 0.2;
  gsap.to(state.brockton.value.rotation, 0.25, {
    x: 0.9999999999999755,
    y: 1.000000000000014,
    z: -1,
  });
  length.attach(line);
  state.brockton.value.attach(length);
  state.hasDimensions.set(true);
}

function getPointInBetweenByLen(pointA, pointB) {
  console.log(pointB.clone().position.sub(pointA.position));
  var dir = pointB.clone().position.sub(pointA.position);
  var len = dir.length();
  var dir2 = pointB
    .clone()
    .position.sub(pointA.position)
    .normalize()
    .multiplyScalar(len);
  return pointA.clone().position.add(dir2);
}

function changeColor(object, color) {
  const children = object.children;
  for (const key in children) {
    if (Object.hasOwnProperty.call(children, key)) {
      const element = children[key];
      element.material.color = new Color(color);
    }
  }
}

function focusOnPart(className, brockton) {
  const name = className;
  const children = brockton.children;
  if (name === "reset") {
    for (const key in children) {
      if (Object.hasOwnProperty.call(children, key)) {
        const child = children[key];
        child.visible = true;
        state.isMoving.value = false;
      }
    }
  } else {
    const part = brockton.children.filter((obj) => {
      return obj.name.toLowerCase() === name;
    })[0];
    brockton.position.set(0, -0.1, 0);
    gsap.to(brockton.rotation, 1, { z: -1 });
    state.isMoving.value = true;
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

function findPart(name) {
  return state.brockton.value.children.filter((part) => part.name === name)[0];
}
