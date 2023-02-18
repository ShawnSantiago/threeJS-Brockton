import { AnimationMixer } from "three";
import { getMaterialX } from "../utils";
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
