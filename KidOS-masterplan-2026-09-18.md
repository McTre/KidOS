# KidOS Masterplan

Päivitetty: 2026-09-18
Tila: git-repon nykytilaa vastaava kooste (github.com/McTre/KidOS, `main`)

## 1. Projektin idea

**KidOS** on selainpohjainen leikkikäyttöjärjestelmä 3–5-vuotiaille lapsille.

Tarkoitus ei ole tehdä oikeaa käyttöjärjestelmää, vaan turvallinen, koko ruudun leikkiympäristö, jossa lapsi voi harjoitella tietokoneen käyttöä, hiirtä, näppäimistöä, värejä, numeroita, kirjaimia, ääniä, yksinkertaista ohjelmointiajattelua, liikennesääntöjä, kuvien katselua, väritystä ja luovaa tekemistä.

KidOS toimii selaimessa ja on tehty kevyenä HTML/CSS/JavaScript-projektina. Projekti on git-repona GitHubissa, ja siitä voi ajaa suoraan täysruutuisena Raspberry Pi:llä (ks. luku 24).

Käyttöliittymä suunnitellaan lapselle, joka ei välttämättä osaa lukea. KidOS perustuu ensisijaisesti suuriin painikkeisiin, selkeisiin väreihin, isoihin symboleihin, muotoihin, ääniin, toistuvaan logiikkaan ja onnistumisen tunteeseen.

KidOSin pitää tuntua lapselle omalta pieneltä tietokoneelta.

## 2. Kohderyhmä

KidOS on suunnattu erityisesti:

- 3–5-vuotiaille lapsille
- lapsille, jotka eivät vielä osaa lukea
- hiiren, kosketuksen ja näppäimistön harjoitteluun
- turvalliseen kokeiluun
- vanhemman kanssa yhdessä käyttämiseen

Aikuista varten käyttöliittymässä voi olla pieniä ohjetekstejä, mutta lapsen kannalta tärkeät asiat esitetään symboleilla, väreillä, isoilla painikkeilla ja äänipalautteella.

## 3. Visuaalinen tyyli

KidOSin yleisilme on rauhallinen, selkeä ja lapselle turvallisen tuntuinen.

Pääperiaatteet:

- tausta on aina tumma harmaansininen
- ruutu ei saa olla kirkkaan valkoinen
- käyttöliittymässä on suuret elementit
- tekstit ovat isoilla kirjaimilla
- painikkeissa on pehmeät pyöristykset
- värit ovat selkeitä mutta eivät räikeitä
- ruutu ei saa tuntua sekavalta
- kaikki tärkeät asiat näkyvät suurina
- sovellusikkunan pitää tuntua yhtenäiseltä
- pelialueen ja ohjetekstien pitää olla selvästi eroteltuja

Yleiset KidOS-värit (käytössä kaikissa sovelluksissa):

```css
--bg: #162433;
--panel: #213447;
--panel-light: #2d455c;
--text: #f4f7fb;
--yellow: #ffd54a;
--red: #ff5d73;
--blue: #59a8ff;
--green: #67dc8a;
--purple: #b185ff;
--orange: #ffad4d;
```

Tärkeä sääntö:

> KidOSin taustan pitää pysyä tummana, harmaansinisenä ja rauhallisena. Ulkoasusta ei tehdä valkoista, levotonta tai liian kirkasta.

## 4. Tekninen perusratkaisu

KidOS tehdään tavallisena selainprojektina.

Teknologiat:

- HTML / CSS / JavaScript
- Canvas peleihin ja piirtämiseen
- Web Audio API ääniin
- iframe KidOSin sisäisiin sovellusikkunoihin
- LocalStorage lukon symbolisalasanalle sekä ROBOHAASTEEN kentille ja tilastoille
- SVG/CSS värityspelin täytettäville alueille ja LIIKENTEEN kaupunkiruudukolle
- Google Meet -linkin avaaminen SOITA-sovelluksesta uuteen välilehteen
- Chromiumin kioskitila (`--kiosk`) täysruutukäynnistykseen Raspberry Pi:llä

Ei tarvita:

- palvelinta
- tietokantaa
- raskasta frameworkia
- build-järjestelmää

Tärkeä periaate:

> Projektin pitää pysyä yksinkertaisena. KidOS on tarkoituksella kevyt selainprojekti, jota on helppo ymmärtää, muokata ja jatkaa.

## 5. Nykyinen koodirakenne

```text
KidOS/
├── index.html            KidOS-työpöytä
├── style.css             työpöydän ulkoasu
├── script.js             sovellusten avaaminen, sulkeminen, lukitus, kohdistus
├── launch-kidos.sh        täysruutukäynnistin (Raspberry Pi, Chromium-kioski)
├── KidOS.desktop          työpöytäkuvake täysruutukäynnistimelle
├── README.md              repon etusivu: esittely + asennusohje
├── KidOS-masterplan-2026-09-18.md   tämä dokumentti
├── kidos.zip              vanha koko projektin zip-kopio (git-ignoroitu, ei osa repoa)
├── assets/
│   ├── kidos-cursor.svg   KidOSin oma kursori
│   ├── kidos-icon.svg     käynnistimen ikoni
│   └── screenshot-desktop.png   README:n kuvakaappaus työpöydästä
├── shared/
│   └── audio.js           yhteiset äänet (käytössä kaikkialla, myös työpöydällä)
└── apps/
    ├── colors/            index.html, style.css, colors.js
    ├── numbers/           index.html, style.css, numbers.js
    ├── letters/           index.html, style.css, letters.js
    ├── music/             index.html, style.css, music.js
    ├── story/             index.html, style.css, story.js
    ├── photos/            index.html, style.css, photos.js
    ├── coloring/          index.html, style.css, coloring.js
    ├── call/              index.html, style.css, call.js
    ├── programming/       index.html, style.css, programming.js
    ├── robot-challenge/   index.html, style.css, robot-challenge.js
    ├── traffic/           index.html, style.css, traffic.js
    ├── lock/              index.html, style.css, lock.js
    └── drawing/           index.html, style.css, drawing.js  (ei työpöydällä)
```

Vanhat, aiemmin tunnetut epäjohdonmukaisuudet on korjattu: `apps/colors/README.md` (LeikkiOS-jäänne) ja käyttämätön `apps/placeholder.html` on poistettu kokonaan.

## 6. Työpöytä ja sovellusikkuna

KidOS käynnistyy työpöydälle.

Työpöydän sovellukset (11 kpl):

```text
VÄRIT, OHJELMOINTI, KIRJAIMET, NUMEROT, MUSIIKKI, TARINA,
KUVAT, VÄRITYS, SOITA, ROBOHAASTE, LIIKENNE
```

Sovellukset avataan KidOSin sisäiseen iframe-ikkunaan.

Ikkunassa on:

- otsikko vasemmalla
- lukituspainike oikealla
- punainen sulkunappi oikealla
- sovellus iframe-ikkunan sisällä

Sulkunappi noudattaa tuttua Windows/Linux-logiikkaa (punainen ruutu + X = sulje sovellus). Lukituspainike on sekä pääpalkissa että sovellusikkunan yläpalkissa.

**Automaattinen näppäimistökohdistus:** kun sovellus avataan, `script.js` kohdistaa iframen automaattisesti sovelluksen latautuessa (`appFrame.contentWindow.focus()`). Näin esimerkiksi MUSIIKIN ja LIIKENTEEN näppäimistöohjaus toimii heti avaamisesta lähtien, eikä lapsen tarvitse ensin klikata ikkunaa. Sivuvaikutus: KidOSin oma Escape-sulkulogiikka toimii luotettavasti vain kun kohdistus on työpöydällä, mutta punainen ×-sulkunappi toimii aina kohdistuksesta riippumatta.

## 7. Sovellusten avaaminen

`script.js` avaa sovellukset iframeen ja lisää cache-busterin, jotta selain ei näytä vanhaa versiota.

Nykyinen sovelluslista koodissa:

```js
const apps = {
  colors: { title: 'VÄRIT', url: './apps/colors/index.html' },
  numbers: { title: 'NUMEROT', url: './apps/numbers/index.html' },
  programming: { title: 'OHJELMOINTI', url: './apps/programming/index.html' },
  letters: { title: 'KIRJAIMET', url: './apps/letters/index.html' },
  music: { title: 'MUSIIKKI', url: './apps/music/index.html' },
  story: { title: 'TARINA', url: './apps/story/index.html' },
  photos: { title: 'KUVAT', url: './apps/photos/index.html' },
  coloring: { title: 'VÄRITYS', url: './apps/coloring/index.html' },
  call: { title: 'SOITA', url: './apps/call/index.html' },
  robotchallenge: { title: 'ROBOHAASTE', url: './apps/robot-challenge/index.html' },
  traffic: { title: 'LIIKENNE', url: './apps/traffic/index.html' }
};
```

Huomio:

- `drawing/` on repossa olemassa, mutta sitä ei tällä hetkellä avata työpöydältä (tietoinen päätös, ks. luku 13).
- `lock/` ei ole tavallinen työpöytäsovellus, vaan avataan lukitus-overlayna.

## 8. Yhteinen äänijärjestelmä

Äänet tehdään JavaScriptillä Web Audio API:n avulla.

Yhteinen tiedosto: `shared/audio.js`

Yhteiset äänifunktiot:

```js
playClickSound()
playOpenSound()
playCloseSound()
playCorrectSound()
playWrongSound()
playNewRoundSound()
playSoftPopSound()
playWinSound()
```

Kaikki sovellukset — myös työpöytä (`script.js`) ja `apps/drawing/` — lataavat ja käyttävät nyt `shared/audio.js`-tiedostoa. Työpöydän oma `playDesktopSound()`-funktio on edelleen olemassa, mutta se on ohut kääre, joka kutsuu `playOpenSound()`/`playCloseSound()`-funktioita eikä enää sisällä omaa Web Audio -toteutusta.

## 9. Kursori ja klikattavien kohteiden korostus

KidOSissa on oma iso nuolikursori, joka tuntuu normaalilta tietokoneen kursorilta mutta on lapselle selkeämpi.

Nykyinen toteutus:

- `assets/kidos-cursor.svg` määritellään CSS-kursorina joka sovelluksessa (`cursor: url(...) 8 5, auto;`).
- Työpöydän ja sovellusten napit korostuvat hover/focus-tilassa ja painuvat `:active`-tilassa.
- Kaikki aiemmin löydetyt `cursor: pointer;` -määritykset (19 kohtaa yhdeksässä tiedostossa) on korvattu KidOSin omalla kursorilla, jotta klikattavan kohteen päällä ei näy käyttöjärjestelmän osoitinkäsi.

Mahdollinen myöhempi parannus: jos halutaan oikeasti animoitu kursori, CSS-kursorin sijaan voidaan tehdä oma `div`-pohjainen cursor-layer, joka seuraa hiirtä ja kutistuu klikkauksessa.

## 10. Lukitus

Lukitus on toteutettu omana sovelluksenaan (`apps/lock/`).

Nykyinen toiminta:

- lukko avataan työpöydän tai sovellusikkunan lukituspainikkeesta
- nykyinen avoin sovellus suljetaan ennen lukitusta
- lukitus näytetään koko ruudun overlayna
- oletussalasana on neljän symbolin koodi: ⭐ ❤️ 🚗 🌙
- salasana tallennetaan selaimen LocalStorageen avaimella `kidos-symbol-password`
- käyttäjä voi vaihtaa salasanan neljään symboliin
- oikea koodi lähettää parent-ikkunalle `KIDOS_UNLOCK`-viestin

Nykytila: **LUKKO = toimiva perusversio**

Tuleva suunnittelumuistio: myöhemmin lukkoon voidaan tehdä kolme vaikeustasoa; nykyinen versio pidetään helppona neljän symbolin koodina.

## 11. VÄRIT-sovellus

Sijainti: `apps/colors/`

- canvas-pohjainen värien etsintäpeli, säädettävä ruudukkokoko (nyt `gridSize = 5`)
- tavoiteväri näytetään tekstillä `ETSI`, jäljellä oleva määrä isona numerona
- oikea ruutu korostuu, väärä tärähtää ja saa punaisen kehyksen
- pelin päätyttyä `HYVÄ!`, `LÖYSIT KAIKKI`, `UUDESTAAN`

Nykytila: **VÄRIT = toimiva ja lähes valmis**

## 12. NUMEROT-sovellus

Sijainti: `apps/numbers/`

- näytetään 1–9 symbolia, lapsi valitsee oikean numeron neljästä dominopalikka-vaihtoehdosta
- vaihtoehdot kasvavassa järjestyksessä, onnistumis- ja virhepalaute

Nykytila: **NUMEROT = toimiva perusversio**

## 13. PIIRRÄ-sovellus

Sijainti: `apps/drawing/`

- kevyt canvas-piirto, väri vaihtuu automaattisesti hue-arvon mukaan pointer-tapahtumilla
- lataa nyt `shared/audio.js`:n, vaikka ei aktiivisesti soita ääniä

Nykytila: **PIIRRÄ = tekninen miniprototyyppi, tietoisesti pidetty työpöydän ulkopuolella**

Päätös (2026-09-18): PIIRRÄ jätetään toistaiseksi sivuun. Jos sitä joskus viimeistellään, tarvitaan tyhjennysnappi ja värivalitsin ennen kuin se palautetaan työpöydälle.

## 14. KIRJAIMET-sovellus

Sijainti: `apps/letters/`

- näyttää symbolin, sanan ja kirjainpaikat; lapsi valitsee kirjaimet aakkosista, tukee myös fyysistä näppäimistöä
- sanat: KALA, TALO, AUTO, KUU, AURINKO, PUU, KOIRA, KISSA, TÄHTI, OMENA

Nykytila: **KIRJAIMET = toimiva perusversio**

## 15. MUSIIKKI-sovellus

Sijainti: `apps/music/`

Nimi on vakiintunut lopullisesti muotoon **MUSIIKKI** (vanha `ÄÄNET`-nimi on hylätty).

- isot värilliset koskettimet, kappale valitaan vasen/oikea-nuolilla ja esitetään symbolilla
- nuottiohjaus näyttää seuraavat painettavat sävelet, kappaleen voi aloittaa uudestaan
- kappaleet: yksinkertainen aloitusmelodia, UKKO NOOA, HÄMÄ HÄMÄ HÄKKI
- **Uusi:** värinäppäimet voi soittaa myös näppäimistöllä (**D F G H J K**, kotirivi), kirjain näkyy myös painikkeessa. Hyötyy automaattisesta ikkunan kohdistuksesta (luku 6).

Nykytila: **MUSIIKKI = toimiva perusversio, näppäimistötuella**

## 16. TARINA-sovellus

Sijainti: `apps/story/`

- etenee kohtauksesta toiseen, isolla symbolikuvalla, otsikolla, lyhyellä tekstillä ja valintapainikkeilla

Nykytila: **TARINA = toimiva ensimmäinen versio**

## 17. OHJELMOINTI-sovellus

Sijainti: `apps/programming/`

- ruudukossa robotti, sydän ja kiviä; lapsi lisää enintään 6 komentoa jonoon
- kenttä generoidaan niin, että sydämeen on reitti; nykyinen tasolista sisältää vain 4×4-kentän kahdella kivellä

Nykytila: **OHJELMOINTI = toimiva perusversio (4×4)**

## 18. KUVAT-sovellus

Sijainti: `apps/photos/`

- symbolipohjainen kuvagalleria (16 kuvakorttia, 2 sivua), iso katselunäkymä, sulkeutuu klikkauksella tai Escapella

Nykytila: **KUVAT = toimiva symbolipohjainen testiversio**

## 19. VÄRITYS-sovellus

Sijainti: `apps/coloring/`

- väripaletti + klikattavat SVG/HTML-alueet, kuvat vaihtuvat vasen/oikea-nuolilla, tyhjennysnappi

Nykytila: **VÄRITYS = toimiva ensimmäinen versio**

## 20. SOITA-sovellus

Sijainti: `apps/call/`

- lapselle MUMMO-kortti ja puhelupainike; aikuinen syöttää Google Meet -koodin/linkin aikuisen näkymässä
- avauspainiketta pidetään painettuna 3 sekuntia, hyväksytty linkki avataan uuteen välilehteen

Nykytila: **SOITA = toimiva paikallinen Meet-linkin avaava perusversio**

Rajoitukset ja avoimet kysymykset:

- Selaimen ponnahdusikkunaesto voi estää Meet-välilehden avautumisen.
- Enter-näppäin avaa kelvollisen Meet-koodin suoraan ilman kolmen sekunnin painallusta — tietoisesti päättämätön: joko hyväksytään aikuisen pikanäppäimeksi tai muutetaan noudattamaan samaa varmistusta.
- Aiemmin koodissa ollut keskeneräinen sähköposti/SMS/WhatsApp-ilmoitustoiminto (`notifyGrandmaButton`, `notifyGrandma()`) on poistettu kokonaan, koska sille ei ollut käyttöliittymää.

## 21. ROBOHAASTE-sovellus

Sijainti: `apps/robot-challenge/`

Laajempi, oma ohjelmointipeli OHJELMOINTI-sovelluksen rinnalla: 10×10-ruudukko, viisi valmista kenttää, komentojono (enintään 20 komentoa), erikoiskomennot PAINA ja TYÖNNÄ, napit/ovet, kenttäeditori, tilastot LocalStoragessa (`kidos-robot-challenge-levels-v3`, `kidos-robot-challenge-stats-v3`).

**Editorin parannus:** editori näyttää nyt näkyvän varoituksen (`#editorWarning`), jos kentästä puuttuu robotti ja/tai sydän. Itse suoritus esti tämän jo aiemmin pehmeästi (`hasRequiredPieces`), mutta editorissa ei ollut aiemmin mitään visuaalista vihjettä.

Nykytila: **ROBOHAASTE = toimiva laaja versio ja kenttäeditori**

Avoin: editori ei vielä tarkista kentän ratkaistavuutta (voi tallentaa kentän, joka ei ole läpäistävissä vaikka robotti ja sydän olisivatkin olemassa).

## 22. LIIKENNE-sovellus

Sijainti: `apps/traffic/`

Uusi peli: robotti ohjataan pienessä kaupungissa nuolinäppäimillä tai ruudulla näkyvällä ristiohjaimella, ja tehtävänä on toimittaa kaupungin eläimille niiden toivomat esineet turvallisesti liikennesääntöjä noudattaen.

**Kaupunkigeneraattori** (`buildTiles()`):

- Parametrisoitu korttelirakenne (`BLOCK_COLS`/`BLOCK_ROWS`/`BLOCK_INTERIOR`-vakioista), nyt 3×2 korttelia, kaupungin koko lasketaan automaattisesti näistä.
- Kaksi ruutua leveät kadut korttelien välissä, molemmissa suunnissa (pysty- ja vaakakadut).
- Suojatiet oikean suuntaisilla, harvennetuilla raidoilla — pystykaduilla ja vaakakaduilla on erilliset CSS-luokat (`orientation-h`/`orientation-v`), jotta raidat ovat oikein päin molemmissa risteystyypeissä.
- Joka kortteliin lohkaistaan yksi nurkka takaisin pieneksi aukioksi (kiertyy kortteleittain tl→tr→br→bl), jotta asemakaava ei näytä liian täydelliseltä ruudukolta. Rakennus-/puuikoni siirtyy automaattisesti nurkan vastakkaiselle puolelle.
- Kaksi puistoa (kävelykelpoisia, 🌳-koristein) ja neljä rakennusta (🏠/🏢/🏪, ei-kävelykelpoisia).
- Muutama ajoneuvo (🚗🚕🚙🚌) ripoteltuna tasavälein katuverkkoon koristeeksi — ei vaikuta peliin, koska robotti ei voi koskaan astua autotielle.

**Liikennevalo:**

- Yksi synkronoitu liikennevalo koko kaupungille (kaikki suojatiet vaihtavat väriä yhtä aikaa), automaattinen ajastin (vihreä 3s, punainen 3,5s, alkaa punaisena).
- Sivupalkissa näkyy aina kaksi lamppua (punainen/vihreä), harmaa se joka ei pala.
- Suojatie tarkistetaan vain kun astutaan jalkakäytävältä kadulle (ensimmäinen askel) — kesken ylityksen robotti ei jää jumiin vaikka valo vaihtuisi.
- Jos pelaaja yrittää mennä punaisia päin, valopaneelin kehys välähtää punaisena (`.light-panel.flash`) tavallisen ravistuksen ja väärä-äänen lisäksi.
- Jos pelaaja yrittää mennä suoraan autotielle, kadun ajoneuvokuvakkeet välähtävät punaisena (`drop-shadow`-tehoste, koska emoji on väripiirros).

**Toimitustehtävä:**

- Kaupungissa on kahdeksan eläintä, joilla on kiinteä pari-toive:

  ```text
  🐰 Pupu    → 🥕 Porkkana
  🐵 Apina   → 🍌 Banaani
  🐱 Kissa   → 🐟 Kala
  🐶 Koira   → 🦴 Luu
  🐻 Karhu   → 🍯 Hunaja
  🐭 Hiiri   → 🧀 Juusto
  🐝 Mehiläinen → 🌸 Kukka
  🦆 Ankka   → 🍞 Leipä
  ```

- Eläimet arvotaan uuteen paikkaan (jalkakäytävä/puisto, ei koristeiden päälle) joka pelikerta (`UUDESTAAN`), niin että ne eivät ole liian lähekkäin toisiaan (Manhattan-etäisyys ≥ 6 ruutua, 300 yrityksen rejektiohyväksyntä varmuuden vuoksi).
- Kävelemällä idle-tilassa olevan eläimen luo käynnistyy pyyntö: satunnainen esine ilmestyy satunnaiseen tyhjään ruutuun, ja sivupalkin tehtäväkuvake + viesti kertovat mitä pitää hakea.
- Esine haetaan kävelemällä sen päälle (automaattinen poiminta), ja viedään takaisin sille samalle eläimelle.
- Kun paketti on toimitettu, eläin **katoaa kaupungista kokonaan**, ja ruutuun ilmestyy pomppiva keltainen toast-ilmoitus (esim. "✅ 🐰 KIITOS 🥕!"), joka häviää itsestään ~1,8 s kuluttua.
- Kun kaikki kahdeksan on toimitettu, viesti muuttuu erilliseksi loppu-onnitteluksi.
- Kesken tehtävän muiden (ei-aktiivisten) eläinten luota kävellään vaikutuksetta ohi.

**Käyttöliittymä:**

- Robotti-haaste-tyylinen sivupalkkilayout: kartta täyttää suurimman osan ruudusta vasemmalla (`.board-panel`, koko käytettävissä oleva korkeus+leveys), kapea kiinteä sivupalkki oikealla sisältää viestin, liikennevalon, tehtäväkuvakkeen, ristiohjaimen ("OHJAA ROBOTTIA" -tekstillä) ja UUDESTAAN-napin.
- Ristiohjain (▲◀▼▶) on toiminnallinen, ei vain kuvitusta — klikkaus liikuttaa robottia samalla logiikalla kuin näppäimistön nuolet. Hyödyllinen kosketusnäytöllä Raspberry Pi:llä.
- `.board`-elementin koko lasketaan `width:100%` + `aspect-ratio` (asetetaan JS:stä `--grid-cols`/`--grid-rows`-muuttujien perusteella) + `max-height:100%`, jotta kartta skaalautuu oikein täyttämään käytettävissä olevan tilan sen sijaan että kutistuisi omaan sisältöönsä.

Nykytila: **LIIKENNE = toimiva ensimmäinen versio, perusperiaatteet kunnossa**

Mahdollisia jatkoideoita: isompi kaupunki (enemmän korttelirivejä/-sarakkeita), erilliset liikennevalot per risteys, vaikeustasoja, lisää eläin-esine-pareja.

## 23. Kehityssäännöt

Projektissa noudatetaan näitä sääntöjä:

1. **Ei rikota toimivaa peliä.** Kun muokataan olemassa olevaa sovellusta, ei korvata koko rakennetta turhaan.
2. **Sovelluksilla on omat kansiot.** Jokainen sovellus saa oman kansionsa `apps/`-kansion alle.
3. **Yhteiset asiat ovat shared- tai assets-kansiossa** (`shared/audio.js`, `assets/kidos-cursor.svg`, `assets/kidos-icon.svg`).
4. **Ei poikkeusratkaisuja yksittäisiin sovelluksiin.** Jos jokin asia on yleinen, siitä tehdään yhteinen ratkaisu (esim. näppäimistökohdistus korjattiin `script.js`:ssä kerran, ei per-sovellus).
5. **Ei turhaa monimutkaisuutta.** KidOS ei tarvitse raskasta frameworkia tai palvelinta.
6. **Selaimen välimuisti huomioidaan.** Iframe-sovelluksiin lisätään cache-buster.
7. **Emoji-riippuvuutta tarkkaillaan.** Emoji-symbolit ovat nopeita ja käteviä, mutta voivat näyttää eri laitteilla erilaisilta. Jos jokin tärkeä symboli hajoaa, tehdään siitä CSS- tai SVG-pohjainen oma symboli.
8. **Commitit ovat pieniä ja kuvaavia.** Muutokset committoidaan loogisissa paloissa (esim. yksi sovellus tai yksi korjaus per commit), ei yhtenä isona möhkäleenä.

## 24. Julkaisu: GitHub ja Raspberry Pi -käynnistin

**GitHub:** projekti on julkinen repo osoitteessa [github.com/McTre/KidOS](https://github.com/McTre/KidOS), `main`-branch. `README.md` toimii repon etusivuna: sisältää suomenkielisen esittelyn, sovelluslistan, työpöydän kuvakaappauksen (`assets/screenshot-desktop.png`) ja asennusohjeen. `kidos.zip` on git-ignoroitu (`.gitignore`) vanha snapshot-tiedosto, ei osa varsinaista repoa.

**Täysruutukäynnistin Raspberry Pi:lle:**

- `launch-kidos.sh` etsii automaattisesti `chromium-browser`- tai `chromium`-komennon (toimii Raspberry Pi OS:n eri versioilla), avaa KidOSin Chromiumin kioskitilassa (`--kiosk`, ei osoiteriviä eikä muita selaimen elementtejä) ja estää näytönsäästäjän/sammutuksen (`xset`) kesken leikin.
- `KidOS.desktop` on työpöytäkuvake, joka ajaa käynnistimen. `Exec=`/`Icon=`-polut osoittavat oletuksena `/home/pi/KidOS/...` — pitää säätää, jos projekti sijaitsee muualla.
- Käyttöönotto: lataa/kloonaa repo Pi:lle → pura ZIP tarvittaessa → tarkista polut → kopioi `KidOS.desktop` työpöydälle tai `~/.local/share/applications/`-kansioon.

## 25. Nykyinen projektitila

```text
KidOS-työpöytä        = tehty, automaattinen sovelluskohdistus
Sovellusikkuna        = tehty
Punainen X-sulku      = tehty
Lukitus               = tehty perusversiona
Custom cursor         = tehty, cursor:pointer-jäänteet korjattu kaikkialta
Klikattavien korostus = tehty
Yhteiset äänet        = tehty ja käytössä kaikkialla, myös työpöydällä ja PIIRRÄssä
VÄRIT                 = toimiva
NUMEROT               = toimiva
KIRJAIMET             = toimiva
MUSIIKKI              = toimiva, näppäimistötuki (D F G H J K)
TARINA                = toimiva ensimmäinen versio
OHJELMOINTI           = toimiva 4×4-versiona
KUVAT                 = toimiva symboligalleria
VÄRITYS               = toimiva ensimmäinen versio
SOITA                 = toimiva Meet-linkin avaava perusversio, kuollut ilmoituskoodi poistettu
ROBOHAASTE            = toimiva laaja versio, editorin robotti/sydän-varoitus lisätty
LIIKENNE              = uusi, toimiva ensimmäinen versio
PIIRRÄ                = olemassa, tietoisesti ei työpöydällä
GitHub-julkaisu       = tehty (github.com/McTre/KidOS)
Pi-täysruutukäynnistin = tehty (launch-kidos.sh + KidOS.desktop)
```

Projektin painopiste on siirtynyt perustan siistimisestä uuden sisällön (LIIKENNE) ja julkaisun (GitHub, Pi-käynnistin) rakentamiseen. Kaikki aiemman katselmuksen "korjaa ensin nämä" -kohdat on tehty.

## 26. Avoimet kysymykset ja tekninen velka

1. **SOITA:** Enter-näppäin ohittaa 3 sekunnin pidon — päätettävä tietoisesti, hyväksytäänkö pikanäppäimeksi vai yhtenäistetäänkö.
2. **ROBOHAASTE:** editori ei tarkista kentän ratkaistavuutta, vain robotin/sydämen olemassaolon.
3. **LIIKENNE:** yksi synkronoitu liikennevalo koko kaupungille — realistisempi versio antaisi joka risteykselle oman valon ja ajastuksen.
4. **PIIRRÄ:** ei tyhjennysnappia eikä värivalintaa; pysyy työpöydän ulkopuolella kunnes tämä päätetään viimeistellä.

## 27. Myöhemmät jatkoideat

Näitä ei tarvita perusversion valmistumiseen:

- äänten päälle/pois -asetus
- vanhemman asetussivu
- lisää kirjain- ja sanapaketteja, lisää lauluja, lisää värityskuvia
- oikeita optimoituja kuvia KUVAT-sovellukseen
- muistipeli, muotopeli
- palkintotähdet tai tarrat, LocalStorage lasten saavutuksille
- lukon vaikeustasot
- täysin animoitu oma kursori (div-pohjainen cursor-layer)
- SOITA-sovelluksen aikuisen asetukset ja useampi turvallinen yhteystieto
- ROBOHAASTEEN uudet komennot nykyisiin `?`-paikkoihin, kentän ratkaistavuustarkistus, kenttien vienti/tuonti tiedostona
- LIIKENTEEN isompi kaupunki, erilliset risteyskohtaiset valot, vaikeustasoja, lisää eläin-esine-pareja

## 28. KidOSin tavoite

KidOSin tavoite on olla pieni, turvallinen ja hauska leikkiympäristö.

Sen ei tarvitse olla teknisesti monimutkainen.

Tärkeintä on, että lapsi voi:

- klikata, kokeilla, onnistua, kuulla palautetta
- oppia värejä, harjoitella numeroita, tutustua kirjaimiin
- soittaa ääniä, katsoa kuvia, värittää, piirtää
- kokeilla ohjelmointiajattelua ja ratkaista laajempia robottihaasteita
- opetella liikennesääntöjä turvallisesti leikin kautta
- pyytää aikuisen avulla turvallisesti videopuhelun avaamista
- käyttää tietokonetta turvallisesti

KidOS onnistuu, jos lapsi ymmärtää mitä voi tehdä, uskaltaa kokeilla ja ilahtuu onnistumisesta.
