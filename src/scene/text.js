import { Color, Mesh, MeshStandardMaterial } from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

const createFont = (
  font,
  texProp = { size: 0.1, height: 0.01, curveSegments: 6 },
  material
) => {
  let textMaterial;
  const textGeo = new TextGeometry("The Brockton", {
    ...texProp,
    font: font,
  });

  const color = new Color();
  color.setRGB(0, 0, 0);

  textMaterial = new MeshStandardMaterial({ color: 0x00ff00 });
  if (material) {
    textMaterial = material;
  }

  let text = new Mesh(textGeo, textMaterial);
  text.name = "text";
  text.position.set(-0.5, 0.75, 0);

  return text;
};

export default createFont;
