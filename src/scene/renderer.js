import {
  WebGLRenderer,
  VSMShadowMap,
  LinearToneMapping,
  sRGBEncoding,
} from "three";

const rendererUtils = new WebGLRenderer({
  antialias: true,
  canvas: document.querySelector("#bg"),
});
rendererUtils.gammaInput = true;
rendererUtils.gammaOutput = true;
rendererUtils.shadowMap.enabled = true;
rendererUtils.shadowMap.type = VSMShadowMap;
rendererUtils.physicallyCorrectLights = true;
rendererUtils.toneMapping = LinearToneMapping;
rendererUtils.toneMappingExposure = 0.5;
rendererUtils.outputEncoding = sRGBEncoding;
rendererUtils.setPixelRatio(window.devicePixelRatio);
rendererUtils.setSize(window.innerWidth, window.innerHeight);

export default rendererUtils;
