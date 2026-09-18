const GRID_SIZE = 10;
const LEVEL_COUNT = 5;
const MAX_COMMANDS = 20;
const STEP_DELAY = 360;
const STORAGE_KEY = 'kidos-robot-challenge-levels-v3';
const STATS_KEY = 'kidos-robot-challenge-stats-v3';

const TILE_SYMBOLS = {
  wall: '⬛',
  box: '📦',
  robot: '🤖',
  goal: '❤️',
  greenButton: '🔘',
  greenDoor: '🚪',
  blueButton: '🔘',
  blueDoor: '🚪'
};

const COMMAND_SYMBOLS = {
  up: '▲',
  right: '▶',
  down: '▼',
  left: '◀',
  press: '👉',
  push: '💪'
};

const DIRECTIONS = {
  up: { row: -1, col: 0 },
  right: { row: 0, col: 1 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 }
};

const boardElement = document.getElementById('board');
const commandQueueElement = document.getElementById('commandQueue');
const levelNumberElement = document.getElementById('levelNumber');
const previousLevelButton = document.getElementById('previousLevel');
const nextLevelButton = document.getElementById('nextLevel');
const restartButton = document.getElementById('restartButton');
const editButton = document.getElementById('editButton');
const playButton = document.getElementById('playButton');
const playControls = document.getElementById('playControls');
const editorControls = document.getElementById('editorControls');
const editorWarning = document.getElementById('editorWarning');
const playCountElement = document.getElementById('playCount');
const commandCountElement = document.getElementById('commandCount');
const winOverlay = document.getElementById('winOverlay');
const winPlayCount = document.getElementById('winPlayCount');
const winCommandCount = document.getElementById('winCommandCount');
const againButton = document.getElementById('againButton');

let levels = loadLevels();
let stats = loadStats();
let currentLevelIndex = 0;
let editing = false;
let selectedTool = 'wall';
let commandQueue = [];
let running = false;
let playState = createPlayState(levels[currentLevelIndex]);

createQueueSlots();
bindEvents();
renderAll();

function bindEvents() {
  previousLevelButton.addEventListener('click', () => changeLevel(-1));
  nextLevelButton.addEventListener('click', () => changeLevel(1));
  restartButton.addEventListener('click', restartCurrentLevel);
  editButton.addEventListener('click', toggleEditing);
  playButton.addEventListener('click', runCommands);
  againButton.addEventListener('click', restartCurrentLevel);

  playControls.querySelectorAll('[data-command]').forEach(button => {
    button.addEventListener('click', () => addCommand(button.dataset.command));
  });

  editorControls.querySelectorAll('[data-tool]').forEach(button => {
    button.addEventListener('click', () => selectTool(button.dataset.tool));
  });
}

function createQueueSlots() {
  commandQueueElement.replaceChildren();

  for (
    let index = 0;
    index < MAX_COMMANDS;
    index += 1
  ) {
    const slot =
      document.createElement('button');

    slot.type = 'button';
    slot.className = 'queue-slot';
    slot.dataset.index = String(index);
    slot.setAttribute(
      'aria-label',
      `Komentopaikka ${index + 1}`
    );

    slot.addEventListener('click', () => {
      removeCommand(index);
    });

    commandQueueElement.appendChild(slot);
  }
}

function renderAll() {
  levelNumberElement.textContent = String(currentLevelIndex + 1);
  updateStats();
  renderBoard();
  renderQueue();
  renderSelectedTool();
  updateEditorWarning();
}

function updateEditorWarning() {
  if (!editorWarning) return;

  if (!editing) {
    editorWarning.classList.add('hidden');
    return;
  }

  const tiles = levels[currentLevelIndex].tiles;
  const hasRobot = tiles.some(tile => tile.type === 'robot');
  const hasGoal = tiles.some(tile => tile.type === 'goal');

  if (hasRobot && hasGoal) {
    editorWarning.classList.add('hidden');
    return;
  }

  const missing = [];
  if (!hasRobot) missing.push('ROBOTTI');
  if (!hasGoal) missing.push('SYDÄN');

  editorWarning.textContent = `LISÄÄ KENTTÄÄN ${missing.join(' JA ')}`;
  editorWarning.classList.remove('hidden');
}

function renderBoard() {
  boardElement.replaceChildren();
  const source = editing ? levels[currentLevelIndex] : playState;

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cell';
      cell.dataset.row = String(row);
      cell.dataset.col = String(col);
      cell.setAttribute('role', 'gridcell');

      const tile = getTile(source.tiles, row, col);
      if (tile) renderTile(cell, tile, source);

      if (!editing && source.robot.row === row && source.robot.col === col) {
        cell.classList.add('robot-cell');
        const robot = document.createElement('span');
        robot.className = 'piece';
        robot.textContent = TILE_SYMBOLS.robot;
        cell.appendChild(robot);
      }

      if (editing) {
        cell.classList.add('editable');
        cell.addEventListener('click', () => placeTool(row, col));
      } else {
        cell.disabled = true;
      }

      boardElement.appendChild(cell);
    }
  }
}

function renderTile(cell, tile, source) {
  cell.classList.add(tile.type);
  const open = !editing && isDoor(tile.type) && source.openDoors[tileColor(tile.type)];
  if (open) {
    cell.classList.add('open-door');
    return;
  }

  const piece = document.createElement('span');
  piece.className = 'piece';
  piece.textContent = TILE_SYMBOLS[tile.type] || '';
  cell.appendChild(piece);
}

function renderQueue(activeIndex = -1) {
  [...commandQueueElement.children].forEach((slot, index) => {
    const command = commandQueue[index];
    slot.textContent = command ? COMMAND_SYMBOLS[command] : '';
    slot.classList.toggle('filled', Boolean(command));
    slot.classList.toggle('running', index === activeIndex);
  });
}

function changeLevel(direction) {
  if (running) return;
  hideWinOverlay();
  currentLevelIndex = (currentLevelIndex + direction + LEVEL_COUNT) % LEVEL_COUNT;
  commandQueue = [];
  playState = createPlayState(levels[currentLevelIndex]);
  renderAll();
  safeSound('playClickSound');
}

function restartCurrentLevel() {
  if (running) {
    return;
  }

  winOverlay.classList.add('hidden');

  commandQueue = [];

  stats[currentLevelIndex] = {
    plays: 0,
    commands: 0
  };

  saveStats();

  playState =
    createPlayState(
      levels[currentLevelIndex]
    );

  renderBoard();
  renderQueue();
  updateStats();

  playSharedSound('playNewRoundSound');
}

function playSharedSound(functionName) {
  const soundFunction = window[functionName];

  if (typeof soundFunction === 'function') {
    soundFunction();
  }
}

function toggleEditing() {
  if (running) return;
  hideWinOverlay();
  editing = !editing;
  document.body.classList.toggle('editing', editing);
  editButton.classList.toggle('active', editing);
  editButton.setAttribute('aria-pressed', String(editing));
  playControls.classList.toggle('hidden', editing);
  editorControls.classList.toggle('hidden', !editing);
  commandQueue = [];
  playState = createPlayState(levels[currentLevelIndex]);
  renderAll();
  safeSound('playClickSound');
}

function selectTool(tool) {
  selectedTool = tool;
  renderSelectedTool();
  safeSound('playClickSound');
}

function renderSelectedTool() {
  editorControls.querySelectorAll('[data-tool]').forEach(button => {
    button.classList.toggle('selected', button.dataset.tool === selectedTool);
  });
}

function placeTool(row, col) {
  if (!editing || running) return;
  const level = levels[currentLevelIndex];

  if (selectedTool === 'erase') {
    level.tiles = level.tiles.filter(tile => !(tile.row === row && tile.col === col));
  } else {
    if (selectedTool === 'robot' || selectedTool === 'goal') {
      level.tiles = level.tiles.filter(tile => tile.type !== selectedTool);
    }
    level.tiles = level.tiles.filter(tile => !(tile.row === row && tile.col === col));
    level.tiles.push({ row, col, type: selectedTool });
  }

  saveLevels();
  playState = createPlayState(level);
  renderBoard();
  updateEditorWarning();
  safeSound('playSoftPopSound');
}

function addCommand(command) {
  if (editing || running || commandQueue.length >= MAX_COMMANDS) {
    if (commandQueue.length >= MAX_COMMANDS) safeSound('playWrongSound');
    return;
  }
  commandQueue.push(command);
  renderQueue();
  safeSound('playClickSound');
}

function removeCommand(index) {
  if (
    editing ||
    running ||
    index < 0 ||
    index >= commandQueue.length
  ) {
    return;
  }

  commandQueue.splice(index, 1);

  renderQueue();
  playSharedSound('playSoftPopSound');
}

async function runCommands() {
  if (editing || running) return;
  if (commandQueue.length === 0 || !hasRequiredPieces(playState)) {
    flashBoard();
    safeSound('playWrongSound');
    return;
  }

  running = true;
  stats[currentLevelIndex].plays += 1;
  saveStats();
  updateStats();

  while (commandQueue.length > 0 && running) {
    renderQueue(0);
    await wait(STEP_DELAY);

    const command = commandQueue.shift();
    const result = executeCommand(command);
    stats[currentLevelIndex].commands += 1;
    saveStats();
    updateStats();
    renderBoard();
    renderQueue();

    if (result === 'collision') {
      commandQueue = [];
      renderQueue();
      await showCollision();
      safeSound('playWrongSound');
      break;
    }

    safeSound('playClickSound');

    if (isGoalReached()) {
      commandQueue = [];
      renderQueue();
      showSuccess();
      safeSound('playWinSound');
      break;
    }

    await wait(STEP_DELAY * 0.45);
  }

  running = false;
}

function executeCommand(command) {
  if (DIRECTIONS[command]) return moveRobot(command);
  if (command === 'press') return pressButton();
  if (command === 'push') return pushBox();
  return 'ok';
}

function moveRobot(direction) {
  const delta = DIRECTIONS[direction];
  const target = {
    row: playState.robot.row + delta.row,
    col: playState.robot.col + delta.col
  };

  if (!insideGrid(target.row, target.col) || isBlocked(target.row, target.col)) {
    return 'collision';
  }

  playState.robot = target;
  return 'ok';
}

function pressButton() {
  for (const position of getAdjacentCells()) {
    const tile = getTile(playState.tiles, position.row, position.col);
    if (tile && (tile.type === 'greenButton' || tile.type === 'blueButton')) {
      playState.openDoors[tileColor(tile.type)] = true;
      return 'ok';
    }
  }
  return 'collision';
}

function pushBox() {
  for (const position of getAdjacentCells()) {
    const box = getTile(playState.tiles, position.row, position.col);
    if (!box || box.type !== 'box') continue;

    const destination = {
      row: position.row + (position.row - playState.robot.row),
      col: position.col + (position.col - playState.robot.col)
    };

    if (!insideGrid(destination.row, destination.col)) continue;
    if (isBlocked(destination.row, destination.col)) continue;

    box.row = destination.row;
    box.col = destination.col;
    return 'ok';
  }
  return 'collision';
}

function getAdjacentCells() {
  return [
    { row: playState.robot.row - 1, col: playState.robot.col },
    { row: playState.robot.row, col: playState.robot.col + 1 },
    { row: playState.robot.row + 1, col: playState.robot.col },
    { row: playState.robot.row, col: playState.robot.col - 1 }
  ].filter(position => insideGrid(position.row, position.col));
}

function isBlocked(row, col) {
  const tile = getTile(playState.tiles, row, col);
  if (!tile) return false;

  if (
    tile.type === 'wall' ||
    tile.type === 'box' ||
    tile.type === 'greenButton' ||
    tile.type === 'blueButton'
  ) {
    return true;
  }

  if (isDoor(tile.type)) {
    return !playState.openDoors[tileColor(tile.type)];
  }

  return false;
}

function isGoalReached() {
  const goal = playState.tiles.find(tile => tile.type === 'goal');
  return Boolean(goal && goal.row === playState.robot.row && goal.col === playState.robot.col);
}

function hasRequiredPieces(state) {
  return Boolean(
    state.robot &&
    state.robot.row >= 0 &&
    state.robot.col >= 0 &&
    state.tiles.some(tile => tile.type === 'goal')
  );
}

function showSuccess() {
  const index = playState.robot.row * GRID_SIZE + playState.robot.col;
  const cell = boardElement.children[index];
  if (cell) cell.classList.add('success');

  winPlayCount.textContent = String(stats[currentLevelIndex].plays);
  winCommandCount.textContent = String(stats[currentLevelIndex].commands);
  window.setTimeout(() => winOverlay.classList.remove('hidden'), 500);
}

function hideWinOverlay() {
  winOverlay.classList.add('hidden');
}

async function showCollision() {
  const index = playState.robot.row * GRID_SIZE + playState.robot.col;
  const cell = boardElement.children[index];
  if (!cell) return;
  cell.classList.add('bump');
  await wait(340);
  cell.classList.remove('bump');
}

function flashBoard() {
  boardElement.classList.add('bump');
  window.setTimeout(() => boardElement.classList.remove('bump'), 340);
}

function updateStats() {
  playCountElement.textContent = String(stats[currentLevelIndex].plays);
  commandCountElement.textContent = String(stats[currentLevelIndex].commands);
}

function createPlayState(level) {
  const tiles = level.tiles.map(tile => ({ ...tile }));
  const robotTile = tiles.find(tile => tile.type === 'robot');
  const robot = robotTile
    ? { row: robotTile.row, col: robotTile.col }
    : { row: -1, col: -1 };

  return {
    tiles: tiles.filter(tile => tile.type !== 'robot'),
    robot,
    openDoors: { green: false, blue: false }
  };
}

function getTile(tiles, row, col) {
  return tiles.find(tile => tile.row === row && tile.col === col) || null;
}

function insideGrid(row, col) {
  return row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE;
}

function isDoor(type) {
  return type === 'greenDoor' || type === 'blueDoor';
}

function tileColor(type) {
  return type.startsWith('green') ? 'green' : 'blue';
}

function wait(milliseconds) {
  return new Promise(resolve => window.setTimeout(resolve, milliseconds));
}

function safeSound(functionName) {
  const soundFunction = window[functionName];
  if (typeof soundFunction === 'function') soundFunction();
}

function loadLevels() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved) && saved.length === LEVEL_COUNT) return saved;
  } catch (error) {
    console.warn('Kenttien lataaminen epäonnistui:', error);
  }
  return createDefaultLevels();
}

function saveLevels() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(levels));
}

function loadStats() {
  try {
    const saved = JSON.parse(localStorage.getItem(STATS_KEY));
    if (Array.isArray(saved) && saved.length === LEVEL_COUNT) return saved;
  } catch (error) {
    console.warn('Tilastojen lataaminen epäonnistui:', error);
  }
  return Array.from({ length: LEVEL_COUNT }, () => ({ plays: 0, commands: 0 }));
}

function saveStats() {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function createDefaultLevels() {
  return [
    {
      tiles: [
        { row: 4, col: 7, type: 'goal' },
        { row: 5, col: 8, type: 'wall' },
        { row: 4, col: 8, type: 'wall' },
        { row: 3, col: 8, type: 'wall' },
        { row: 3, col: 1, type: 'robot' },
        { row: 2, col: 8, type: 'wall' },
        { row: 1, col: 8, type: 'wall' },
        { row: 1, col: 7, type: 'wall' },
        { row: 1, col: 6, type: 'wall' },
        { row: 1, col: 5, type: 'wall' },
        { row: 1, col: 4, type: 'wall' },
        { row: 1, col: 3, type: 'wall' },
        { row: 1, col: 2, type: 'wall' },
        { row: 1, col: 1, type: 'wall' },
        { row: 1, col: 0, type: 'wall' },
        { row: 2, col: 0, type: 'wall' },
        { row: 3, col: 0, type: 'wall' },
        { row: 4, col: 0, type: 'wall' },
        { row: 5, col: 0, type: 'wall' },
        { row: 6, col: 8, type: 'wall' },
        { row: 6, col: 7, type: 'wall' },
        { row: 6, col: 6, type: 'wall' },
        { row: 6, col: 5, type: 'wall' },
        { row: 6, col: 4, type: 'wall' },
        { row: 6, col: 3, type: 'wall' },
        { row: 6, col: 2, type: 'wall' },
        { row: 6, col: 1, type: 'wall' },
        { row: 6, col: 0, type: 'wall' },
        { row: 3, col: 3, type: 'wall' },
        { row: 4, col: 5, type: 'wall' },
        { row: 5, col: 5, type: 'wall' },
        { row: 2, col: 3, type: 'wall' }
      ]
    },

    {
      tiles: [
        { row: 8, col: 1, type: 'robot' },
        { row: 8, col: 4, type: 'greenButton' },
        { row: 6, col: 6, type: 'greenDoor' },
        { row: 6, col: 5, type: 'wall' },
        { row: 6, col: 7, type: 'wall' },
        { row: 5, col: 6, type: 'goal' },
        { row: 5, col: 5, type: 'wall' },
        { row: 4, col: 5, type: 'wall' },
        { row: 4, col: 6, type: 'wall' },
        { row: 4, col: 7, type: 'wall' },
        { row: 5, col: 7, type: 'wall' },
        { row: 7, col: 7, type: 'wall' },
        { row: 8, col: 7, type: 'wall' },
        { row: 9, col: 7, type: 'wall' },
        { row: 9, col: 6, type: 'wall' },
        { row: 9, col: 5, type: 'wall' },
        { row: 9, col: 4, type: 'wall' },
        { row: 9, col: 3, type: 'wall' },
        { row: 9, col: 2, type: 'wall' },
        { row: 9, col: 1, type: 'wall' },
        { row: 9, col: 0, type: 'wall' },
        { row: 8, col: 0, type: 'wall' },
        { row: 7, col: 0, type: 'wall' },
        { row: 6, col: 4, type: 'wall' },
        { row: 6, col: 3, type: 'wall' },
        { row: 6, col: 2, type: 'wall' },
        { row: 6, col: 0, type: 'wall' },
        { row: 6, col: 1, type: 'wall' }
      ]
    },

    {
      tiles: [
        { row: 8, col: 1, type: 'robot' },
        { row: 2, col: 8, type: 'goal' },
        { row: 7, col: 4, type: 'wall' },
        { row: 9, col: 4, type: 'wall' },
        { row: 8, col: 2, type: 'box' },
        { row: 7, col: 1, type: 'wall' },
        { row: 9, col: 1, type: 'wall' },
        { row: 9, col: 0, type: 'wall' },
        { row: 8, col: 0, type: 'wall' },
        { row: 7, col: 0, type: 'wall' },
        { row: 6, col: 1, type: 'wall' },
        { row: 9, col: 2, type: 'wall' },
        { row: 9, col: 3, type: 'wall' },
        { row: 5, col: 3, type: 'greenButton' },
        { row: 6, col: 8, type: 'blueButton' },
        { row: 3, col: 8, type: 'blueDoor' },
        { row: 6, col: 6, type: 'greenDoor' },
        { row: 9, col: 5, type: 'wall' },
        { row: 9, col: 6, type: 'wall' },
        { row: 9, col: 7, type: 'wall' },
        { row: 9, col: 8, type: 'wall' },
        { row: 9, col: 9, type: 'wall' },
        { row: 8, col: 9, type: 'wall' },
        { row: 7, col: 9, type: 'wall' },
        { row: 6, col: 9, type: 'wall' },
        { row: 5, col: 9, type: 'wall' },
        { row: 4, col: 9, type: 'wall' },
        { row: 3, col: 9, type: 'wall' },
        { row: 2, col: 9, type: 'wall' },
        { row: 1, col: 9, type: 'wall' },
        { row: 1, col: 8, type: 'wall' },
        { row: 1, col: 7, type: 'wall' },
        { row: 3, col: 7, type: 'blueDoor' },
        { row: 3, col: 6, type: 'blueDoor' },
        { row: 1, col: 6, type: 'wall' },
        { row: 1, col: 5, type: 'wall' },
        { row: 2, col: 5, type: 'wall' },
        { row: 3, col: 5, type: 'wall' },
        { row: 3, col: 4, type: 'wall' },
        { row: 3, col: 3, type: 'wall' },
        { row: 3, col: 2, type: 'wall' },
        { row: 3, col: 1, type: 'wall' },
        { row: 4, col: 1, type: 'wall' },
        { row: 5, col: 1, type: 'wall' },
        { row: 5, col: 2, type: 'wall' },
        { row: 5, col: 6, type: 'wall' },
        { row: 5, col: 7, type: 'wall' },
        { row: 5, col: 8, type: 'wall' },
        { row: 7, col: 8, type: 'wall' },
        { row: 7, col: 7, type: 'wall' },
        { row: 7, col: 6, type: 'wall' }
      ]
    },

    {
      tiles: [
        { row: 8, col: 1, type: 'robot' },
        { row: 5, col: 5, type: 'blueDoor' },
        { row: 7, col: 3, type: 'wall' },
        { row: 7, col: 4, type: 'wall' },
        { row: 7, col: 5, type: 'wall' },
        { row: 7, col: 6, type: 'wall' },
        { row: 5, col: 6, type: 'wall' },
        { row: 5, col: 4, type: 'wall' },
        { row: 6, col: 6, type: 'greenDoor' },
        { row: 6, col: 5, type: 'box' },
        { row: 5, col: 7, type: 'wall' },
        { row: 5, col: 8, type: 'wall' },
        { row: 5, col: 9, type: 'wall' },
        { row: 7, col: 7, type: 'wall' },
        { row: 7, col: 8, type: 'wall' },
        { row: 7, col: 9, type: 'wall' },
        { row: 9, col: 5, type: 'blueButton' },
        { row: 9, col: 6, type: 'wall' },
        { row: 9, col: 7, type: 'wall' },
        { row: 9, col: 8, type: 'wall' },
        { row: 9, col: 9, type: 'wall' },
        { row: 8, col: 9, type: 'wall' },
        { row: 6, col: 9, type: 'wall' },
        { row: 9, col: 4, type: 'wall' },
        { row: 9, col: 3, type: 'wall' },
        { row: 9, col: 2, type: 'wall' },
        { row: 9, col: 1, type: 'wall' },
        { row: 9, col: 0, type: 'wall' },
        { row: 8, col: 0, type: 'wall' },
        { row: 7, col: 0, type: 'wall' },
        { row: 3, col: 3, type: 'greenButton' },
        { row: 4, col: 3, type: 'wall' },
        { row: 4, col: 4, type: 'wall' },
        { row: 2, col: 3, type: 'wall' },
        { row: 2, col: 2, type: 'wall' },
        { row: 2, col: 1, type: 'wall' },
        { row: 2, col: 0, type: 'wall' },
        { row: 3, col: 0, type: 'wall' },
        { row: 4, col: 0, type: 'wall' },
        { row: 5, col: 0, type: 'wall' },
        { row: 6, col: 0, type: 'wall' },
        { row: 7, col: 1, type: 'box' },
        { row: 7, col: 2, type: 'box' },
        { row: 2, col: 6, type: 'goal' },
        { row: 3, col: 6, type: 'box' },
        { row: 2, col: 5, type: 'box' },
        { row: 4, col: 8, type: 'wall' },
        { row: 3, col: 8, type: 'wall' },
        { row: 2, col: 8, type: 'wall' },
        { row: 1, col: 8, type: 'wall' },
        { row: 0, col: 8, type: 'wall' },
        { row: 0, col: 7, type: 'wall' },
        { row: 0, col: 6, type: 'wall' },
        { row: 0, col: 5, type: 'wall' },
        { row: 0, col: 4, type: 'wall' },
        { row: 0, col: 3, type: 'wall' },
        { row: 1, col: 3, type: 'wall' },
        { row: 2, col: 7, type: 'wall' }
      ]
    },

    {
      tiles: [
        { row: 5, col: 3, type: 'box' },
        { row: 4, col: 4, type: 'box' },
        { row: 4, col: 3, type: 'box' },
        { row: 3, col: 3, type: 'wall' },
        { row: 4, col: 5, type: 'wall' },
        { row: 6, col: 3, type: 'wall' },
        { row: 6, col: 4, type: 'wall' },
        { row: 6, col: 5, type: 'wall' },
        { row: 6, col: 6, type: 'wall' },
        { row: 5, col: 6, type: 'wall' },
        { row: 4, col: 6, type: 'wall' },
        { row: 3, col: 5, type: 'greenButton' },
        { row: 2, col: 5, type: 'greenDoor' },
        { row: 1, col: 5, type: 'wall' },
        { row: 0, col: 4, type: 'wall' },
        { row: 0, col: 3, type: 'wall' },
        { row: 0, col: 2, type: 'wall' },
        { row: 0, col: 1, type: 'wall' },
        { row: 0, col: 0, type: 'wall' },
        { row: 1, col: 0, type: 'wall' },
        { row: 2, col: 0, type: 'wall' },
        { row: 3, col: 0, type: 'wall' },
        { row: 5, col: 0, type: 'wall' },
        { row: 4, col: 0, type: 'wall' },
        { row: 6, col: 0, type: 'wall' },
        { row: 7, col: 0, type: 'wall' },
        { row: 8, col: 0, type: 'wall' },
        { row: 9, col: 0, type: 'wall' },
        { row: 9, col: 1, type: 'wall' },
        { row: 9, col: 2, type: 'wall' },
        { row: 9, col: 3, type: 'wall' },
        { row: 9, col: 4, type: 'wall' },
        { row: 9, col: 5, type: 'wall' },
        { row: 9, col: 6, type: 'wall' },
        { row: 9, col: 7, type: 'wall' },
        { row: 9, col: 8, type: 'wall' },
        { row: 9, col: 9, type: 'wall' },
        { row: 8, col: 9, type: 'wall' },
        { row: 7, col: 9, type: 'wall' },
        { row: 6, col: 9, type: 'wall' },
        { row: 4, col: 9, type: 'wall' },
        { row: 2, col: 9, type: 'wall' },
        { row: 1, col: 9, type: 'wall' },
        { row: 0, col: 9, type: 'wall' },
        { row: 0, col: 8, type: 'wall' },
        { row: 0, col: 7, type: 'wall' },
        { row: 0, col: 5, type: 'wall' },
        { row: 0, col: 6, type: 'wall' },
        { row: 5, col: 9, type: 'wall' },
        { row: 7, col: 2, type: 'robot' },
        { row: 4, col: 8, type: 'wall' },
        { row: 3, col: 9, type: 'blueButton' },
        { row: 4, col: 7, type: 'blueDoor' },
        { row: 7, col: 4, type: 'box' },
        { row: 8, col: 4, type: 'box' },
        { row: 7, col: 6, type: 'box' },
        { row: 8, col: 6, type: 'goal' },
        { row: 8, col: 7, type: 'box' },
        { row: 4, col: 2, type: 'box' },
        { row: 3, col: 1, type: 'wall' },
        { row: 2, col: 3, type: 'wall' },
        { row: 1, col: 3, type: 'wall' }
      ]
    }
  ];
}
