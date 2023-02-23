import { create } from "xoid";

const state = {
  isMoving: create(false),
  brockton: create({}),
  brocktonStartingPos: create(),
  brocktonStartingRot: create(),
  brocktonCurrentRotX: create(0),
  brocktonCurrentRotY: create(0),
  brocktonCurrentRotZ: create(0),
  targetRotationY: create(1),
  targetRotationX: create(1),
  pointerX: create(0),
  pointerXOnPointerDown: create(0),
  pointerY: create(0),
  pointerYOnPointerDown: create(0),
  backdrop: create({}),
  brocktonColor: create(),
  assetsLoaded: create(false),
  loadedFont: create({}),
  scene: create({}),
  hasDimensions: create(false),
};

export { state };
