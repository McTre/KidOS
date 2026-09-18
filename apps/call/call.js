const views = {
  start: document.getElementById('startView'),
  adult: document.getElementById('adultView'),
  opened: document.getElementById('openedView')
};

const childCallButton = document.getElementById('childCallButton');
const backToStartButton = document.getElementById('backToStartButton');
const holdButton = document.getElementById('holdButton');
const holdProgress = document.getElementById('holdProgress');
const meetCodeInput = document.getElementById('meetCodeInput');
const errorText = document.getElementById('errorText');
const newCallButton = document.getElementById('newCallButton');

const holdDurationMs = 3000;
let holdTimer = null;
let holdStartedAt = 0;
let holdTick = null;
let pendingMeetUrl = '';

if (childCallButton) {
  childCallButton.addEventListener('click', () => {
    playSound('correct');
    clearCodeInput();
    showView('adult');
  });
}

if (backToStartButton) {
  backToStartButton.addEventListener('click', () => {
    stopHold();
    playSound('close');
    clearCodeInput();
    showView('start');
  });
}

if (holdButton) {
  holdButton.addEventListener('pointerdown', startHold);
  holdButton.addEventListener('pointerup', stopHold);
  holdButton.addEventListener('pointerleave', stopHold);
  holdButton.addEventListener('pointercancel', stopHold);
}

if (meetCodeInput) {
  meetCodeInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      startOpenHoldFromKeyboard();
    }
  });

  meetCodeInput.addEventListener('input', () => {
    pendingMeetUrl = '';
    clearError();
  });
}

if (newCallButton) {
  newCallButton.addEventListener('click', () => {
    playSound('open');
    clearCodeInput();
    showView('start');
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

  if (name === 'adult' && meetCodeInput) {
    setTimeout(() => meetCodeInput.focus(), 80);
  }
}

function startOpenHoldFromKeyboard() {
  const meetUrl = buildMeetUrl();

  if (!meetUrl) {
    return;
  }

  openMeetCall(meetUrl);
}

function startHold(event) {
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }

  stopHold();

  pendingMeetUrl = buildMeetUrl();
  if (!pendingMeetUrl) {
    return;
  }

  holdStartedAt = Date.now();

  if (holdButton) {
    holdButton.classList.add('holding');
  }

  updateHoldProgress();
  holdTick = setInterval(updateHoldProgress, 100);

  holdTimer = setTimeout(() => {
    const meetUrl = pendingMeetUrl;
    stopHold(false);
    openMeetCall(meetUrl);
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

function buildMeetUrl() {
  const code = normalizeMeetCode(meetCodeInput ? meetCodeInput.value : '');

  if (!code) {
    showError('TARKISTA MEET-KOODI');
    playSound('wrong');
    return '';
  }

  clearError();
  return `https://meet.google.com/${code}`;
}

function openMeetCall(meetUrl) {
  const openedWindow = window.open(meetUrl, '_blank', 'noopener,noreferrer');

  if (!openedWindow) {
    showError('SELAIN ESTI AVAUKSEN');
    playSound('wrong');
    return;
  }

  playSound('win');
  showView('opened');
}

function normalizeMeetCode(value) {
  let code = value.trim().toLowerCase();

  code = code.replace(/^https?:\/\/(www\.)?meet\.google\.com\//, '');
  code = code.split('?')[0];
  code = code.split('#')[0];
  code = code.replace(/\s+/g, '');
  code = code.replace(/[^a-z-]/g, '');

  const lettersOnly = code.replace(/-/g, '');

  if (lettersOnly.length === 10) {
    return `${lettersOnly.slice(0, 3)}-${lettersOnly.slice(3, 7)}-${lettersOnly.slice(7)}`;
  }

  if (/^[a-z]{3}-[a-z]{4}-[a-z]{3}$/.test(code)) {
    return code;
  }

  return '';
}

function clearCodeInput() {
  pendingMeetUrl = '';

  if (meetCodeInput) {
    meetCodeInput.value = '';
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
