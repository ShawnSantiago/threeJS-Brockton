import {
  HemisphereLight,
  HemisphereLightHelper,
  DirectionalLight,
  DirectionalLightHelper,
} from "three";

const createLight = (position, intensity, type, helper = false) => {
  const lightArr = [];

  const directionalLight = new DirectionalLight(0xffffff, intensity);
  directionalLight.position.set(...position);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(4096, 4096);
  directionalLight.shadow.blurSamples = 25;

  const directionalLightHelper = new DirectionalLightHelper(directionalLight);

  const hemiLight = new HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);

  const hemiLightLightHelper = new HemisphereLightHelper(hemiLight);

  if (type === "directional") {
    lightArr.push(directionalLight);
    if (helper) {
      lightArr.push(directionalLightHelper);
    }
  }
  if (type === "hemi") {
    lightArr.push(hemiLight);
    if (helper) {
      lightArr.push(hemiLightLightHelper);
    }
  }

  return lightArr;
};

export default createLight;
