import gsap from "gsap";
import { state } from "../state";
import objects from "../scene/obj";

let progressBarContainer = document.querySelector(".progress-bar"),
  tl = gsap.timeline(),
  cube = objects.filter((obj) => {
    return obj.name === "cube";
  })[0];

const animations = () => {
  if (state.assetsLoaded.value === true) {
    tl.to(progressBarContainer, {
      opacity: 0,
      display: "none",
      duration: 1,
    });
    tl.to("#bg,.container", { opacity: 1, duration: 1 });

    tl.add("start", ">-1");
    tl.from(state.brockton.value.position, { duration: 2, y: 0.5 }, "start");

    tl.to(cube.position, { duration: 2, y: -0.9 }, "start");
    tl.to(cube.rotation, { duration: 2, y: -0.75 }, "start");
    tl.to(".sector", { opacity: 1, duration: 1 });
  }
};

export default animations;
