export default function DrawableCanvas(canvas, socket) {
  let previousPosition = null;
  canvas.addEventListener("mousemove", (e) => {
    console.log("hi");
    if (e.buttons !== 1) {
      previousPosition = null;
      return;
    }
    const newPosition = { x: e.layerX, y: e.layerY };
    if (previousPosition != null) {
      drawLine(previousPosition, newPosition);
      console.log(newPosition);
    }
    previousPosition = newPosition;
  });

  function drawLine(start, end) {
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }
}
