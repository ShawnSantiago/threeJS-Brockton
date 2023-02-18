var isDragging = false;
var previousMousePosition = {
  x: 0,
  y: 0,
};

function mousedown() {
  isDragging = true;
}

function mousemove(e) {
  var deltaMove = {
    x: e.offsetX - previousMousePosition.x,
    y: e.offsetY - previousMousePosition.y,
  };

  if (isDragging) {
    var deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        toRadians(deltaMove.y * 1),
        toRadians(deltaMove.x * 1),
        0,
        "XYZ"
      )
    );

    brockton.quaternion.multiplyQuaternions(
      deltaRotationQuaternion,
      brockton.quaternion
    );
  }

  previousMousePosition = {
    x: e.offsetX,
    y: e.offsetY,
  };
}

function mouseup() {
  isDragging = false;
}

function toRadians(angle) {
  return angle * (Math.PI / 180);
}

function toDegrees(angle) {
  return angle * (180 / Math.PI);
}
