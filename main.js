import { init } from "./src/app";
import "./styles.scss";

setTimeout(() => {
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    // true for mobile device
    document.querySelector(".progress-bar").innerHTML =
      "Sorry not optomized for mobile devices";
  } else {
    // false for not mobile device
    init();
  }
}, 200);
