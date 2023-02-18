import { MaterialXLoader } from "three/examples/jsm/loaders/MaterialXLoader";
export const getMaterialX = async () => {
  return await new MaterialXLoader()
    .loadAsync("brass.mtlx")
    .then(({ materials }) => Object.values(materials).pop());
};

export const onWindowResize = (window, camera, renderer) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  return [camera, renderer];
};
