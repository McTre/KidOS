const canvas = document.getElementById('drawingBoard');
const ctx = canvas.getContext('2d');

let drawing = false;
let hue = 205;

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

canvas.addEventListener('pointerdown', event => {
  drawing = true;
  canvas.setPointerCapture(event.pointerId);
  draw(event);
});

canvas.addEventListener('pointermove', event => {
  if (drawing) draw(event);
});

canvas.addEventListener('pointerup', () => drawing = false);
canvas.addEventListener('pointercancel', () => drawing = false);

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * devicePixelRatio);
  canvas.height = Math.floor(rect.height * devicePixelRatio);

  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.fillStyle = '#eef3f9';
  ctx.fillRect(0, 0, rect.width, rect.height);
}

function draw(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  hue = (hue + 2) % 360;
  ctx.fillStyle = `hsl(${hue}, 90%, 58%)`;
  ctx.beginPath();
  ctx.arc(x, y, 18, 0, Math.PI * 2);
  ctx.fill();
}
