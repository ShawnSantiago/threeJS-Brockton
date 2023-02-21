import { create } from "xoid";

const state = {
  isMoving: create(false),
  brockton: create({}),
  brocktonCurrentRotX: create(0),
  brocktonCurrentRotY: create(0),
  brocktonCurrentRotZ: create(0),
  targetRotationY: create(1),
  targetRotationX: create(1),
  targetRotationYOnPointerDown: create(0),
  targetRotationXOnPointerDown: create(0),
  pointerX: create(0),
  pointerXOnPointerDown: create(0),
  pointerY: create(0),
  pointerYOnPointerDown: create(0),
};

export { state };
