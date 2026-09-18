let sharedAudioContext = null;

function getAudioContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;

  if (!sharedAudioContext) {
    sharedAudioContext = new AudioContext();
  }

  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume();
  }

  return sharedAudioContext;
}

function playTone(frequency, duration, type = 'sine', volume = 0.045) {
  const audio = getAudioContext();
  if (!audio) return;

  const oscillator = audio.createOscillator();
  const gain = audio.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audio.currentTime);

  gain.gain.setValueAtTime(volume, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);

  oscillator.connect(gain);
  gain.connect(audio.destination);

  oscillator.start();
  oscillator.stop(audio.currentTime + duration);
}

function playClickSound() {
  playTone(420, 0.045, 'triangle', 0.035);
}

function playOpenSound() {
  playTone(330, 0.07, 'sine', 0.035);
  setTimeout(() => playTone(440, 0.08, 'sine', 0.035), 80);
}

function playCloseSound() {
  playTone(330, 0.06, 'sine', 0.03);
  setTimeout(() => playTone(220, 0.08, 'sine', 0.03), 70);
}

function playCorrectSound() {
  playTone(523, 0.09, 'triangle', 0.045);
  setTimeout(() => playTone(659, 0.09, 'triangle', 0.045), 100);
  setTimeout(() => playTone(784, 0.12, 'triangle', 0.045), 200);
}

function playWrongSound() {
  playTone(150, 0.13, 'square', 0.025);
  setTimeout(() => playTone(105, 0.16, 'square', 0.022), 120);
}

function playNewRoundSound() {
  playTone(392, 0.055, 'sine', 0.03);
  setTimeout(() => playTone(523, 0.065, 'sine', 0.03), 70);
}

function playSoftPopSound() {
  playTone(260, 0.035, 'triangle', 0.025);
}

function playWinSound() {
  playTone(523, 0.09, "triangle", 0.045);
  setTimeout(() => playTone(659, 0.09, "triangle", 0.045), 110);
  setTimeout(() => playTone(784, 0.13, "triangle", 0.045), 220);
}