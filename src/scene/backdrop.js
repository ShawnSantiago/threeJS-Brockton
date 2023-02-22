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

const backdropUtil = new Mesh(new PlaneGeometry(10, 10), material);
backdropUtil.name = "backdrop";
backdropUtil.position.y = -0.1;
// backdropUtil.rotation.x = -Math.PI / 2;
backdropUtil.receiveShadow = false;

export default backdropUtil;
