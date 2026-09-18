const paletteColors = [
  '#ff5d73',
  '#ffad4d',
  '#ffd54a',
  '#67dc8a',
  '#59a8ff',
  '#b185ff',
  '#8b5e3c',
  '#ffffff'
];

const pictures = [
  {
    name: 'TALO',
    svg: `
      <svg viewBox="0 0 900 700" aria-label="Talo">
        <rect x="0" y="0" width="900" height="700" fill="#f7fbff" />
        <circle class="fillable" data-part="sun" cx="730" cy="130" r="70" fill="#ffffff" stroke="#203243" stroke-width="8" />
        <rect class="fillable" data-part="grass" x="0" y="520" width="900" height="180" fill="#ffffff" stroke="#203243" stroke-width="8" />

        <polygon class="fillable" data-part="roof" points="220,280 450,120 680,280" fill="#ffffff" stroke="#203243" stroke-width="8" stroke-linejoin="round" />
        <rect class="fillable" data-part="wall" x="250" y="280" width="400" height="220" rx="8" fill="#ffffff" stroke="#203243" stroke-width="8" />
        <rect class="fillable" data-part="door" x="410" y="365" width="80" height="135" rx="8" fill="#ffffff" stroke="#203243" stroke-width="8" />
        <rect class="fillable" data-part="window-left" x="305" y="335" width="82" height="82" rx="8" fill="#ffffff" stroke="#203243" stroke-width="8" />
        <rect class="fillable" data-part="window-right" x="515" y="335" width="82" height="82" rx="8" fill="#ffffff" stroke="#203243" stroke-width="8" />

        <line class="outline" x1="346" y1="335" x2="346" y2="417" />
        <line class="outline" x1="305" y1="376" x2="387" y2="376" />
        <line class="outline" x1="556" y1="335" x2="556" y2="417" />
        <line class="outline" x1="515" y1="376" x2="597" y2="376" />

        <circle cx="470" cy="432" r="6" fill="#203243" />
      </svg>
    `
  },
  {
    name: 'AUTO',
    svg: `
      <svg viewBox="0 0 900 700" aria-label="Auto">
        <rect x="0" y="0" width="900" height="700" fill="#f7fbff" />
        <rect class="fillable" data-part="road" x="0" y="520" width="900" height="180" fill="#ffffff" stroke="#203243" stroke-width="8" />

        <rect class="fillable" data-part="body" x="230" y="340" width="420" height="120" rx="32" fill="#ffffff" stroke="#203243" stroke-width="8" />
        <polygon class="fillable" data-part="top" points="330,340 420,260 570,260 620,340" fill="#ffffff" stroke="#203243" stroke-width="8" stroke-linejoin="round" />

        <polygon class="fillable" data-part="window-front" points="455,275 560,275 595,335 455,335" fill="#ffffff" stroke="#203243" stroke-width="8" />
        <polygon class="fillable" data-part="window-back" points="350,335 350,290 425,275 425,335" fill="#ffffff" stroke="#203243" stroke-width="8" />

        <circle class="fillable" data-part="wheel-left" cx="330" cy="480" r="52" fill="#ffffff" stroke="#203243" stroke-width="8" />
        <circle class="fillable" data-part="wheel-right" cx="560" cy="480" r="52" fill="#ffffff" stroke="#203243" stroke-width="8" />
        <circle cx="330" cy="480" r="20" fill="#203243" />
        <circle cx="560" cy="480" r="20" fill="#203243" />

        <circle class="fillable" data-part="light-left" cx="255" cy="385" r="18" fill="#ffffff" stroke="#203243" stroke-width="8" />
        <circle class="fillable" data-part="light-right" cx="625" cy="385" r="18" fill="#ffffff" stroke="#203243" stroke-width="8" />
      </svg>
    `
  },
  {
    name: 'KALA',
    svg: `
      <svg viewBox="0 0 900 700" aria-label="Kala">
        <rect x="0" y="0" width="900" height="700" fill="#f7fbff" />

        <rect class="fillable" data-part="water" x="0" y="0" width="900" height="700" fill="#ffffff" stroke="#203243" stroke-width="8" />
        <ellipse class="fillable" data-part="body" cx="430" cy="360" rx="210" ry="120" fill="#ffffff" stroke="#203243" stroke-width="8" />
        <polygon class="fillable" data-part="tail" points="610,360 770,250 770,470" fill="#ffffff" stroke="#203243" stroke-width="8" stroke-linejoin="round" />
        <polygon class="fillable" data-part="fin-top" points="380,255 470,175 520,275" fill="#ffffff" stroke="#203243" stroke-width="8" stroke-linejoin="round" />
        <polygon class="fillable" data-part="fin-bottom" points="390,450 500,445 450,540" fill="#ffffff" stroke="#203243" stroke-width="8" stroke-linejoin="round" />
        <circle class="fillable" data-part="eye-ring" cx="320" cy="330" r="28" fill="#ffffff" stroke="#203243" stroke-width="8" />
        <circle cx="325" cy="333" r="11" fill="#203243" />
        <path class="outline" d="M270 400 Q320 430 380 395" />
        <path class="outline" d="M445 270 Q520 330 445 390" />
        <path class="outline" d="M500 255 Q580 330 500 410" />
      </svg>
    `
  },
  {
    name: 'KUKKA',
    svg: `
      <svg viewBox="0 0 900 700" aria-label="Kukka">
        <rect x="0" y="0" width="900" height="700" fill="#f7fbff" />
        <rect class="fillable" data-part="ground" x="0" y="540" width="900" height="160" fill="#ffffff" stroke="#203243" stroke-width="8" />

        <ellipse class="fillable" data-part="petal-top" cx="450" cy="205" rx="65" ry="85" fill="#ffffff" stroke="#203243" stroke-width="8" />
        <ellipse class="fillable" data-part="petal-right" cx="560" cy="290" rx="65" ry="85" transform="rotate(55 560 290)" fill="#ffffff" stroke="#203243" stroke-width="8" />
        <ellipse class="fillable" data-part="petal-bottom-right" cx="520" cy="420" rx="65" ry="85" transform="rotate(120 520 420)" fill="#ffffff" stroke="#203243" stroke-width="8" />
        <ellipse class="fillable" data-part="petal-bottom-left" cx="380" cy="420" rx="65" ry="85" transform="rotate(-120 380 420)" fill="#ffffff" stroke="#203243" stroke-width="8" />
        <ellipse class="fillable" data-part="petal-left" cx="340" cy="290" rx="65" ry="85" transform="rotate(-55 340 290)" fill="#ffffff" stroke="#203243" stroke-width="8" />
        <circle class="fillable" data-part="center" cx="450" cy="320" r="68" fill="#ffffff" stroke="#203243" stroke-width="8" />

        <rect class="fillable" data-part="stem" x="435" y="388" width="30" height="180" rx="12" fill="#ffffff" stroke="#203243" stroke-width="8" />
        <ellipse class="fillable" data-part="leaf-left" cx="385" cy="470" rx="65" ry="35" transform="rotate(-25 385 470)" fill="#ffffff" stroke="#203243" stroke-width="8" />
        <ellipse class="fillable" data-part="leaf-right" cx="515" cy="505" rx="65" ry="35" transform="rotate(25 515 505)" fill="#ffffff" stroke="#203243" stroke-width="8" />
      </svg>
    `
  }
];

const palette = document.getElementById('palette');
const artCanvas = document.getElementById('artCanvas');
const pictureName = document.getElementById('pictureName');
const pageIndicator = document.getElementById('pageIndicator');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const clearButton = document.getElementById('clearButton');

let selectedColor = paletteColors[0];
let currentPictureIndex = 0;
const pictureStates = pictures.map(() => ({}));

function playSoundSafe(name) {
  if (typeof window[name] === 'function') {
    window[name]();
  }
}

function renderPalette() {
  palette.innerHTML = '';

  paletteColors.forEach(color => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'color-button';
    button.style.background = color;
    button.setAttribute('aria-label', `Väri ${color}`);

    if (color === '#ffffff') {
      button.style.borderColor = 'rgba(32, 50, 67, 0.35)';
    }

    if (color === selectedColor) {
      button.classList.add('selected');
    }

    button.addEventListener('click', () => {
      selectedColor = color;
      playSoundSafe('playClickSound');
      renderPalette();
    });

    palette.appendChild(button);
  });
}

function renderPicture() {
  const picture = pictures[currentPictureIndex];
  const state = pictureStates[currentPictureIndex];

  pictureName.textContent = picture.name;
  pageIndicator.textContent = `${currentPictureIndex + 1} / ${pictures.length}`;
  artCanvas.innerHTML = picture.svg;

  const fillables = artCanvas.querySelectorAll('.fillable');

  fillables.forEach(element => {
    const partName = element.dataset.part;
    const savedColor = state[partName] || '#ffffff';
    element.setAttribute('fill', savedColor);

    element.addEventListener('click', () => {
      state[partName] = selectedColor;
      element.setAttribute('fill', selectedColor);
      playSoundSafe('playSoftPopSound');
    });
  });
}

function goToPreviousPicture() {
  currentPictureIndex = (currentPictureIndex - 1 + pictures.length) % pictures.length;
  playSoundSafe('playClickSound');
  renderPicture();
}

function goToNextPicture() {
  currentPictureIndex = (currentPictureIndex + 1) % pictures.length;
  playSoundSafe('playClickSound');
  renderPicture();
}

function clearCurrentPicture() {
  const state = pictureStates[currentPictureIndex];
  Object.keys(state).forEach(key => {
    delete state[key];
  });

  playSoundSafe('playWrongSound');
  renderPicture();
}

prevButton.addEventListener('click', goToPreviousPicture);
nextButton.addEventListener('click', goToNextPicture);
clearButton.addEventListener('click', clearCurrentPicture);

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') {
    goToPreviousPicture();
  }

  if (event.key === 'ArrowRight') {
    goToNextPicture();
  }
});

renderPalette();
renderPicture();