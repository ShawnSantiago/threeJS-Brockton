import { MaterialXLoader } from "three/examples/jsm/loaders/MaterialXLoader";
import { AnimationMixer } from "three";

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

export const handleGLTF = async (object) => {
  let mesh = object;
  if (mesh.isMesh) {
    if (mesh.name === "Brockton") {
      //object.scale.set(2, 2, 2);
    }
    if (mesh.parent && object.parent.name === "Brockton") {
      const mat = await getMaterialX();
      object.material = mat;
    }
  }
  return mesh;
};
export const handleAnimations = (gltf) => {
  const mixer = new AnimationMixer(gltf.scene);

  gltf.animations.forEach((clip) => {
    mixer.clipAction(clip).play();
  });
  return mixer;
};
