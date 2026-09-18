const images = [
  { title: 'KISSA', icon: '🐱', color: '#ffd54a' },
  { title: 'KOIRA', icon: '🐶', color: '#67dc8a' },
  { title: 'AUTO', icon: '🚗', color: '#59a8ff' },
  { title: 'TALO', icon: '🏠', color: '#ffad4d' },
  { title: 'KALA', icon: '🐟', color: '#4dd6ff' },
  { title: 'PUU', icon: '🌲', color: '#67dc8a' },
  { title: 'TÄHTI', icon: '⭐', color: '#ffd54a' },
  { title: 'RAKETTI', icon: '🚀', color: '#b185ff' },

  { title: 'PUPU', icon: '🐰', color: '#f4f7fb' },
  { title: 'KUKKA', icon: '🌼', color: '#ffd54a' },
  { title: 'PALLO', icon: '⚽', color: '#f4f7fb' },
  { title: 'LAIVA', icon: '⛵', color: '#59a8ff' },
  { title: 'AURINKO', icon: '☀️', color: '#ffd54a' },
  { title: 'KUU', icon: '🌙', color: '#b185ff' },
  { title: 'SATEENKAARI', icon: '🌈', color: '#ffad4d' },
  { title: 'ROBOTTI', icon: '🤖', color: '#59a8ff' }
];

const imagesPerPage = 8;

const thumbGrid = document.getElementById('thumbGrid');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const pageIndicator = document.getElementById('pageIndicator');

const imageViewer = document.getElementById('imageViewer');
const largeImage = document.getElementById('largeImage');

let currentPage = 0;

function getTotalPages() {
  return Math.max(1, Math.ceil(images.length / imagesPerPage));
}

function playSoundSafe(soundFunctionName) {
  if (typeof window[soundFunctionName] === 'function') {
    window[soundFunctionName]();
  }
}

function renderGallery() {
  thumbGrid.innerHTML = '';

  const totalPages = getTotalPages();
  const startIndex = currentPage * imagesPerPage;
  const visibleImages = images.slice(startIndex, startIndex + imagesPerPage);

  visibleImages.forEach(image => {
    const button = document.createElement('button');
    button.className = 'thumb-card icon-thumb';
    button.type = 'button';
    button.setAttribute('aria-label', image.title);
    button.style.setProperty('--card-color', image.color);

    const icon = document.createElement('div');
    icon.className = 'thumb-icon';
    icon.textContent = image.icon;

    const label = document.createElement('div');
    label.className = 'thumb-label';
    label.textContent = image.title;

    button.appendChild(icon);
    button.appendChild(label);

    button.addEventListener('click', () => {
      playSoundSafe('playSoftPopSound');
      openLargeImage(image);
    });

    thumbGrid.appendChild(button);
  });

  pageIndicator.textContent = `${currentPage + 1} / ${totalPages}`;

  prevButton.classList.toggle('disabled', currentPage === 0);
  nextButton.classList.toggle('disabled', currentPage >= totalPages - 1);
}

function openLargeImage(image) {
  largeImage.innerHTML = '';
  largeImage.style.setProperty('--card-color', image.color);

  const icon = document.createElement('div');
  icon.className = 'large-icon';
  icon.textContent = image.icon;

  const label = document.createElement('div');
  label.className = 'large-label';
  label.textContent = image.title;

  largeImage.appendChild(icon);
  largeImage.appendChild(label);

  imageViewer.classList.remove('hidden');
}

function closeLargeImage() {
  imageViewer.classList.add('hidden');
  largeImage.innerHTML = '';
}

function goToPreviousPage() {
  if (currentPage <= 0) return;

  currentPage -= 1;
  playSoundSafe('playClickSound');
  renderGallery();
}

function goToNextPage() {
  const totalPages = getTotalPages();

  if (currentPage >= totalPages - 1) return;

  currentPage += 1;
  playSoundSafe('playClickSound');
  renderGallery();
}

prevButton.addEventListener('click', goToPreviousPage);
nextButton.addEventListener('click', goToNextPage);

imageViewer.addEventListener('click', () => {
  playSoundSafe('playClickSound');
  closeLargeImage();
});

document.addEventListener('keydown', event => {
  if (!imageViewer.classList.contains('hidden')) {
    if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
      playSoundSafe('playClickSound');
      closeLargeImage();
    }

    return;
  }

  if (event.key === 'ArrowLeft') {
    goToPreviousPage();
  }

  if (event.key === 'ArrowRight') {
    goToNextPage();
  }
});

renderGallery();