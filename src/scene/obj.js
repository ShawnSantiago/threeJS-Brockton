import * as THREE from "three";
let objects = [];
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1.25, 1, 1.25),
  new THREE.MeshPhongMaterial({ color: 0xe1c16e })
);
cube.name = "cube";
cube.receiveShadow = true;
cube.position.set(0, -1.5, 0);
cube.rotation.set(0, 0, 0);
objects.push(cube);

export default objects;
