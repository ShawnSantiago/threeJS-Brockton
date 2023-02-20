import {
  Mesh,
  PlaneGeometry,
  MeshLambertMaterial,
  MeshStandardMaterial,
} from "three";

const material = new MeshLambertMaterial({
  color: 0xffffff,
  depthWrite: false,
});
material.roughness = 1;
material.spec;

const groundUtil = new Mesh(new PlaneGeometry(10, 10), material);
groundUtil.name = "ground";
groundUtil.position.y = -0.1;
// groundUtil.rotation.x = -Math.PI / 2;
groundUtil.receiveShadow = false;

export default groundUtil;
