const gridElement = document.getElementById('grid');
const commandQueueElement = document.getElementById('commandQueue');
const messageElement = document.getElementById('message');
const runButton = document.getElementById('runButton');
const removeButton = document.getElementById('removeButton');

const levels = [
  { gridSize: 4, rockCount: 2 },
  
];

const maxCommands = 6;

const commandIcons = {
  up: '⬆️',
  down: '⬇️',
  left: '⬅️',
  right: '➡️'
};

const commandMoves = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

let levelIndex = 0;
let gridSize = levels[levelIndex].gridSize;
let rockCount = levels[levelIndex].rockCount;

let robot = { x: 0, y: 0 };
let heart = { x: 3, y: 3 };
let rocks = [];
let commands = [];
let isRunning = false;

function safeSound(soundName) {
  if (typeof window[soundName] === 'function') {
    window[soundName]();
  }
}

function setMessage(text) {
  messageElement.textContent = text;
}

function samePosition(a, b) {
  return a.x === b.x && a.y === b.y;
}

function positionKey(position) {
  return `${position.x},${position.y}`;
}

function randomPosition() {
  return {
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize)
  };
}

function hasPosition(list, position) {
  return list.some((item) => samePosition(item, position));
}

function isInsideGrid(position) {
  return (
    position.x >= 0 &&
    position.x < gridSize &&
    position.y >= 0 &&
    position.y < gridSize
  );
}

function isRock(position) {
  return hasPosition(rocks, position);
}

function hasPathToHeart() {
  const visited = new Set();
  const queue = [robot];

  visited.add(positionKey(robot));

  while (queue.length > 0) {
    const current = queue.shift();

    if (samePosition(current, heart)) {
      return true;
    }

    Object.values(commandMoves).forEach((move) => {
      const next = {
        x: current.x + move.x,
        y: current.y + move.y
      };

      const key = positionKey(next);

      if (!isInsideGrid(next)) return;
      if (isRock(next)) return;
      if (visited.has(key)) return;

      visited.add(key);
      queue.push(next);
    });
  }

  return false;
}

function setupGridSize() {
  gridElement.style.setProperty('--grid-size', gridSize);

  gridElement.classList.remove('size-4', 'size-5', 'size-6');
  gridElement.classList.add(`size-${gridSize}`);
}

function createRandomLevel() {
  robot = randomPosition();
  heart = randomPosition();

  while (samePosition(robot, heart)) {
    heart = randomPosition();
  }

  rocks = [];

  while (rocks.length < rockCount) {
    const rock = randomPosition();

    if (
      samePosition(rock, robot) ||
      samePosition(rock, heart) ||
      hasPosition(rocks, rock)
    ) {
      continue;
    }

    rocks.push(rock);
  }
}

function createNewRound() {
  commands = [];

  gridSize = levels[levelIndex].gridSize;
  rockCount = levels[levelIndex].rockCount;

  setupGridSize();

  let attempts = 0;

  do {
    createRandomLevel();
    attempts++;
  } while (!hasPathToHeart() && attempts < 100);

  setMessage('VIE ROBO SYDÄMEEN');
  render();
  safeSound('playNewRoundSound');
}

function nextLevel() {
  levelIndex++;

  if (levelIndex >= levels.length) {
    levelIndex = 0;
  }

  createNewRound();
}

function renderGrid() {
  gridElement.innerHTML = '';

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cell = document.createElement('div');
      cell.className = 'cell';

      const position = { x, y };
      const isRobot = samePosition(robot, position);
      const isHeart = samePosition(heart, position);
      const rockHere = isRock(position);

      if (isRobot) cell.classList.add('robot');
      if (isHeart) cell.classList.add('heart');
      if (rockHere) cell.classList.add('rock');

      if (isRobot && isHeart) {
        cell.classList.add('heart');
        cell.textContent = '❤️';
      } else if (isRobot) {
        cell.textContent = '🤖';
      } else if (isHeart) {
        cell.textContent = '❤️';
      } else if (rockHere) {
        cell.textContent = '⬛';
      } else {
        cell.textContent = '';
      }

      gridElement.appendChild(cell);
    }
  }
}

function renderCommandQueue() {
  commandQueueElement.innerHTML = '';

  if (commands.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'queue-empty';
    empty.textContent = 'EI KOMENTOJA';
    commandQueueElement.appendChild(empty);
    return;
  }

  commands.forEach((command) => {
    const item = document.createElement('div');
    item.className = 'queue-item';
    item.textContent = commandIcons[command];
    commandQueueElement.appendChild(item);
  });
}

function render() {
  renderGrid();
  renderCommandQueue();
}

function addCommand(command) {
  if (isRunning) return;

  if (commands.length >= maxCommands) {
    setMessage('JONO TÄYNNÄ');
    safeSound('playWrongSound');
    return;
  }

  commands.push(command);
  setMessage('HYVÄ');
  renderCommandQueue();
  safeSound('playClickSound');
}

function removeLastCommand() {
  if (isRunning) return;

  if (commands.length === 0) {
    setMessage('EI POISTETTAVAA');
    safeSound('playWrongSound');
    return;
  }

  commands.pop();
  setMessage('POISTETTU');
  renderCommandQueue();
  safeSound('playSoftPopSound');
}

function getRobotCell() {
  const index = robot.y * gridSize + robot.x;
  return gridElement.children[index];
}

function bumpRobot() {
  const robotCell = getRobotCell();

  if (!robotCell) return;

  robotCell.classList.remove('bump');

  requestAnimationFrame(() => {
    robotCell.classList.add('bump');
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runCommands() {
  if (isRunning) return;

  if (commands.length === 0) {
    setMessage('VALITSE KOMENNOT');
    safeSound('playWrongSound');
    return;
  }

  isRunning = true;
  runButton.classList.add('running');
  setMessage('ROBO MENEE');

  const commandsToRun = [...commands];
  commands = [];
  renderCommandQueue();

  for (const command of commandsToRun) {
    const move = commandMoves[command];

    const nextPosition = {
      x: robot.x + move.x,
      y: robot.y + move.y
    };

    const hitsWall = !isInsideGrid(nextPosition);
    const hitsRock = isRock(nextPosition);

    if (hitsWall || hitsRock) {
      setMessage(hitsRock ? 'OHO KIVI' : 'OHO SEINÄ');
      bumpRobot();
      safeSound('playWrongSound');
      break;
    }

    robot = nextPosition;
    renderGrid();
    safeSound('playClickSound');

    await wait(420);

    if (samePosition(robot, heart)) {
      setMessage('HIENOA');
      safeSound('playWinSound');

      await wait(900);
      nextLevel();

      isRunning = false;
      runButton.classList.remove('running');
      return;
    }
  }

  if (!samePosition(robot, heart)) {
    setMessage('JATKA TÄSTÄ');
  }

  isRunning = false;
  runButton.classList.remove('running');
}

document.querySelectorAll('.command-button').forEach((button) => {
  button.addEventListener('click', () => {
    addCommand(button.dataset.command);
  });
});

removeButton.addEventListener('click', removeLastCommand);
runButton.addEventListener('click', runCommands);

createNewRound();