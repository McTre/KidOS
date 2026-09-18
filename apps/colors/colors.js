const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const colors = [
  { name: "PUNAINEN", value: "#ff5d73" },
  { name: "SININEN", value: "#59a8ff" },
  { name: "VIHREÄ", value: "#67dc8a" },
  { name: "KELTAINEN", value: "#ffd54a" },
  { name: "VIOLETTI", value: "#b185ff" },
  { name: "ORANSSI", value: "#ffad4d" }
];

const theme = {
  bg: "#162433",
  panel: "#213447",
  panel2: "#263b50",
  text: "#f4f7fb",
  muted: "#c5d2df",
  dark: "#162433",
  border: "#38546d",
  borderLight: "#5f7890",
  wrong: "#ff5d73",
  green: "#67dc8a",
  yellow: "#ffd54a"
};

const gridSize = 5;
const cellSize = 78;
const gap = 10;

const layout = {
  mainX: 48,
  mainY: 48,
  mainW: 804,
  mainH: 554,

  targetX: 92,
  targetY: 118,
  targetW: 230,
  targetH: 390,

  targetBoxX: 122,
  targetBoxY: 225,
  targetBoxSize: 170,

  gridX: 390,
  gridY: 116,

  messageX: 450,
  messageY: 628
};

const restartButton = {
  x: 320,
  y: 435,
  w: 260,
  h: 78
};

let grid = [];
let targetColor = null;
let remaining = 0;
let gameWon = false;
let animationFrameId = null;

function randomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function safePlay(soundFunctionName) {
  if (typeof window[soundFunctionName] === "function") {
    window[soundFunctionName]();
  }
}

function newGame() {
  grid = [];
  gameWon = false;

  for (let y = 0; y < gridSize; y++) {
    const row = [];

    for (let x = 0; x < gridSize; x++) {
      const color = randomColor();

      row.push({
        name: color.name,
        value: color.value,
        clicked: false,
        correctFlash: 0,
        wrongFlash: 0
      });
    }

    grid.push(row);
  }

  const randomY = Math.floor(Math.random() * gridSize);
  const randomX = Math.floor(Math.random() * gridSize);

  targetColor = {
    name: grid[randomY][randomX].name,
    value: grid[randomY][randomX].value
  };

  remaining = countTargetCells();

  draw();
}

function countTargetCells() {
  let count = 0;

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (grid[y][x].name === targetColor.name) {
        count++;
      }
    }
  }

  return count;
}

function drawRoundedRect(x, y, w, h, radius, fill, stroke = null, lineWidth = 3) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

  ctx.fillStyle = fill;
  ctx.fill();

  if (stroke) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}

function drawText(text, x, y, size, color = theme.text, align = "center") {
  ctx.fillStyle = color;
  ctx.font = `900 ${size}px Arial, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

function drawBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const blueGlow = ctx.createRadialGradient(0, 0, 40, 0, 0, 640);
  blueGlow.addColorStop(0, "rgba(89, 168, 255, 0.18)");
  blueGlow.addColorStop(1, theme.bg);

  ctx.fillStyle = blueGlow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const purpleGlow = ctx.createRadialGradient(
    canvas.width,
    canvas.height,
    40,
    canvas.width,
    canvas.height,
    620
  );

  purpleGlow.addColorStop(0, "rgba(177, 133, 255, 0.13)");
  purpleGlow.addColorStop(1, "rgba(22, 36, 51, 0)");

  ctx.fillStyle = purpleGlow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawMainPanel() {
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.26)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 10;

  drawRoundedRect(
    layout.mainX,
    layout.mainY,
    layout.mainW,
    layout.mainH,
    34,
    theme.panel,
    null,
    0
  );

  ctx.restore();

  drawRoundedRect(
    layout.mainX,
    layout.mainY,
    layout.mainW,
    layout.mainH,
    34,
    theme.panel,
    theme.border,
    5
  );
}

function drawTargetArea() {
  drawRoundedRect(
    layout.targetX,
    layout.targetY,
    layout.targetW,
    layout.targetH,
    28,
    "rgba(38, 59, 80, 0.72)",
    theme.borderLight,
    4
  );

  drawText(
    "ETSI",
    layout.targetX + layout.targetW / 2,
    layout.targetY + 46,
    44,
    theme.text
  );


  drawRoundedRect(
    layout.targetBoxX,
    layout.targetBoxY,
    layout.targetBoxSize,
    layout.targetBoxSize,
    24,
    targetColor.value,
    "rgba(244, 247, 251, 0.78)",
    5
  );

  drawText(
    String(remaining),
    layout.targetBoxX + layout.targetBoxSize / 2,
    layout.targetBoxY + layout.targetBoxSize / 2,
    86,
    theme.dark
  );

  drawText(
    targetColor.name,
    layout.targetX + layout.targetW / 2,
    layout.targetY + layout.targetH - 38,
    30,
    theme.text
  );
}

function drawGrid() {
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      drawCell(x, y);
    }
  }
}

function drawCell(x, y) {
  const cell = grid[y][x];

  const baseX = layout.gridX + x * (cellSize + gap);
  const baseY = layout.gridY + y * (cellSize + gap);

  let px = baseX;
  let py = baseY;
  let size = cellSize;
  let stroke = "rgba(244, 247, 251, 0.35)";
  let lineWidth = 3;

  if (cell.correctFlash > 0) {
    const pulse = Math.sin(cell.correctFlash * Math.PI);
    const grow = pulse * 12;

    px -= grow / 2;
    py -= grow / 2;
    size += grow;

    stroke = "#ffffff";
    lineWidth = 7;
  }

  if (cell.wrongFlash > 0) {
    const shake = Math.sin(cell.wrongFlash * Math.PI * 8) * 7;

    px += shake;
    stroke = theme.wrong;
    lineWidth = 7;
  }

  drawRoundedRect(px, py, size, size, 16, cell.value, stroke, lineWidth);

  if (cell.clicked) {
    drawFoundMark(px, py, size);
  }
}

function drawFoundMark(px, py, size = cellSize) {
  ctx.save();

  ctx.strokeStyle = "rgba(22, 36, 51, 0.84)";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(px + size * 0.25, py + size * 0.53);
  ctx.lineTo(px + size * 0.43, py + size * 0.70);
  ctx.lineTo(px + size * 0.76, py + size * 0.32);
  ctx.stroke();

  ctx.restore();
}

function drawBottomMessage() {
  drawText(
    "KLIKKAILE OIKEAT VÄRIT",
    layout.messageX,
    layout.messageY,
    22,
    theme.muted
  );
}

function drawWinScreen() {
  drawRoundedRect(0, 0, canvas.width, canvas.height, 0, "rgba(10, 18, 28, 0.58)");

  drawRoundedRect(
    230,
    170,
    440,
    330,
    34,
    theme.panel,
    theme.borderLight,
    5
  );

  drawText("HYVÄ!", 450, 270, 82, theme.yellow);
  drawText("LÖYSIT KAIKKI", 450, 338, 30, theme.text);

  drawRoundedRect(
    restartButton.x,
    restartButton.y,
    restartButton.w,
    restartButton.h,
    24,
    theme.green,
    "rgba(244, 247, 251, 0.62)",
    4
  );

  drawText("UUDESTAAN", 450, 474, 30, theme.dark);
}

function draw() {
  drawBackground();
  drawMainPanel();
  drawTargetArea();
  drawGrid();

  if (gameWon) {
    drawWinScreen();
  }

  drawBottomMessage();
}

function updateAnimations() {
  let hasActiveAnimation = false;

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cell = grid[y][x];

      if (cell.correctFlash > 0) {
        cell.correctFlash -= 0.08;
        if (cell.correctFlash < 0) cell.correctFlash = 0;
        hasActiveAnimation = true;
      }

      if (cell.wrongFlash > 0) {
        cell.wrongFlash -= 0.1;
        if (cell.wrongFlash < 0) cell.wrongFlash = 0;
        hasActiveAnimation = true;
      }
    }
  }

  draw();

  if (hasActiveAnimation) {
    animationFrameId = requestAnimationFrame(updateAnimations);
  } else {
    animationFrameId = null;
  }
}

function startAnimation() {
  if (!animationFrameId) {
    animationFrameId = requestAnimationFrame(updateAnimations);
  }
}

function getClickedCell(mouseX, mouseY) {
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const px = layout.gridX + x * (cellSize + gap);
      const py = layout.gridY + y * (cellSize + gap);

      const insideX = mouseX >= px && mouseX <= px + cellSize;
      const insideY = mouseY >= py && mouseY <= py + cellSize;

      if (insideX && insideY) {
        return { x, y };
      }
    }
  }

  return null;
}

function isRestartClicked(mouseX, mouseY) {
  const insideX = mouseX >= restartButton.x && mouseX <= restartButton.x + restartButton.w;
  const insideY = mouseY >= restartButton.y && mouseY <= restartButton.y + restartButton.h;

  return insideX && insideY;
}

function getCanvasPointerPosition(event) {
  const rect = canvas.getBoundingClientRect();

  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
}

function handlePointerDown(event) {
  const pointer = getCanvasPointerPosition(event);

  if (gameWon) {
    if (isRestartClicked(pointer.x, pointer.y)) {
      safePlay("playClickSound");
      newGame();
    }

    return;
  }

  const cellPosition = getClickedCell(pointer.x, pointer.y);

  if (!cellPosition) {
    return;
  }

  const cell = grid[cellPosition.y][cellPosition.x];

  if (cell.clicked) {
    return;
  }

  safePlay("playClickSound");

  if (cell.name === targetColor.name) {
    cell.clicked = true;
    cell.correctFlash = 1;
    remaining--;

    safePlay("playCorrectSound");

    if (remaining <= 0) {
      gameWon = true;
      safePlay("playWinSound");
    }

    startAnimation();
  } else {
    cell.wrongFlash = 1;

    safePlay("playWrongSound");
    startAnimation();
  }
}

canvas.addEventListener("pointerdown", handlePointerDown);

newGame();