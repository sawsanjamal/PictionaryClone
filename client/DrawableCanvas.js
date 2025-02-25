export default function DrawableCanvas(canvas, socket) {
  this.canDraw = false;
  this.clearCanvas = function () {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  let previousPosition = null;
  canvas.addEventListener("mousemove", (e) => {
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
    ctx.lineWidth = canvas.dataset.weight;
    ctx.strokeStyle = canvas.dataset.color;
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
