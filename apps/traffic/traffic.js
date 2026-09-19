const BLOCK_COLS = 3;
const BLOCK_ROWS = 2;
const BLOCK_INTERIOR = 4;
const BLOCK_MARGIN = 1;
const BLOCK_SPAN = BLOCK_INTERIOR + BLOCK_MARGIN * 2;
const ROAD_WIDTH = 2;

const GRID_COLS = BLOCK_COLS * BLOCK_SPAN + (BLOCK_COLS - 1) * ROAD_WIDTH;
const GRID_ROWS = BLOCK_ROWS * BLOCK_SPAN + (BLOCK_ROWS - 1) * ROAD_WIDTH;

// Pari puistoa, loput korttelit ovat rakennuksia.
const BLOCK_KINDS = [
  ['building', 'park', 'building'],
  ['building', 'building', 'park']
];

// Joka kortteliin lohkaistaan yksi nurkka takaisin jalkakäytäväksi (pieni aukio),
// jotta asemakaava ei näytä liian täydelliseltä ruudukolta.
const CORNER_NAMES = ['tl', 'tr', 'br', 'bl'];
const BUILDING_ICONS = ['🏠', '🏢', '🏪'];
const VEHICLE_ICONS = ['🚗', '🚕', '🚙', '🚌'];
const VEHICLE_SPACING = 14;

const TILE_TYPES = {
  sidewalk: 'sidewalk',
  road: 'road',
  crosswalk: 'crosswalk',
  building: 'building',
  park: 'park'
};

const GREEN_DURATION = 3000;
const RED_DURATION = 3500;
const MIN_ANIMAL_DISTANCE = 6;
const TOAST_DURATION = 1800;

const MOVE_DELTAS = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1]
};

const KEY_DIRECTIONS = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right'
};

const ANIMAL_PAIRS = [
  { id: 'rabbit', emoji: '🐰', item: '🥕' },
  { id: 'monkey', emoji: '🐵', item: '🍌' },
  { id: 'cat', emoji: '🐱', item: '🐟' },
  { id: 'dog', emoji: '🐶', item: '🦴' },
  { id: 'bear', emoji: '🐻', item: '🍯' },
  { id: 'mouse', emoji: '🐭', item: '🧀' },
  { id: 'bee', emoji: '🐝', item: '🌸' },
  { id: 'duck', emoji: '🦆', item: '🍞' }
];

function blockOrigin(blockCol, blockRow) {
  return {
    col: blockCol * (BLOCK_SPAN + ROAD_WIDTH),
    row: blockRow * (BLOCK_SPAN + ROAD_WIDTH)
  };
}

function notchRegion(corner) {
  const rows = corner[0] === 't' ? [0, 1] : [BLOCK_INTERIOR - 2, BLOCK_INTERIOR - 1];
  const cols = corner[1] === 'l' ? [0, 1] : [BLOCK_INTERIOR - 2, BLOCK_INTERIOR - 1];
  return { rows, cols };
}

function oppositeOffset(corner) {
  return {
    row: corner[0] === 't' ? BLOCK_INTERIOR - 1 : 0,
    col: corner[1] === 'l' ? BLOCK_INTERIOR - 1 : 0
  };
}

function buildTiles() {
  const tiles = [];

  for (let row = 0; row < GRID_ROWS; row += 1) {
    for (let col = 0; col < GRID_COLS; col += 1) {
      tiles.push({ row, col, type: TILE_TYPES.sidewalk, decoration: null });
    }
  }

  const tileAt = (row, col) => tiles[row * GRID_COLS + col];

  // Korttelien sisältö: rakennus tai puisto, ja yksi aukio-nurkka joka kortteliin.
  for (let br = 0; br < BLOCK_ROWS; br += 1) {
    for (let bc = 0; bc < BLOCK_COLS; bc += 1) {
      const origin = blockOrigin(bc, br);
      const kind = BLOCK_KINDS[br][bc];
      const blockIndex = br * BLOCK_COLS + bc;

      for (let r = 0; r < BLOCK_INTERIOR; r += 1) {
        for (let c = 0; c < BLOCK_INTERIOR; c += 1) {
          tileAt(origin.row + BLOCK_MARGIN + r, origin.col + BLOCK_MARGIN + c).type = kind;
        }
      }

      const corner = CORNER_NAMES[blockIndex % CORNER_NAMES.length];
      const notch = notchRegion(corner);

      notch.rows.forEach(r => {
        notch.cols.forEach(c => {
          tileAt(origin.row + BLOCK_MARGIN + r, origin.col + BLOCK_MARGIN + c).type = TILE_TYPES.sidewalk;
        });
      });

      const anchor = oppositeOffset(corner);
      const iconTile = tileAt(origin.row + BLOCK_MARGIN + anchor.row, origin.col + BLOCK_MARGIN + anchor.col);

      if (kind === TILE_TYPES.building) {
        iconTile.decoration = BUILDING_ICONS[blockIndex % BUILDING_ICONS.length];
      }

      if (kind === TILE_TYPES.park) {
        iconTile.decoration = '🌳';
      }
    }
  }

  // Pystykadut korttelisarakkeiden välissä (robotti ylittää sivuttain).
  for (let bc = 0; bc < BLOCK_COLS - 1; bc += 1) {
    const roadCol = bc * (BLOCK_SPAN + ROAD_WIDTH) + BLOCK_SPAN;

    for (let row = 0; row < GRID_ROWS; row += 1) {
      for (let w = 0; w < ROAD_WIDTH; w += 1) {
        tileAt(row, roadCol + w).type = TILE_TYPES.road;
      }
    }

    for (let br = 0; br < BLOCK_ROWS; br += 1) {
      const origin = blockOrigin(bc, br);
      const crossingRow = origin.row + Math.floor(BLOCK_SPAN / 2);

      for (let w = 0; w < ROAD_WIDTH; w += 1) {
        const tile = tileAt(crossingRow, roadCol + w);
        tile.type = TILE_TYPES.crosswalk;
        tile.orientation = 'vertical';
      }
    }
  }

  // Vaakakadut korttelirivien välissä (robotti ylittää pystysuunnassa).
  for (let br = 0; br < BLOCK_ROWS - 1; br += 1) {
    const roadRow = br * (BLOCK_SPAN + ROAD_WIDTH) + BLOCK_SPAN;

    for (let col = 0; col < GRID_COLS; col += 1) {
      for (let w = 0; w < ROAD_WIDTH; w += 1) {
        tileAt(roadRow + w, col).type = TILE_TYPES.road;
      }
    }

    for (let bc = 0; bc < BLOCK_COLS; bc += 1) {
      const origin = blockOrigin(bc, br);
      const crossingCol = origin.col + Math.floor(BLOCK_SPAN / 2);

      for (let w = 0; w < ROAD_WIDTH; w += 1) {
        const tile = tileAt(roadRow + w, crossingCol);
        tile.type = TILE_TYPES.crosswalk;
        tile.orientation = 'horizontal';
      }
    }
  }

  // Muutama ajoneuvo sinne tänne kaduille koristeeksi.
  let roadTileCount = 0;
  let vehicleIndex = 0;

  tiles.forEach(tile => {
    if (tile.type !== TILE_TYPES.road) return;
    roadTileCount += 1;

    if (roadTileCount % VEHICLE_SPACING === 0) {
      tile.decoration = VEHICLE_ICONS[vehicleIndex % VEHICLE_ICONS.length];
      tile.decorationType = 'vehicle';
      vehicleIndex += 1;
    }
  });

  return tiles;
}

const level = {
  tiles: buildTiles(),
  robotStart: { row: 0, col: 0 }
};

const boardElement = document.getElementById('board');
const messageElement = document.getElementById('message');
const toastElement = document.getElementById('toast');
const lightPanel = document.querySelector('.light-panel');
const lampRed = document.getElementById('lampRed');
const lampGreen = document.getElementById('lampGreen');
const lightText = document.getElementById('lightText');
const carryIcon = document.getElementById('carryIcon');
const carryTarget = document.getElementById('carryTarget');
const restartButton = document.getElementById('restartButton');
const dpadButtons = document.querySelectorAll('.dpad-button');

let robot = { ...level.robotStart };
let animals = [];
let lightIsGreen = false;
let lightTimer = null;
let toastTimer = null;

let activeAnimalId = null;
let itemPosition = null;
let carrying = false;

function getTile(row, col) {
  if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS) return null;
  return level.tiles[row * GRID_COLS + col];
}

function isWalkableGround(tile) {
  return Boolean(tile) && (tile.type === TILE_TYPES.sidewalk || tile.type === TILE_TYPES.park);
}

function getAnimalAt(row, col) {
  return animals.find(animal => animal.row === row && animal.col === col) || null;
}

function getActiveAnimal() {
  return animals.find(animal => animal.id === activeAnimalId) || null;
}

function insideGrid(row, col) {
  return row >= 0 && row < GRID_ROWS && col >= 0 && col < GRID_COLS;
}

function isRoad(row, col) {
  const tile = getTile(row, col);
  return Boolean(tile && tile.type === TILE_TYPES.road);
}

function isCrosswalk(row, col) {
  const tile = getTile(row, col);
  return Boolean(tile && tile.type === TILE_TYPES.crosswalk);
}

function playSoundSafe(functionName) {
  const soundFunction = window[functionName];
  if (typeof soundFunction === 'function') soundFunction();
}

function setMessage(text) {
  messageElement.textContent = text;
}

function showToast(text) {
  if (toastTimer) {
    window.clearTimeout(toastTimer);
  }

  toastElement.textContent = text;
  toastElement.classList.add('show');

  toastTimer = window.setTimeout(() => {
    toastElement.classList.remove('show');
  }, TOAST_DURATION);
}

function manhattanDistance(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

function placeAnimalsRandomly() {
  const spawnTiles = level.tiles.filter(tile => isWalkableGround(tile) && !tile.decoration);
  const placed = [];

  ANIMAL_PAIRS.forEach(pair => {
    let chosen = null;
    let attempts = 0;

    while (attempts < 300 && !chosen) {
      attempts += 1;
      const candidate = spawnTiles[Math.floor(Math.random() * spawnTiles.length)];

      const tooCloseToOthers = placed.some(
        existing => manhattanDistance(existing, candidate) < MIN_ANIMAL_DISTANCE
      );

      const onRobotStart =
        candidate.row === level.robotStart.row && candidate.col === level.robotStart.col;

      if (!tooCloseToOthers && !onRobotStart) {
        chosen = candidate;
      }
    }

    if (!chosen) {
      chosen = spawnTiles[Math.floor(Math.random() * spawnTiles.length)];
    }

    placed.push({
      id: pair.id,
      emoji: pair.emoji,
      item: pair.item,
      row: chosen.row,
      col: chosen.col
    });
  });

  return placed;
}

function pickRandomItemPosition() {
  const takenSpots = animals.map(animal => `${animal.row},${animal.col}`);

  const candidates = level.tiles.filter(tile => {
    if (!isWalkableGround(tile) || tile.decoration) return false;
    return !takenSpots.includes(`${tile.row},${tile.col}`);
  });

  const choice = candidates[Math.floor(Math.random() * candidates.length)];
  return { row: choice.row, col: choice.col };
}

const boardPanel = boardElement.closest('.board-panel');

function resizeBoardToFit() {
  const styles = getComputedStyle(boardPanel);
  const paddingX = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
  const paddingY = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
  const availWidth = boardPanel.clientWidth - paddingX;
  const availHeight = boardPanel.clientHeight - paddingY;
  if (availWidth <= 0 || availHeight <= 0) return;

  const ratio = GRID_COLS / GRID_ROWS;
  let width = availWidth;
  let height = width / ratio;
  if (height > availHeight) {
    height = availHeight;
    width = height * ratio;
  }

  boardElement.style.width = `${width}px`;
  boardElement.style.height = `${height}px`;
}

function initBoardGrid() {
  boardElement.style.setProperty('--grid-cols', String(GRID_COLS));
  boardElement.style.setProperty('--grid-rows', String(GRID_ROWS));
  resizeBoardToFit();
  new ResizeObserver(resizeBoardToFit).observe(boardPanel);
}

function renderBoard() {
  boardElement.replaceChildren();

  level.tiles.forEach(tile => {
    const cell = document.createElement('div');
    cell.className = `cell ${tile.type}`;
    cell.dataset.row = String(tile.row);
    cell.dataset.col = String(tile.col);

    if (tile.type === TILE_TYPES.crosswalk) {
      cell.classList.add(tile.orientation === 'vertical' ? 'orientation-v' : 'orientation-h');
      cell.classList.toggle('green', lightIsGreen);
      cell.classList.toggle('red', !lightIsGreen);
    }

    if (tile.decoration) {
      const decorationSpan = document.createElement('span');
      decorationSpan.className =
        tile.decorationType === 'vehicle' ? 'piece decoration vehicle' : 'piece decoration';
      decorationSpan.textContent = tile.decoration;
      cell.appendChild(decorationSpan);
    }

    const animal = getAnimalAt(tile.row, tile.col);
    if (animal) {
      const animalSpan = document.createElement('span');
      animalSpan.className = 'piece character';
      animalSpan.textContent = animal.emoji;
      cell.appendChild(animalSpan);
    }

    if (itemPosition && tile.row === itemPosition.row && tile.col === itemPosition.col) {
      const activeAnimal = getActiveAnimal();
      const itemSpan = document.createElement('span');
      itemSpan.className = 'piece item';
      itemSpan.textContent = activeAnimal ? activeAnimal.item : '';
      cell.appendChild(itemSpan);
    }

    if (tile.row === robot.row && tile.col === robot.col) {
      const robotSpan = document.createElement('span');
      robotSpan.className = 'piece robot';
      robotSpan.textContent = '🤖';
      cell.appendChild(robotSpan);

      if (carrying) {
        const activeAnimal = getActiveAnimal();
        const badge = document.createElement('span');
        badge.className = 'carry-badge';
        badge.textContent = activeAnimal ? activeAnimal.item : '';
        cell.appendChild(badge);
      }
    }

    boardElement.appendChild(cell);
  });
}

function updateRequestPanel() {
  if (!activeAnimalId) {
    carryIcon.textContent = '❔';
    carryIcon.classList.remove('active', 'done');
    carryTarget.textContent = '';
    return;
  }

  const animal = getActiveAnimal();

  carryIcon.textContent = animal ? animal.item : '❔';
  carryIcon.classList.toggle('active', carrying);
  carryIcon.classList.toggle('done', !carrying && Boolean(itemPosition));
  carryTarget.textContent = animal ? animal.emoji : '';
}

function flashBlocked() {
  boardElement.classList.add('bump');
  window.setTimeout(() => boardElement.classList.remove('bump'), 260);
}

function flashLightPanel() {
  lightPanel.classList.add('flash');
  window.setTimeout(() => lightPanel.classList.remove('flash'), 320);
}

function flashVehicles() {
  boardElement.querySelectorAll('.piece.vehicle').forEach(vehicle => {
    vehicle.classList.add('flash');
    window.setTimeout(() => vehicle.classList.remove('flash'), 320);
  });
}

function startRequest(animal) {
  activeAnimalId = animal.id;
  itemPosition = pickRandomItemPosition();
  carrying = false;

  updateRequestPanel();
  setMessage(`${animal.emoji} TARVITSEE ${animal.item}`);
  playSoundSafe('playNewRoundSound');
}

function deliverToAnimal(animal) {
  animals = animals.filter(existing => existing.id !== animal.id);
  activeAnimalId = null;
  itemPosition = null;
  carrying = false;

  updateRequestPanel();
  setMessage(`HIENOA! VEIT ${animal.item} HAHMOLLE ${animal.emoji}`);
  showToast(`✅ ${animal.emoji} KIITOS ${animal.item}!`);
  playSoundSafe('playWinSound');

  window.setTimeout(() => {
    if (!activeAnimalId) {
      setMessage(animals.length > 0 ? 'KÄVELE HAHMON LUO' : 'KAIKKI ELÄIMET SAIVAT TOIVEENSA! 🎉');
    }
  }, 1600);
}

function handleArrival() {
  const animal = getAnimalAt(robot.row, robot.col);

  if (animal) {
    if (!activeAnimalId) {
      startRequest(animal);
      return;
    }

    if (animal.id === activeAnimalId && carrying) {
      deliverToAnimal(animal);
      return;
    }

    return;
  }

  if (itemPosition && robot.row === itemPosition.row && robot.col === itemPosition.col && !carrying) {
    carrying = true;
    itemPosition = null;
    updateRequestPanel();

    const activeAnimal = getActiveAnimal();
    setMessage(`KERÄSIT ${activeAnimal ? activeAnimal.item : ''}, VIE SE HAHMOLLE ${activeAnimal ? activeAnimal.emoji : ''}`);
    playSoundSafe('playSoftPopSound');
  }
}

function attemptMove(rowDelta, colDelta) {
  const targetRow = robot.row + rowDelta;
  const targetCol = robot.col + colDelta;

  if (!insideGrid(targetRow, targetCol)) {
    return;
  }

  if (isRoad(targetRow, targetCol)) {
    setMessage('AUTOTIE ON VAARALLINEN, KÄVELE SUOJATIETÄ');
    flashBlocked();
    flashVehicles();
    playSoundSafe('playWrongSound');
    return;
  }

  const targetTile = getTile(targetRow, targetCol);
  if (targetTile && targetTile.type === TILE_TYPES.building) {
    flashBlocked();
    playSoundSafe('playWrongSound');
    return;
  }

  const currentTile = getTile(robot.row, robot.col);
  const enteringCrosswalkFromSidewalk =
    isCrosswalk(targetRow, targetCol) && currentTile && currentTile.type === TILE_TYPES.sidewalk;

  if (enteringCrosswalkFromSidewalk && !lightIsGreen) {
    setMessage('PUNAINEN VALO, ODOTA VIHREÄÄ');
    flashBlocked();
    flashLightPanel();
    playSoundSafe('playWrongSound');
    return;
  }

  robot = { row: targetRow, col: targetCol };
  playSoundSafe('playClickSound');
  handleArrival();
  renderBoard();
}

function moveInDirection(direction) {
  const delta = MOVE_DELTAS[direction];
  if (!delta) return;

  attemptMove(delta[0], delta[1]);
}

function handleKeydown(event) {
  const direction = KEY_DIRECTIONS[event.key];
  if (!direction) return;

  event.preventDefault();
  moveInDirection(direction);
}

function setLight(isGreen) {
  lightIsGreen = isGreen;
  lampRed.classList.toggle('active', !isGreen);
  lampGreen.classList.toggle('active', isGreen);
  lightText.textContent = isGreen ? 'MENE' : 'ODOTA';
  playSoundSafe('playSoftPopSound');
  renderBoard();
}

function scheduleNextLight() {
  const duration = lightIsGreen ? GREEN_DURATION : RED_DURATION;

  lightTimer = window.setTimeout(() => {
    setLight(!lightIsGreen);
    scheduleNextLight();
  }, duration);
}

function restart() {
  if (lightTimer) {
    window.clearTimeout(lightTimer);
  }

  if (toastTimer) {
    window.clearTimeout(toastTimer);
  }

  toastElement.classList.remove('show');

  robot = { ...level.robotStart };
  animals = placeAnimalsRandomly();
  activeAnimalId = null;
  itemPosition = null;
  carrying = false;
  lightIsGreen = false;

  setMessage('KÄVELE HAHMON LUO');
  updateRequestPanel();
  lampRed.classList.add('active');
  lampGreen.classList.remove('active');
  lightText.textContent = 'ODOTA';
  renderBoard();
  scheduleNextLight();

  playSoundSafe('playNewRoundSound');
}

document.addEventListener('keydown', handleKeydown);
restartButton.addEventListener('click', restart);
dpadButtons.forEach(button => {
  button.addEventListener('click', () => moveInDirection(button.dataset.dir));
});

initBoardGrid();
restart();
