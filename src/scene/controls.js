import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Vector2 } from "three";
import rendererUtils from "./renderer";
import cameraUtils from "./camera";

const controlsUtils = new OrbitControls(cameraUtils, rendererUtils.domElement);
controlsUtils.listenToKeyEvents(window); // optional
controlsUtils.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controlsUtils.dampingFactor = 0.05;
controlsUtils.screenSpacePanning = false;

var centerPosition = controlsUtils.target.clone();
centerPosition.y = 0;
var groundPosition = cameraUtils.position.clone();
groundPosition.y = 0;
var d = centerPosition.distanceTo(groundPosition);

var origin = new Vector2(controlsUtils.target.y, 0);
var remote = new Vector2(0, d); // replace 0 with raycasted ground altitude
var angleRadians = Math.atan2(remote.y - origin.y, remote.x - origin.x);
controlsUtils.maxPolarAngle = angleRadians;

controlsUtils.minDistance = 1;
controlsUtils.maxDistance = 25;

controlsUtils.maxPolarAngle = Math.PI / 2;

export default controlsUtils;
