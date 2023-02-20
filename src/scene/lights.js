import {
  HemisphereLight,
  HemisphereLightHelper,
  DirectionalLight,
  DirectionalLightHelper,
  AmbientLight,
} from "three";

const createLight = (
  position,
  intensity = 1,
  type,
  helper = false,
  targetObject
) => {
  const lightArr = [];

  const directionalLight = new DirectionalLight(0xffffff, intensity);
  directionalLight.position.set(...position);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.near = 0;
  directionalLight.shadow.mapSize.set(4096, 4096);
  if (targetObject) directionalLight.target = targetObject;

  const directionalLightHelper = new DirectionalLightHelper(
    directionalLight,
    5,
    "#000000"
  );

  const hemiLight = new HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(...position);

  const hemiLightHelper = new HemisphereLightHelper(hemiLight, 5, "#000000");

  const AmbiLight = new AmbientLight(0xffffff, intensity);
  AmbiLight.position.set(...position);

  if (type === "directional") {
    lightArr.push(directionalLight);
    if (helper) {
      lightArr.push(directionalLightHelper);
    }
  }
  if (type === "hemi") {
    lightArr.push(hemiLight);
    if (helper) {
      lightArr.push(hemiLightHelper);
    }
  }

  if (type === "ambient") {
    lightArr.push(AmbiLight);
  }

  return lightArr;
};

export default createLight;
