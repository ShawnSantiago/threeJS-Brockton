import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Vector2 } from "three";

const controlsUtils = (camera, renderer) => {
  const control = new OrbitControls(camera, renderer.domElement);
  control.listenToKeyEvents(window); // optional
  control.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  control.dampingFactor = 0.05;
  control.screenSpacePanning = false;

  var centerPosition = control.target.clone();
  centerPosition.y = 0;
  var groundPosition = camera.position.clone();
  groundPosition.y = 0;
  var d = centerPosition.distanceTo(groundPosition);

  var origin = new Vector2(control.target.y, 0);
  var remote = new Vector2(0, d); // replace 0 with raycasted backdrop altitude
  var angleRadians = Math.atan2(remote.y - origin.y, remote.x - origin.x);
  control.maxPolarAngle = angleRadians;

  control.minDistance = 1;
  control.maxDistance = 25;

  control.maxPolarAngle = Math.PI / 2;
};

export default controlsUtils;
