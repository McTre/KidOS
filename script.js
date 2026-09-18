const apps = {
  colors: {
    title: 'VÄRIT',
    url: './apps/colors/index.html'
  },
  numbers: {
    title: 'NUMEROT',
    url: './apps/numbers/index.html'
  },
  programming: {
    title: 'OHJELMOINTI',
    url: './apps/programming/index.html'
  },
  letters: {
    title: 'KIRJAIMET',
    url: './apps/letters/index.html'
  },
  music: {
    title: 'MUSIIKKI',
    url: './apps/music/index.html'
  },
  story: {
    title: 'TARINA',
    url: './apps/story/index.html'
  },
  photos: {
    title: 'KUVAT',
    url: './apps/photos/index.html'
  },
  coloring: {
    title: 'VÄRITYS',
    url: './apps/coloring/index.html'
  },
  call: {
    title: 'SOITA',
    url: './apps/call/index.html'
  },
  robotchallenge: {
    title: 'ROBOHAASTE',
    url: './apps/robot-challenge/index.html'
  }
};

const appWindow = document.getElementById('appWindow');
const appFrame = document.getElementById('appFrame');
const windowTitle = document.getElementById('windowTitle');
const closeButton = document.getElementById('closeButton');

const lockOverlay = document.getElementById('lockOverlay');
const lockFrame = document.getElementById('lockFrame');
const lockButtons = document.querySelectorAll('.lock-button');

document.querySelectorAll('.app-button').forEach((button) => {
  button.addEventListener('click', () => {
    openApp(button.dataset.app);
  });
});

if (closeButton) {
  closeButton.addEventListener('click', closeApp);
}

lockButtons.forEach((button) => {
  button.addEventListener('click', lockKidOS);
});

window.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') {
    return;
  }

  if (lockOverlay && lockOverlay.classList.contains('open')) {
    return;
  }

  closeApp();
});

window.addEventListener('message', (event) => {
  if (!event.data || event.data.type !== 'KIDOS_UNLOCK') {
    return;
  }

  unlockKidOS();
});

function openApp(appName) {
  const app = apps[appName];

  if (!app || !appWindow || !appFrame || !windowTitle) {
    return;
  }

  windowTitle.textContent = app.title;

  const cacheBuster = Date.now();
  appFrame.src = `${app.url}?v=${cacheBuster}`;

  appWindow.classList.add('open');
  appWindow.setAttribute('aria-hidden', 'false');

  playDesktopSound('open');
}

function closeApp() {
  if (!appWindow || !appFrame) {
    return;
  }

  appWindow.classList.remove('open');
  appWindow.setAttribute('aria-hidden', 'true');
  appFrame.src = 'about:blank';

  playDesktopSound('close');
}

function lockKidOS() {
  if (!lockOverlay || !lockFrame) {
    return;
  }

  closeApp();

  const cacheBuster = Date.now();
  lockFrame.src = `./apps/lock/index.html?v=${cacheBuster}`;

  lockOverlay.classList.add('open');
  lockOverlay.setAttribute('aria-hidden', 'false');

  playDesktopSound('open');
}

function unlockKidOS() {
  if (!lockOverlay || !lockFrame) {
    return;
  }

  lockFrame.src = 'about:blank';

  lockOverlay.classList.remove('open');
  lockOverlay.setAttribute('aria-hidden', 'true');

  playDesktopSound('close');
}

function playDesktopSound(type) {
  if (type === 'open' && typeof playOpenSound === 'function') {
    playOpenSound();
  }

  if (type === 'close' && typeof playCloseSound === 'function') {
    playCloseSound();
  }
}