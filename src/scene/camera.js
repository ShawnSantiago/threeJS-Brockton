import { PerspectiveCamera } from "three";

const cameraUtils = new PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  1000
);

cameraUtils.position.set(0, 0, 2);

export default cameraUtils;
