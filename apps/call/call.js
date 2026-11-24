const views = {
  adult: document.getElementById('adultView'),
  opened: document.getElementById('openedView')
};

const holdButton = document.getElementById('holdButton');
const holdProgress = document.getElementById('holdProgress');
const codeInput = document.getElementById('codeInput');
const childNameInput = document.getElementById('childNameInput');
const errorText = document.getElementById('errorText');
const newCallButton = document.getElementById('newCallButton');

// Puhelut kulkevat Neukkarin kautta (onkoauki.fi/neukkari). Kehityskonetta varten osoitteen voi vaihtaa selaimen
// konsolissa: localStorage.setItem('kidos-call-server', 'http://192.168.x.x:8080').
const DEFAULT_SERVER = 'https://onkoauki.fi';
const SERVER_KEY = 'kidos-call-server';
const CHILD_NAME_KEY = 'kidos-call-child-name';

const holdDurationMs = 3000;
let holdTimer = null;
let holdStartedAt = 0;
let holdTick = null;
let pendingCallUrl = '';

if (holdButton) {
  holdButton.addEventListener('pointerdown', startHold);
  holdButton.addEventListener('pointerup', stopHold);
  holdButton.addEventListener('pointerleave', stopHold);
  holdButton.addEventListener('pointercancel', stopHold);
}

if (codeInput) {
  codeInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      startOpenHoldFromKeyboard();
    }
  });

  codeInput.addEventListener('input', () => {
    pendingCallUrl = '';
    clearError();
  });
}

if (childNameInput) {
  childNameInput.value = readStorage(CHILD_NAME_KEY) || '';
  childNameInput.addEventListener('input', () => {
    writeStorage(CHILD_NAME_KEY, childNameInput.value.trim());
  });
}

if (newCallButton) {
  newCallButton.addEventListener('click', () => {
    playSound('open');
    clearCodeInput();
    showView('adult');
  });
}

function showView(name) {
  Object.values(views).forEach((view) => {
    if (view) {
      view.classList.remove('active');
    }
  });

  if (views[name]) {
    views[name].classList.add('active');
  }

  if (name === 'adult' && codeInput) {
    setTimeout(() => codeInput.focus(), 80);
  }
}

function startOpenHoldFromKeyboard() {
  const callUrl = buildCallUrl();

  if (!callUrl) {
    return;
  }

  openCall(callUrl);
}

function startHold(event) {
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }

  stopHold();

  pendingCallUrl = buildCallUrl();
  if (!pendingCallUrl) {
    return;
  }

  holdStartedAt = Date.now();

  if (holdButton) {
    holdButton.classList.add('holding');
  }

  updateHoldProgress();
  holdTick = setInterval(updateHoldProgress, 100);

  holdTimer = setTimeout(() => {
    const callUrl = pendingCallUrl;
    stopHold(false);
    openCall(callUrl);
  }, holdDurationMs);
}

function stopHold(resetProgress = true) {
  if (holdTimer) {
    clearTimeout(holdTimer);
    holdTimer = null;
  }

  if (holdTick) {
    clearInterval(holdTick);
    holdTick = null;
  }

  if (holdButton) {
    holdButton.classList.remove('holding');
  }

  if (resetProgress && holdProgress) {
    holdProgress.textContent = '3';
  }
}

function updateHoldProgress() {
  if (!holdProgress) {
    return;
  }

  const elapsed = Date.now() - holdStartedAt;
  const remaining = Math.max(0, Math.ceil((holdDurationMs - elapsed) / 1000));
  holdProgress.textContent = String(remaining);
}

function buildCallUrl() {
  const code = normalizeCallCode(codeInput ? codeInput.value : '');

  if (!code) {
    showError('TARKISTA KOODI');
    playSound('wrong');
    return '';
  }

  clearError();

  const server = (readStorage(SERVER_KEY) || DEFAULT_SERVER).replace(/\/+$/, '');
  const params = new URLSearchParams({
    koodi: code,
    nimi: childNameInput ? childNameInput.value.trim() : ''
  });

  return `${server}/neukkari/pikaliity?${params.toString()}`;
}

function openCall(callUrl) {
  // Ei noopener-ominaisuutta: sen kanssa window.open palauttaa aina null. Puhelusivu sulkee ikkunansa itse
  // punaisesta luurista, jolloin KidOS on taas näkyvissä (toimii myös Chromiumin kioskitilassa).
  const openedWindow = window.open(callUrl, 'kidos-call');

  if (!openedWindow) {
    showError('SELAIN ESTI AVAUKSEN');
    playSound('wrong');
    return;
  }

  openedWindow.opener = null;
  playSound('win');
  showView('opened');
}

// Neukkarin liittymiskoodi on kolme sanaa (esim. "sauna kettu pilvi"). Palvelin hyväksyy välit, viivat tai sanat
// peräkkäin, joten tässä vain siistitään ja tarkistetaan, että kirjaimia on tarpeeksi.
function normalizeCallCode(value) {
  const code = value
    .trim()
    .toLowerCase()
    .replace(/[^a-zåäö]+/g, ' ')
    .trim()
    .replace(/ /g, '-');

  return code.replace(/-/g, '').length >= 6 ? code : '';
}

function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // Tallennus ei ole pakollinen.
  }
}

function clearCodeInput() {
  pendingCallUrl = '';

  if (codeInput) {
    codeInput.value = '';
  }

  clearError();
}

function clearError() {
  if (errorText) {
    errorText.textContent = '';
  }
}

function showError(message) {
  if (errorText) {
    errorText.textContent = message;
  }
}

function playSound(type) {
  if (type === 'open' && typeof playOpenSound === 'function') {
    playOpenSound();
  }

  if (type === 'close' && typeof playCloseSound === 'function') {
    playCloseSound();
  }

  if (type === 'correct' && typeof playCorrectSound === 'function') {
    playCorrectSound();
  }

  if (type === 'wrong' && typeof playWrongSound === 'function') {
    playWrongSound();
  }

  if (type === 'win' && typeof playWinSound === 'function') {
    playWinSound();
  }
}

showView('adult');
