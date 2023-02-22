import { Color } from "three";
import { state } from "../state";
import gsap from "gsap";

let windowHalfX = window.innerWidth / 2,
  windowHalfY = window.innerHeight / 2;

export function onPointerDown(event) {
  if (
    event.target.classList.contains("control-panel") ||
    event.target.closest(".control-panel")
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
  state.isMoving.set(false);
  document.removeEventListener("pointermove", onPointerMove);
  document.removeEventListener("pointerup", onPointerUp);
}
export function handleButtons(e) {
  if (e.target.closest(".background-btn-container")) {
    const c = {
      white: new Color(0xf9f9f9),
      green: new Color(0x16a085),
      red: new Color(0xc0392b),
      black: new Color(0x0d0d0d),
      blue: new Color(0x2980b9),
    };
    const color = e.target.classList[0];

    if (color !== "party") {
      gsap.to(state.backdrop.value.material.color, {
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
  if (e.target.closest(".brockton-color-container")) {
    switch (e.target.classList[0]) {
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

  if (e.target.closest(".brockton-parts-container")) {
    const className = e.target.classList[0];
    focusOnPart(className, state.brockton.value);
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
