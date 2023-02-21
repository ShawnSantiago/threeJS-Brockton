import { Color, Mesh, MeshStandardMaterial } from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

const createFont = ({
  text,
  font,
  texProp = { size: 0.09, height: 0.025, curveSegments: 6 },
  position = [0, 0.1, 0],
  material,
}) => {
  let textMaterial;
  const textGeo = new TextGeometry(text, {
    ...texProp,
    font: font,
  });

  const color = new Color();
  color.setRGB(0, 0, 0);

  textMaterial = new MeshStandardMaterial({ color: 0x000000 });
  if (material) {
    textMaterial = material;
  }

  let textObj = new Mesh(textGeo, textMaterial);
  textObj.name = "text";
  textObj.position.set(...position);
  textObj.castShadow = true;

  return textObj;
};

export default createFont;
