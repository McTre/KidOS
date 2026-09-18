const storyPicture = document.getElementById('storyPicture');
const storyTitle = document.getElementById('storyTitle');
const storyText = document.getElementById('storyText');
const choiceArea = document.getElementById('choiceArea');

let currentSceneId = 'start';

const storyScenes = {
  start: {
    picture: '🤖',
    title: 'ROBO',
    text: 'PIENI ROBO LÖYTÄÄ POLUN.',
    choices: [
      {
        icon: '🌲',
        label: 'METSÄ',
        color: 'green',
        next: 'forest'
      },
      {
        icon: '🕳️',
        label: 'LUOLA',
        color: 'purple',
        next: 'cave'
      },
      {
        icon: '🏠',
        label: 'KOTI',
        color: 'orange',
        next: 'home'
      }
    ]
  },

  forest: {
    picture: '🌲',
    title: 'METSÄ',
    text: 'METSÄSSÄ JOKIN VILKKUU.',
    choices: [
      {
        icon: '🐦',
        label: 'LINTU',
        color: 'blue',
        next: 'bird'
      },
      {
        icon: '⭐',
        label: 'TÄHTI',
        color: 'yellow',
        next: 'star'
      },
      {
        icon: '🤖',
        label: 'ROBO',
        color: 'neutral',
        next: 'start'
      }
    ]
  },

  cave: {
    picture: '🕳️',
    title: 'LUOLA',
    text: 'LUOLASSA ON PIMEÄÄ.',
    choices: [
      {
        icon: '🔦',
        label: 'VALO',
        color: 'yellow',
        next: 'light'
      },
      {
        icon: '🪨',
        label: 'KIVI',
        color: 'neutral',
        next: 'rock'
      },
      {
        icon: '🤖',
        label: 'ROBO',
        color: 'blue',
        next: 'start'
      }
    ]
  },

  home: {
    picture: '🏠',
    title: 'KOTI',
    text: 'KOTONA ROBO LATAA AKUN.',
    choices: [
      {
        icon: '🔋',
        label: 'LATAA',
        color: 'green',
        next: 'start'
      },
      {
        icon: '🎵',
        label: 'LAULU',
        color: 'purple',
        next: 'song'
      },
      {
        icon: '⭐',
        label: 'TÄHTI',
        color: 'yellow',
        next: 'star'
      }
    ]
  },

  bird: {
    picture: '🐦',
    title: 'LINTU',
    text: 'LINTU NÄYTTÄÄ TIEN.',
    choices: [
      {
        icon: '➡️',
        label: 'MENE',
        color: 'green',
        next: 'star'
      },
      {
        icon: '🌲',
        label: 'METSÄ',
        color: 'green',
        next: 'forest'
      },
      {
        icon: '🏠',
        label: 'KOTI',
        color: 'orange',
        next: 'home'
      }
    ]
  },

  light: {
    picture: '🔦',
    title: 'VALO',
    text: 'VALO NÄYTTÄÄ PIENEN KARTAN.',
    choices: [
      {
        icon: '🗺️',
        label: 'KARTTA',
        color: 'blue',
        next: 'map'
      },
      {
        icon: '🕳️',
        label: 'LUOLA',
        color: 'purple',
        next: 'cave'
      },
      {
        icon: '⭐',
        label: 'TÄHTI',
        color: 'yellow',
        next: 'star'
      }
    ]
  },

  rock: {
    picture: '🪨',
    title: 'KIVI',
    text: 'KIVEN ALLA ON NAPPI.',
    choices: [
      {
        icon: '🔴',
        label: 'NAPPI',
        color: 'red',
        next: 'button'
      },
      {
        icon: '🔦',
        label: 'VALO',
        color: 'yellow',
        next: 'light'
      },
      {
        icon: '🤖',
        label: 'ROBO',
        color: 'blue',
        next: 'start'
      }
    ]
  },

  button: {
    picture: '🔴',
    title: 'NAPPI',
    text: 'NAPPI SANOO PIIP.',
    choices: [
      {
        icon: '🎵',
        label: 'PIIP',
        color: 'purple',
        next: 'song'
      },
      {
        icon: '⭐',
        label: 'TÄHTI',
        color: 'yellow',
        next: 'star'
      },
      {
        icon: '🕳️',
        label: 'LUOLA',
        color: 'neutral',
        next: 'cave'
      }
    ]
  },

  map: {
    picture: '🗺️',
    title: 'KARTTA',
    text: 'KARTTA NÄYTTÄÄ TÄHDEN.',
    choices: [
      {
        icon: '⭐',
        label: 'TÄHTI',
        color: 'yellow',
        next: 'star'
      },
      {
        icon: '🌲',
        label: 'METSÄ',
        color: 'green',
        next: 'forest'
      },
      {
        icon: '🏠',
        label: 'KOTI',
        color: 'orange',
        next: 'home'
      }
    ]
  },

  song: {
    picture: '🎵',
    title: 'LAULU',
    text: 'ROBO LAULAA PIIP PIIP.',
    choices: [
      {
        icon: '👏',
        label: 'HYVÄ',
        color: 'green',
        next: 'star'
      },
      {
        icon: '🔁',
        label: 'UUSI',
        color: 'blue',
        next: 'start'
      },
      {
        icon: '🏠',
        label: 'KOTI',
        color: 'orange',
        next: 'home'
      }
    ]
  },

  star: {
    picture: '⭐',
    title: 'TÄHTI',
    text: 'ROBO LÖYSI TÄHDEN.',
    choices: [
      {
        icon: '🎉',
        label: 'JUHLA',
        color: 'purple',
        next: 'party'
      },
      {
        icon: '🔁',
        label: 'UUSI',
        color: 'blue',
        next: 'start'
      },
      {
        icon: '🏠',
        label: 'KOTI',
        color: 'orange',
        next: 'home'
      }
    ]
  },

  party: {
    picture: '🎉',
    title: 'JUHLA',
    text: 'KAIKKI TANSSIVAT.',
    choices: [
      {
        icon: '🤖',
        label: 'ROBO',
        color: 'blue',
        next: 'start'
      },
      {
        icon: '⭐',
        label: 'TÄHTI',
        color: 'yellow',
        next: 'star'
      },
      {
        icon: '🏠',
        label: 'KOTI',
        color: 'orange',
        next: 'home'
      }
    ]
  }
};

function renderScene() {
  const scene = storyScenes[currentSceneId];

  if (!scene) {
    currentSceneId = 'start';
    renderScene();
    return;
  }

  storyPicture.textContent = scene.picture;
  storyTitle.textContent = scene.title;
  storyText.textContent = scene.text;

  storyPicture.classList.remove('pop');
  void storyPicture.offsetWidth;
  storyPicture.classList.add('pop');

  choiceArea.innerHTML = '';

  scene.choices.forEach((choice) => {
    const button = document.createElement('button');
    button.className = `story-choice ${choice.color}`;
    button.type = 'button';

    const icon = document.createElement('span');
    icon.className = 'choice-icon';
    icon.textContent = choice.icon;

    const label = document.createElement('span');
    label.className = 'choice-label';
    label.textContent = choice.label;

    button.appendChild(icon);
    button.appendChild(label);

    button.addEventListener('click', () => {
      chooseScene(choice.next);
    });

    choiceArea.appendChild(button);
  });
}

function chooseScene(nextSceneId) {
  if (typeof playClickSound === 'function') {
    playClickSound();
  }

  currentSceneId = nextSceneId;
  renderScene();

  if (typeof playSoftPopSound === 'function') {
    playSoftPopSound();
  }
}

renderScene();

if (typeof playNewRoundSound === 'function') {
  playNewRoundSound();
}