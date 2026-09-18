const words = [
  { word: 'KALA', symbol: '🐟' },
  { word: 'TALO', symbol: '🏠' },
  { word: 'AUTO', symbol: '🚗' },
  { word: 'KUU', symbol: '🌙' },
  { word: 'AURINKO', symbol: '☀️' },
  { word: 'PUU', symbol: '🌲' },
  { word: 'KOIRA', symbol: '🐕' },
  { word: 'KISSA', symbol: '🐈' },
  { word: 'TÄHTI', symbol: '⭐' },
  { word: 'OMENA', symbol: '🍎' }
];

const alphabet = [
  'A', 'D', 'E', 'H', 'I',
  'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'R', 'S', 'T',
  'U', 'V', 'Y', 'Ä', 'Ö'
];

const symbolElement = document.getElementById('symbol');
const wordElement = document.getElementById('word');
const slotsElement = document.getElementById('slots');
const alphabetElement = document.getElementById('alphabet');
const messageElement = document.getElementById('message');

let currentWord = null;
let currentIndex = 0;
let lastWordIndex = -1;
let locked = false;

function playSound(name) {
  const fn = window[name];

  if (typeof fn === 'function') {
    fn();
  }
}

function pickWord() {
  let index = Math.floor(Math.random() * words.length);

  if (words.length > 1) {
    while (index === lastWordIndex) {
      index = Math.floor(Math.random() * words.length);
    }
  }

  lastWordIndex = index;
  return words[index];
}

function startRound() {
  currentWord = pickWord();
  currentIndex = 0;
  locked = false;

  symbolElement.textContent = currentWord.symbol;
  wordElement.textContent = currentWord.word;
  messageElement.textContent = 'ETSI KIRJAIMET';

  renderSlots();
  renderAlphabet();

  playSound('playNewRoundSound');
}

function renderSlots() {
  slotsElement.innerHTML = '';

  for (let i = 0; i < currentWord.word.length; i++) {
    const slot = document.createElement('div');
    slot.className = 'slot';
    slot.textContent = i < currentIndex ? currentWord.word[i] : '';
    slotsElement.appendChild(slot);
  }
}

function renderAlphabet() {
  alphabetElement.innerHTML = '';

  alphabet.forEach(letter => {
    const button = document.createElement('button');
    button.className = 'letter-button';
    button.type = 'button';
    button.textContent = letter;
    button.dataset.letter = letter;
    button.addEventListener('click', () => handleLetterClick(letter, button));

    alphabetElement.appendChild(button);
  });
}

function getButtonForLetter(letter) {
  return alphabetElement.querySelector(`[data-letter="${letter}"]`);
}

function handleLetterClick(letter, button) {
  if (locked || !currentWord) return;

  playSound('playClickSound');

  const correctLetter = currentWord.word[currentIndex];

  if (letter === correctLetter) {
    handleCorrectLetter(button);
  } else {
    handleWrongLetter(button);
  }
}

function handleCorrectLetter(button) {
  button.classList.add('correct');

  currentIndex++;
  renderSlots();

  const latestSlot = slotsElement.children[currentIndex - 1];

  if (latestSlot) {
    latestSlot.classList.add('filled');
  }

  playSound('playCorrectSound');

  if (currentIndex >= currentWord.word.length) {
    finishWord();
  } else {
    setTimeout(() => {
      button.classList.remove('correct');
    }, 250);
  }
}

function handleWrongLetter(button) {
  button.classList.remove('wrong');
  void button.offsetWidth;
  button.classList.add('wrong');

  messageElement.textContent = 'KOKEILE UUDESTAAN';

  playSound('playWrongSound');

  setTimeout(() => {
    button.classList.remove('wrong');
    messageElement.textContent = 'ETSI KIRJAIMET';
  }, 650);
}

function handleKeyboardPress(event) {
  if (locked || !currentWord) return;

  const letter = event.key.toUpperCase();

  if (!alphabet.includes(letter)) return;

  event.preventDefault();

  const button = getButtonForLetter(letter);

  if (!button) return;

  handleLetterClick(letter, button);
}

function finishWord() {
  locked = true;
  messageElement.textContent = 'OIKEIN';

  playSound('playWinSound');

  setTimeout(() => {
    messageElement.textContent = 'UUDESTAAN';
  }, 900);

  setTimeout(() => {
    startRound();
  }, 1500);
}

document.addEventListener('keydown', handleKeyboardPress);

startRound();