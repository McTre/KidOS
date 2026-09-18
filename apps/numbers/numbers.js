const symbolArea = document.getElementById('symbolArea');
const choices = document.getElementById('choices');
const message = document.getElementById('message');

const symbols = ['★', '♥', '✿', '☺', '☁'];

let targetNumber = 1;
let currentSymbol = '★';
let locked = false;

startRound();

function startRound() {
  locked = false;

  targetNumber = randomNumber(1, 9);
  currentSymbol = pickRandom(symbols);

  message.className = 'message';
  message.textContent = 'VALITSE';

  renderSymbols();
  renderChoices();

  playNewRoundSound();
}

function renderSymbols() {
  symbolArea.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'symbol-grid';

  for (let i = 0; i < targetNumber; i++) {
    const symbol = document.createElement('div');
    symbol.className = 'symbol';
    symbol.textContent = currentSymbol;
    grid.appendChild(symbol);
  }

  symbolArea.appendChild(grid);
}

function renderChoices() {
  choices.innerHTML = '';

  const options = makeOptions(targetNumber, 4);

  options.forEach(number => {
    const button = document.createElement('button');
    button.className = 'domino-button';
    button.setAttribute('aria-label', `${number}`);

    button.appendChild(createDomino(number));

    button.addEventListener('click', () => handleChoice(button, number));

    choices.appendChild(button);
  });
}

function handleChoice(button, number) {
  if (locked) return;

  playClickSound();

  if (number === targetNumber) {
    locked = true;

    button.classList.add('correct');
    message.className = 'message good';
    message.textContent = 'OIKEIN';

    playCorrectSound();

    setTimeout(() => {
      message.textContent = 'UUDESTAAN';
    }, 700);

    setTimeout(startRound, 1350);
  } else {
    button.classList.add('wrong');
    button.innerHTML = '<div class="red-x">×</div>';

    message.className = 'message bad';
    message.textContent = 'VÄÄRIN';

    playWrongSound();
  }
}

function createDomino(number) {
  const domino = document.createElement('div');
  domino.className = 'domino';

  const numberPart = document.createElement('div');
  numberPart.className = 'domino-number';
  numberPart.textContent = number;

  const line = document.createElement('div');
  line.className = 'domino-line';

  const dots = document.createElement('div');
  dots.className = 'domino-dots';

  for (let i = 0; i < number; i++) {
    const dot = document.createElement('div');
    dot.className = 'domino-dot';
    dots.appendChild(dot);
  }

  domino.appendChild(numberPart);
  domino.appendChild(line);
  domino.appendChild(dots);

  return domino;
}

function makeOptions(correct, amount) {
  const set = new Set([correct]);

  while (set.size < amount) {
    set.add(randomNumber(1, 9));
  }

  return [...set].sort((a, b) => a - b);
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}