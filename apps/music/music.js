const keys = [
  { id: 'C', label: 'DO', frequency: 261.63, color: '#ff5d73', letter: 'D' },
  { id: 'D', label: 'RE', frequency: 293.66, color: '#ffad4d', letter: 'F' },
  { id: 'E', label: 'MI', frequency: 329.63, color: '#ffd54a', letter: 'G' },
  { id: 'F', label: 'FA', frequency: 349.23, color: '#67dc8a', letter: 'H' },
  { id: 'G', label: 'SO', frequency: 392.0, color: '#59a8ff', letter: 'J' },
  { id: 'A', label: 'LA', frequency: 440.0, color: '#b185ff', letter: 'K' }
];

const songs = [
  {
    id: 'twinkle',
    symbol: '⭐',
    notes: [
      n('C'), n('C'), n('G'), n('G'), n('A'), n('A'), n('G', 2),
      n('F'), n('F'), n('E'), n('E'), n('D'), n('D'), n('C', 2),
      n('G'), n('G'), n('F'), n('F'), n('E'), n('E'), n('D', 2),
      n('G'), n('G'), n('F'), n('F'), n('E'), n('E'), n('D', 2),
      n('C'), n('C'), n('G'), n('G'), n('A'), n('A'), n('G', 2),
      n('F'), n('F'), n('E'), n('E'), n('D'), n('D'), n('C', 2)
    ]
  },
  {
    id: 'ukko-nooa',
    symbol: '👴',
    notes: [
      n('C'), n('C'), n('C'), n('E'),
      n('D'), n('D'), n('D'), n('F'),
      n('E'), n('E'), n('D'), n('D'),
      n('C', 2),
  
      n('E'), n('E'), n('F'), n('F'),
      n('G', 2), n('D', 2),
      n('C'), n('C'), n('D'), n('D'),
      n('E', 2), n('C', 2),
  
      n('C'), n('C'), n('C'), n('E'),
      n('D'), n('D'), n('D'), n('F'),
      n('E'), n('E'), n('D'), n('D'),
      n('C', 2)
    ]
  },
  {
    id: 'hamahakki',
    symbol: '🕷️',
    notes: [
      n('C'), n('C'), n('C'), n('D'), n('E'), n('E'),
      n('D'), n('C'), n('D'), n('E'), n('C', 2),
  
      n('E'), n('E'), n('E'), n('F'), n('G'), n('G'),
      n('F'), n('E'), n('F'), n('G'), n('E', 2),
  
      n('G', 2), n('G'), n('G'), n('F'), n('F'),
      n('E'), n('E'), n('E'), n('E'), n('D', 2),
  
      n('C'), n('C'), n('C'), n('D'), n('E'), n('E'),
      n('D'), n('C'), n('D'), n('E'), n('C', 2)
    ]
  }
];

const noteLanes = document.getElementById('noteLanes');
const keyboard = document.getElementById('keyboard');
const message = document.getElementById('message');
const restartButton = document.getElementById('restartButton');

const prevSongButton = document.getElementById('prevSongButton');
const nextSongButton = document.getElementById('nextSongButton');
const songSymbol = document.getElementById('songSymbol');

let audioContext = null;
let currentSongIndex = 0;
let songIndex = 0;
let noteElements = new Map();

function n(note, length = 1) {
  return { note, length };
}

function getCurrentSong() {
  return songs[currentSongIndex];
}

function getCurrentNotes() {
  return getCurrentSong().notes;
}

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  return audioContext;
}

function playPianoTone(frequency, length = 1) {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const duration = 0.22 + length * 0.18;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.35, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(now);
  oscillator.stop(now + duration + 0.04);
}

function playFinishMelody() {
  const ctx = getAudioContext();
  const melody = [
    { note: 'C', delay: 0 },
    { note: 'E', delay: 0.13 },
    { note: 'G', delay: 0.26 },
    { note: 'A', delay: 0.39 }
  ];

  melody.forEach(item => {
    const key = keys.find(k => k.id === item.note);
    if (!key) return;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = ctx.currentTime + item.delay;

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(key.frequency, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.28, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(start);
    oscillator.stop(start + 0.4);
  });
}

function createLayout() {
  noteLanes.innerHTML = '';
  keyboard.innerHTML = '';

  keys.forEach(key => {
    const lane = document.createElement('div');
    lane.className = 'lane';
    lane.dataset.note = key.id;
    noteLanes.appendChild(lane);

    const button = document.createElement('button');
    button.className = 'key';
    button.type = 'button';
    button.textContent = key.letter;
    button.setAttribute('aria-label', key.label);
    button.style.background = key.color;
    button.dataset.note = key.id;

    button.addEventListener('pointerdown', () => handleKeyPress(key.id));
    keyboard.appendChild(button);
  });
}

function renderSongSymbol() {
  songSymbol.textContent = getCurrentSong().symbol;

  songSymbol.classList.remove('changed');
  void songSymbol.offsetWidth;
  songSymbol.classList.add('changed');
}

function clearNotes() {
  noteElements.forEach(element => element.remove());
  noteElements.clear();
}

function renderNotes() {
  const song = getCurrentNotes();
  const visibleCount = 7;

  const visibleNotes = song
    .map((item, index) => ({
      note: item.note,
      length: item.length,
      index
    }))
    .filter(item => item.index >= songIndex && item.index < songIndex + visibleCount);

  const visibleIds = new Set(visibleNotes.map(item => String(item.index)));

  noteElements.forEach((element, id) => {
    if (!visibleIds.has(id)) {
      element.classList.add('done');
      setTimeout(() => element.remove(), 180);
      noteElements.delete(id);
    }
  });

  visibleNotes.forEach((item, visiblePosition) => {
    const key = keys.find(k => k.id === item.note);
    if (!key) return;

    let element = noteElements.get(String(item.index));

    if (!element) {
      element = document.createElement('div');
      element.className = 'note-block';
      element.style.background = key.color;

      const lane = noteLanes.querySelector(`[data-note="${item.note}"]`);
      lane.appendChild(element);

      noteElements.set(String(item.index), element);
    }

    element.style.bottom = `${18 + visiblePosition * 76}px`;
    element.style.height = item.length > 1 ? 'min(92px, 15vh)' : 'min(68px, 11vh)';
    element.classList.toggle('next', visiblePosition === 0);
  });
}

function flashKey(noteId, isCorrect) {
  const button = keyboard.querySelector(`[data-note="${noteId}"]`);
  if (!button) return;

  button.classList.add('pressed');

  if (isCorrect) {
    button.classList.add('correct');
  }

  setTimeout(() => {
    button.classList.remove('pressed');
    button.classList.remove('correct');
  }, 220);
}

function handleKeyPress(noteId) {
  const key = keys.find(k => k.id === noteId);
  if (!key) return;

  const song = getCurrentNotes();

  if (songIndex >= song.length) {
    playPianoTone(key.frequency, 1);
    flashKey(noteId, false);
    message.textContent = 'UUDESTAAN';
    return;
  }

  const expectedItem = song[songIndex];
  const expectedNote = expectedItem.note;
  const isCorrect = noteId === expectedNote;

  playPianoTone(key.frequency, isCorrect ? expectedItem.length : 1);
  flashKey(noteId, isCorrect);

  if (!isCorrect) {
    message.textContent = 'KOKEILE ÄÄNIÄ';
    return;
  }

  songIndex += 1;

  if (songIndex >= song.length) {
    message.textContent = 'HIENOSTI SOITETTU';
    restartButton.classList.add('finished');
    renderNotes();
    playFinishMelody();

    if (typeof playWinSound === 'function') {
      playWinSound();
    }

    return;
  }

  message.textContent = 'OIKEIN';
  renderNotes();
}

function restartSong() {
  songIndex = 0;
  clearNotes();

  message.textContent = 'PAINA VÄRINAPPIA';
  restartButton.classList.remove('finished');
  renderSongSymbol();
  renderNotes();

  if (typeof playNewRoundSound === 'function') {
    playNewRoundSound();
  }
}

function changeSong(direction) {
  currentSongIndex += direction;

  if (currentSongIndex < 0) {
    currentSongIndex = songs.length - 1;
  }

  if (currentSongIndex >= songs.length) {
    currentSongIndex = 0;
  }

  restartSong();
}

function handleKeyboardPress(event) {
  if (event.repeat) return;

  const letter = event.key.toUpperCase();
  const key = keys.find(k => k.letter === letter);
  if (!key) return;

  event.preventDefault();
  handleKeyPress(key.id);
}

restartButton.addEventListener('click', restartSong);
prevSongButton.addEventListener('click', () => changeSong(-1));
nextSongButton.addEventListener('click', () => changeSong(1));
document.addEventListener('keydown', handleKeyboardPress);

createLayout();
restartSong();