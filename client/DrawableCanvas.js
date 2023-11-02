export default function DrawableCanvas(canvas, socket) {
  this.canDraw = false;
  let previousPosition = null;
  canvas.addEventListener("mousemove", (e) => {
    console.log("hi");
    if (e.buttons !== 1 || !this.canDraw) {
      previousPosition = null;
      return;
    }
    const newPosition = { x: e.layerX, y: e.layerY };
    if (previousPosition != null) {
      drawLine(previousPosition, newPosition);
      socket.emit("draw", {
        start: normalizeCoordinates(previousPosition),
        end: normalizeCoordinates(newPosition),
      });
    }
    previousPosition = newPosition;
  });
  canvas.addEventListener("mouseleave", () => {
    previousPosition = null;
  });
  socket.on("draw-line", (start, end) => {
    drawLine(toCanvasSpace(start), toCanvasSpace(end));
  });

  function drawLine(start, end) {
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }
  function normalizeCoordinates(position) {
    return {
      x: position.x / canvas.width,
      y: position.y / canvas.height,
    };
  }
  function toCanvasSpace(position) {
    return {
      x: position.x * canvas.width,
      y: position.y * canvas.height,
    };
  }
}
