import { Mesh, PlaneGeometry, MeshStandardMaterial } from "three";

const groundUtil = new Mesh(
  new PlaneGeometry(10, 10),
  new MeshStandardMaterial({ color: 0xffffff, depthWrite: false })
);
groundUtil.name = "ground";
groundUtil.position.y = -0.1;
// groundUtil.rotation.x = -Math.PI / 2;
groundUtil.receiveShadow = true;

export default groundUtil;
