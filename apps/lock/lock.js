const passwordKey = 'kidos-symbol-password';

const symbols = [
  { id: 'star', icon: '⭐' },
  { id: 'heart', icon: '❤️' },
  { id: 'car', icon: '🚗' },
  { id: 'moon', icon: '🌙' },
  { id: 'cloud', icon: '☁️' },
  { id: 'flower', icon: '🌸' },
  { id: 'fish', icon: '🐟' },
  { id: 'house', icon: '🏠' },
  { id: 'dog', icon: '🐶' }
];

const defaultPassword = ['star', 'heart', 'car', 'moon'];

let enteredCode = [];
let changeMode = false;

const keypad = document.getElementById('keypad');
const codeDisplay = document.getElementById('codeDisplay');
const message = document.getElementById('message');
const lockIcon = document.getElementById('lockIcon');
const unlockButton = document.getElementById('unlockButton');
const changeButton = document.getElementById('changeButton');
const lockCard = document.querySelector('.lock-card');

function getPassword() {
  const savedPassword = localStorage.getItem(passwordKey);

  if (!savedPassword) {
    localStorage.setItem(passwordKey, JSON.stringify(defaultPassword));
    return defaultPassword;
  }

  try {
    const parsedPassword = JSON.parse(savedPassword);

    if (Array.isArray(parsedPassword) && parsedPassword.length === 4) {
      return parsedPassword;
    }
  } catch (error) {
    // Jos tallennettu salasana on rikki, palautetaan oletussalasana.
  }

  localStorage.setItem(passwordKey, JSON.stringify(defaultPassword));
  return defaultPassword;
}

function savePassword(newPassword) {
  localStorage.setItem(passwordKey, JSON.stringify(newPassword));
}

function playSound(soundName) {
  const soundFunction = window[soundName];

  if (typeof soundFunction === 'function') {
    soundFunction();
  }
}

function setMessage(text, type = '') {
  message.textContent = text;
  message.className = `message ${type}`.trim();
}

function resetEnteredCode() {
  enteredCode = [];
  renderCodeDisplay();
  clearSelectedButtons();
}

function clearSelectedButtons() {
  document.querySelectorAll('.symbol-button').forEach((button) => {
    button.classList.remove('selected');
  });
}

function renderCodeDisplay() {
  const slots = codeDisplay.querySelectorAll('span');

  slots.forEach((slot, index) => {
    const symbolId = enteredCode[index];
    const symbol = symbols.find((item) => item.id === symbolId);

    slot.textContent = symbol ? symbol.icon : '';
    slot.classList.toggle('filled', Boolean(symbol));
  });
}

function renderKeypad() {
  keypad.innerHTML = '';

  symbols.forEach((symbol) => {
    const button = document.createElement('button');
    button.className = 'symbol-button';
    button.type = 'button';
    button.textContent = symbol.icon;
    button.setAttribute('aria-label', symbol.id);

    button.addEventListener('click', () => {
      chooseSymbol(symbol.id, button);
    });

    keypad.appendChild(button);
  });
}

function chooseSymbol(symbolId, button) {
  playSound('playClickSound');

  if (enteredCode.length >= 4) {
    resetEnteredCode();
  }

  enteredCode.push(symbolId);
  button.classList.add('selected');

  renderCodeDisplay();
}

function codesMatch(firstCode, secondCode) {
  return JSON.stringify(firstCode) === JSON.stringify(secondCode);
}

function shakeCard() {
  lockCard.classList.remove('shake');
  void lockCard.offsetWidth;
  lockCard.classList.add('shake');
}

function popCard() {
  lockCard.classList.remove('pop');
  void lockCard.offsetWidth;
  lockCard.classList.add('pop');
}

function unlockKidOS() {
  if (enteredCode.length !== 4) {
    setMessage('NELJÄ KUVAA', 'bad');
    shakeCard();
    playSound('playWrongSound');
    return;
  }

  if (changeMode) {
    savePassword(enteredCode);

    changeMode = false;
    changeButton.classList.remove('active');

    lockIcon.textContent = '🔒';
    lockIcon.classList.remove('open');

    setMessage('UUSI KOODI', 'good');
    popCard();
    playSound('playWinSound');

    setTimeout(() => {
      resetEnteredCode();
      setMessage('ANNA KOODI');
    }, 900);

    return;
  }

  const password = getPassword();

  if (codesMatch(enteredCode, password)) {
    lockIcon.textContent = '🔓';
    lockIcon.classList.add('open');

    setMessage('AUKI', 'good');
    popCard();
    playSound('playWinSound');

    setTimeout(() => {
      window.parent.postMessage(
        {
          type: 'KIDOS_UNLOCK'
        },
        '*'
      );
    }, 700);

    return;
  }

  setMessage('EI AUKEA', 'bad');
  shakeCard();
  playSound('playWrongSound');

  setTimeout(() => {
    resetEnteredCode();
    setMessage('ANNA KOODI');
  }, 850);
}

function toggleChangeMode() {
  changeMode = !changeMode;

  resetEnteredCode();
  playSound('playClickSound');

  if (changeMode) {
    changeButton.classList.add('active');
    lockIcon.textContent = '🔑';
    lockIcon.classList.remove('open');
    setMessage('UUSI KOODI', 'change');
    return;
  }

  changeButton.classList.remove('active');
  lockIcon.textContent = '🔒';
  lockIcon.classList.remove('open');
  setMessage('ANNA KOODI');
}

unlockButton.addEventListener('click', unlockKidOS);
changeButton.addEventListener('click', toggleChangeMode);

renderKeypad();
renderCodeDisplay();
getPassword();