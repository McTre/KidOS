# KidOS

Selainpohjainen leikkikäyttöjärjestelmä 3–5-vuotiaille.

## Rakenne

```text
KidOS/
├── index.html
├── style.css
├── script.js
├── assets/
│   └── kidos-cursor.svg
├── shared/
│   └── audio.js
└── apps/
    ├── colors/
    ├── numbers/
    ├── letters/
    ├── music/
    ├── story/
    ├── photos/
    ├── coloring/
    ├── call/
    ├── programming/
    ├── robot-challenge/
    ├── lock/
    └── drawing/
```

Jokaisella `apps/`-kansion sovelluksella on omat `index.html`, `style.css` ja `<sovellus>.js`-tiedostot.

## Ajatus

KidOSin pääsivu on työpöytä.

KidOS avaa sovellukset iframe-ikkunaan. Näin jokainen peli voi olla oma erillinen pieni HTML/CSS/JS-sovellus.

Yhteiset osat:

- `shared/audio.js` – kaikkien sovellusten ja työpöydän käyttämät äänet
- `assets/kidos-cursor.svg` – KidOSin oma kursori

## Työpöydän sovellukset

- `apps/colors/` = VÄRIT, väripeli
- `apps/programming/` = OHJELMOINTI, kevyt robottipulma (4×4)
- `apps/letters/` = KIRJAIMET, sanan tavaaminen
- `apps/numbers/` = NUMEROT, lukumäärän tunnistus
- `apps/music/` = MUSIIKKI, Simon-says-tyylinen soittopeli
- `apps/story/` = TARINA, valintapohjainen kuvatarina
- `apps/photos/` = KUVAT, symbolipohjainen kuvagalleria
- `apps/coloring/` = VÄRITYS, väritysohjelma
- `apps/call/` = SOITA, turvallinen Google Meet -linkin avaus
- `apps/robot-challenge/` = ROBOHAASTE, laajempi robottipulma ja kenttäeditori

Näiden lisäksi:

- `apps/lock/` = KidOSin lukitusruutu (ei työpöydän sovellus, avataan lukituspainikkeesta)
- `apps/drawing/` = kevyt piirtoprototyyppi, ei toistaiseksi työpöydällä

Tarkempi suunnitelma ja tunnetut puutteet: ks. `KidOS-masterplan-2026-09-18.md`.
