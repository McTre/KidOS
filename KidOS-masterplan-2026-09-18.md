# KidOS Masterplan

Päivitetty: 2026-09-18  
Tila: zip-paketin nykytilaa vastaava koodikatselmus

## 1. Projektin idea

**KidOS** on selainpohjainen leikkikäyttöjärjestelmä 3–5-vuotiaille lapsille.

Tarkoitus ei ole tehdä oikeaa käyttöjärjestelmää, vaan turvallinen, koko ruudun leikkiympäristö, jossa lapsi voi harjoitella tietokoneen käyttöä, hiirtä, värejä, numeroita, kirjaimia, ääniä, yksinkertaista ohjelmointiajattelua, kuvien katselua, väritystä ja luovaa tekemistä.

KidOS toimii selaimessa ja sitä kehitetään kevyenä HTML/CSS/JavaScript-projektina. Kehitykseen sopii StackBlitz Web Platform, koska tiedostot ovat suoraan muokattavissa ja sovellusta voi testata heti selaimessa.

Käyttöliittymä suunnitellaan lapselle, joka ei välttämättä osaa lukea. KidOS perustuu ensisijaisesti suuriin painikkeisiin, selkeisiin väreihin, isoihin symboleihin, muotoihin, ääniin, toistuvaan logiikkaan ja onnistumisen tunteeseen.

KidOSin pitää tuntua lapselle omalta pieneltä tietokoneelta.

## 2. Kohderyhmä

KidOS on suunnattu erityisesti:

- 3–5-vuotiaille lapsille
- lapsille, jotka eivät vielä osaa lukea
- hiiren, kosketuksen ja myöhemmin näppäimistön harjoitteluun
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

Taustan perusväri:

```css
#162433
```

Yleisiä KidOS-värejä:

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

- HTML
- CSS
- JavaScript
- Canvas peleihin ja piirtämiseen
- Web Audio API ääniin
- iframe KidOSin sisäisiin sovellusikkunoihin
- LocalStorage lukon symbolisalasanalle sekä ROBOHAASTEEN kentille ja tilastoille
- SVG/CSS värityspelin täytettäville alueille
- Google Meet -linkin avaaminen SOITA-sovelluksesta uuteen välilehteen

Ei tarvita:

- Pythonia
- palvelinta
- tietokantaa
- raskasta frameworkia
- build-järjestelmää

Tärkeä periaate:

> Projektin pitää pysyä yksinkertaisena. KidOS on tarkoituksella kevyt selainprojekti, jota on helppo ymmärtää, muokata ja jatkaa.

## 5. Nykyinen koodirakenne zipissä

Zipissä on tällä hetkellä seuraava todellinen rakenne:

```text
KidOS/
├── index.html
├── style.css
├── script.js
├── README.md
├── assets/
│   └── kidos-cursor.svg
├── shared/
│   └── audio.js
└── apps/
    ├── coloring/
    │   ├── index.html
    │   ├── style.css
    │   └── coloring.js
    ├── call/
    │   ├── index.html
    │   ├── style.css
    │   └── call.js
    ├── colors/
    │   ├── README.md
    │   ├── index.html
    │   ├── style.css
    │   └── colors.js
    ├── drawing/
    │   ├── index.html
    │   ├── style.css
    │   └── drawing.js
    ├── letters/
    │   ├── index.html
    │   ├── style.css
    │   └── letters.js
    ├── lock/
    │   ├── index.html
    │   ├── style.css
    │   └── lock.js
    ├── music/
    │   ├── index.html
    │   ├── style.css
    │   └── music.js
    ├── numbers/
    │   ├── index.html
    │   ├── style.css
    │   └── numbers.js
    ├── photos/
    │   ├── index.html
    │   ├── style.css
    │   └── photos.js
    ├── programming/
    │   ├── index.html
    │   ├── style.css
    │   └── programming.js
    ├── robot-challenge/
    │   ├── index.html
    │   ├── style.css
    │   └── robot-challenge.js
    ├── story/
    │   ├── index.html
    │   ├── style.css
    │   └── story.js
    └── placeholder.html
```

Pääperiaate:

```text
index.html       = KidOS-työpöytä
style.css        = KidOS-työpöydän ulkoasu
script.js        = sovellusten avaaminen, sulkeminen ja lukitus
shared/audio.js  = yhteiset äänet
assets/          = yhteiset visuaaliset apuresurssit
apps/*           = yksittäiset sovellukset
```

## 6. Työpöytä ja sovellusikkuna

KidOS käynnistyy työpöydälle.

Nykyiset työpöydän sovellukset zipissä:

- VÄRIT
- OHJELMOINTI
- KIRJAIMET
- NUMEROT
- MUSIIKKI
- TARINA
- KUVAT
- VÄRITYS
- SOITA
- ROBOHAASTE

Sovellukset avataan KidOSin sisäiseen iframe-ikkunaan.

Ikkunassa on:

- otsikko vasemmalla
- lukituspainike oikealla
- punainen sulkunappi oikealla
- sovellus iframe-ikkunan sisällä

Sulkunappi noudattaa tuttua Windows/Linux-logiikkaa:

```text
punainen ruutu + X = sulje sovellus
```

Lukituspainike on sekä pääpalkissa että sovellusikkunan yläpalkissa.

## 7. Sovellusten avaaminen

Nykyinen `script.js` avaa sovellukset iframeen ja lisää cache-busterin, jotta StackBlitz tai selain ei näytä vanhaa versiota.

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
  robotchallenge: {
    title: 'ROBOHAASTE',
    url: './apps/robot-challenge/index.html'
  }
};
```

Huomio:

- `drawing/` on zipissä olemassa, mutta sitä ei tällä hetkellä avata työpöydältä.
- `lock/` ei ole tavallinen työpöytäsovellus, vaan avataan lukitus-overlayna.
- `placeholder.html` on vielä mukana, mutta nykyiset työpöydän sovellukset eivät näytä käyttävän sitä.
- Työpöydällä on nyt 10 avattavaa sovellusta. `apps/`-kansiossa on niiden lisäksi `drawing/`, `lock/` ja `placeholder.html`.

## 8. Yhteinen äänijärjestelmä

Äänet tehdään JavaScriptillä Web Audio API:n avulla.

Yhteinen tiedosto:

```text
shared/audio.js
```

Nykyiset yhteiset äänifunktiot:

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

Suurin osa sovelluksista käyttää yhteistä `shared/audio.js`-tiedostoa.

Huomio:

- Työpöydän `script.js` sisältää vielä oman `playDesktopSound()`-ratkaisun.
- Jatkossa olisi siistimpää käyttää myös työpöydällä `shared/audio.js`-tiedostoa, jotta äänilogiikka olisi yhdessä paikassa.
- `drawing/` ei tällä hetkellä lataa `shared/audio.js`-tiedostoa.

## 9. Kursori ja klikattavien kohteiden korostus

KidOSissa halutaan oma iso nuolikursori, joka tuntuu normaalilta tietokoneen kursorilta mutta on lapselle selkeämpi.

Nykyinen toteutus:

- `assets/kidos-cursor.svg` on olemassa.
- `style.css` käyttää sitä CSS-kursorina.
- Työpöydän napit korostuvat hover/focus-tilassa.
- Painikkeet pienenevät/painuvat `:active`-tilassa, mikä antaa klikkauspalautetta.

Tärkeä tavoitesääntö:

> Kun kursori menee klikattavan kohteen päälle, kohde korostuu selvästi, mutta kursori ei saa muuttua takaisin tavalliseksi käyttöjärjestelmän kursoriksi.

Nykyinen koodihuomio:

- Osa painikkeista määrittelee edelleen `cursor: pointer;`.
- Tämä voi aiheuttaa sen, että klikattavan kohteen päällä näkyy käyttöjärjestelmän osoitinkäsi eikä KidOSin oma nuolikursori.
- Tämä kannattaa korjata yleisesti poistamalla `cursor: pointer;` tai korvaamalla se samalla custom cursor -määrittelyllä kaikissa klikattavissa elementeissä.

Mahdollinen myöhempi parannus:

- Jos halutaan oikeasti animoitu kursori, CSS-kursorin sijaan voidaan tehdä oma `div`-pohjainen cursor-layer, joka seuraa hiirtä ja kutistuu klikkauksessa.
- Nykyinen versio on hyvä välivaihe, mutta ei vielä täysi animoitu kursori.

## 10. Lukitus

Lukitus on toteutettu omana sovelluksenaan:

```text
apps/lock/
```

Nykyinen toiminta:

- lukko avataan työpöydän tai sovellusikkunan lukituspainikkeesta
- nykyinen avoin sovellus suljetaan ennen lukitusta
- lukitus näytetään koko ruudun overlayna
- oletussalasana on neljän symbolin koodi:

```text
⭐ ❤️ 🚗 🌙
```

- salasana tallennetaan selaimen LocalStorageen avaimella `kidos-symbol-password`
- käyttäjä voi vaihtaa salasanan neljään symboliin
- oikea koodi lähettää parent-ikkunalle `KIDOS_UNLOCK`-viestin

Nykytila:

```text
LUKKO = toimiva perusversio
```

Tuleva suunnittelumuistio:

- myöhemmin lukkoon voidaan tehdä kolme vaikeustasoa
- nykyinen versio pidetään helppona neljän symbolin koodina
- vaikeammat tasot voivat sisältää pidempiä koodeja, realistisempaa lukituslogiikkaa ja mahdollisesti numeroita

## 11. VÄRIT-sovellus

Sijainti:

```text
apps/colors/
```

Nykyinen toteutus:

- canvas-pohjainen värien etsintäpeli
- ruudukko on tällä hetkellä `gridSize = 5`
- tavoiteväri näytetään tekstillä `ETSI`
- jäljellä oleva määrä näytetään isona numerona
- oikea ruutu korostuu ja merkitään löydetyksi
- väärä ruutu tärähtää ja saa punaisen kehyksen
- alhaalla on vanhemmalle ohje: `KLIKKAILE OIKEAT VÄRIT`
- pelin päätyttyä näkyy `HYVÄ!`, `LÖYSIT KAIKKI` ja `UUDESTAAN`

Nykytila:

```text
VÄRIT = toimiva ja lähes valmis
```

Huomiot:

- masterplanissa on mainittu mahdollinen `gridSize = 6`, mutta zipissä se on nyt 5.
- tämä ei ole virhe, mutta masterplanin pitää jatkossa puhua säädettävästä koosta eikä väittää yhtä kokoa valmiiksi totuudeksi.
- `apps/colors/README.md` käyttää vielä vanhaa nimeä LeikkiOS ja on selvästi vanhentunut.

## 12. NUMEROT-sovellus

Sijainti:

```text
apps/numbers/
```

Nykyinen toteutus:

- näytetään 1–9 symbolia
- lapsi valitsee oikean numeron neljästä vaihtoehdosta
- vaihtoehdot esitetään dominopalikoina
- vaihtoehdot lajitellaan kasvavaan järjestykseen
- oikeasta valinnasta tulee onnistumispalaute
- väärästä valinnasta tulee virhepalaute

Nykytila:

```text
NUMEROT = toimiva perusversio
```

## 13. PIIRRÄ-sovellus

Sijainti:

```text
apps/drawing/
```

Nykyinen toteutus:

- erittäin kevyt canvas-piirto
- piirtää pointer-tapahtumilla
- väri vaihtuu automaattisesti hue-arvon mukaan
- ei vielä työpöydän sovelluslistassa
- ei vielä yhteisiä ääniä
- ei vielä tyhjennysnappia tai värivalintaa

Nykytila:

```text
PIIRRÄ = tekninen miniprototyyppi, ei vielä viimeistelty KidOS-sovellus
```

Suositus:

- joko palautetaan PIIRRÄ työpöydälle ja viimeistellään se KidOS-tyyliseksi
- tai pidetään se toistaiseksi sivussa ja merkitään myöhemmäksi laajennukseksi

## 14. KIRJAIMET-sovellus

Sijainti:

```text
apps/letters/
```

Nykyinen toteutus:

- näyttää symbolin, sanan ja kirjainpaikat
- lapsi valitsee oikeat kirjaimet aakkosista
- tukee myös fyysistä näppäimistöä
- oikeasta kirjaimesta täytetään seuraava paikka
- väärä kirjain tärähtää/antaa virhepalautteen

Nykyiset sanat:

```text
KALA, TALO, AUTO, KUU, AURINKO, PUU, KOIRA, KISSA, TÄHTI, OMENA
```

Nykytila:

```text
KIRJAIMET = toimiva perusversio
```

Huomio:

- Kirjainvalikoima on rajattu, mutta ääkköset ja pitkät sanat kannattaa testata rauhassa pienellä lapsella.
- `AURINKO` on melko pitkä sana 3-vuotiaalle, mutta toimii symbolin kanssa tutustumispelinä.

## 15. MUSIIKKI / ÄÄNET -sovellus

Sijainti:

```text
apps/music/
```

Nykyinen nimi työpöydällä:

```text
MUSIIKKI
```

Aiempi masterplan-nimi:

```text
ÄÄNET
```

Nykyinen toteutus:

- isot värilliset koskettimet
- kappale valitaan vasen/oikea-nuolilla
- kappale esitetään symbolilla
- nuottiohjaus näyttää seuraavia painettavia säveliä
- kappaleen voi aloittaa uudestaan
- sovellus ei kaadu, vaikka kappale on lopussa ja käyttäjä painaa nuottia

Nykyiset kappaleet:

- ensimmäinen yksinkertainen melodia
- UKKO NOOA
- HÄMÄ HÄMÄ HÄKKI

Nykytila:

```text
MUSIIKKI = toimiva perusversio
```

Huomio:

- Nimeksi kannattaa päättää yksi: joko `ÄÄNET` tai `MUSIIKKI`.
- Koska nykyinen koodi käyttää työpöydällä nimeä `MUSIIKKI`, tämä masterplan käyttää jatkossa nimeä `MUSIIKKI / ÄÄNET` kunnes nimi päätetään lopullisesti.

## 16. TARINA-sovellus

Sijainti:

```text
apps/story/
```

Nykyinen toteutus:

- tarina etenee kohtauksesta toiseen
- jokaisessa kohtauksessa on iso symbolikuva, otsikko, lyhyt teksti ja valintapainikkeet
- valinnat ovat isoja ja symbolipohjaisia
- sopii rauhalliseksi kuvatarinaksi

Nykytila:

```text
TARINA = toimiva ensimmäinen versio
```

Huomio:

- Tarina sisältää tekstiä, joten täysin lukutaidottomalle lapselle tämä toimii parhaiten aikuisen kanssa.
- Jatkossa tarinaa voi viedä enemmän kuvakorttien suuntaan.

## 17. OHJELMOINTI-sovellus

Sijainti:

```text
apps/programming/
```

Nykyinen toteutus:

- ruudukossa on robotti, sydän ja kiviä
- lapsi lisää komentoja jonoon
- komentoja voi olla enintään 6
- robotti suorittaa komennot järjestyksessä
- jos robotti osuu seinään tai kiveen, tulee pehmeä virhepalaute
- jos robotti pääsee sydämeen, tulee onnistumispalaute
- kenttä generoidaan niin, että sydämeen on reitti
- nykyinen tasolista sisältää vain 4x4-kentän kahdella kivellä

Nykytila:

```text
OHJELMOINTI = toimiva perusversio
```

Huomio:

- Koodissa on jo valmius ruudukkokoon luokille `size-4`, `size-5`, `size-6`, mutta käytössä on vain 4x4.
- Tämä vastaa päätöstä jättää vaikeustason kasvu myöhemmäksi.
- Emoji-symbolit voivat joissakin ympäristöissä näyttää erilaisilta. Jos robotti tai kivi näkyy oudosti, kannattaa vaihtaa CSS-pohjaisiin muotoihin tai omiin SVG-kuviin.

## 18. KUVAT-sovellus

Sijainti:

```text
apps/photos/
```

Nykyinen toteutus:

- kuvagalleria käyttää valmiita isoja symboleja oikeiden kuvien sijaan
- yhdellä sivulla näkyy 8 kuvaa
- kuvia on 16, eli kaksi sivua
- kuvaa painamalla aukeaa iso katselunäkymä
- iso kuva sulkeutuu painamalla näkymää tai Escape-näppäintä

Nykyiset kuvakortit:

```text
KISSA, KOIRA, AUTO, TALO, KALA, PUU, TÄHTI, RAKETTI,
PUPU, KUKKA, PALLO, LAIVA, AURINKO, KUU, SATEENKAARI, ROBOTTI
```

Nykytila:

```text
KUVAT = toimiva symbolipohjainen testiversio
```

Huomio:

- Tämä syntyi siksi, että ilmaisen ympäristön storage-raja oli liian pieni oikeille kuville.
- Myöhemmin voidaan vaihtaa symbolit oikeisiin kuviin tai pieniin optimoituihin SVG/WEBP-kuviin.

## 19. VÄRITYS-sovellus

Sijainti:

```text
apps/coloring/
```

Nykyinen toteutus:

- lapsi valitsee värin paletista
- lapsi klikkaa kuvan aluetta
- klikattu alue täyttyy valitulla värillä
- kuvia vaihdetaan vasen/oikea-nuolilla
- nykyisen kuvan värityksen voi tyhjentää
- väritystilat säilyvät sovelluksen sisällä kuvia vaihdettaessa

Nykyiset värityskuvat:

```text
TALO, AUTO, KALA, KUKKA
```

Nykytila:

```text
VÄRITYS = toimiva ensimmäinen versio
```

Huomio:

- Tämä on hyvä uusi KidOS-periaatteisiin sopiva sovellus.
- Värityskuvat ovat koodissa SVG/HTML-rakenteina, mikä sopii hyvin ilmaisen storage-rajan kanssa.

## 20. SOITA-sovellus

Sijainti:

```text
apps/call/
```

Nykyinen toteutus:

- lapselle näkyy suuri MUMMO-kortti ja puhelupainike
- puhelupainike avaa aikuisen näkymän
- aikuinen syöttää Google Meet -koodin tai koko Meet-linkin
- koodi tarkistetaan ja muutetaan muotoon `abc-defg-hij`
- avauspainiketta pidetään painettuna kolme sekuntia
- hyväksytty Meet-linkki avataan uuteen välilehteen
- onnistuneen avauksen jälkeen näytetään SOITTO AVATTU -näkymä
- sovellus käyttää yhteistä äänijärjestelmää

Nykytila:

```text
SOITA = toimiva paikallinen Meet-linkin avaava perusversio
```

Rajoitukset ja huomiot:

- Staattinen selainprojekti ei voi käynnistää puhelua tai lähettää viestiä täysin automaattisesti.
- Selaimen ponnahdusikkunaesto voi estää Meet-välilehden avautumisen.
- `call.js` sisältää valmiin sähköposti-, SMS- ja WhatsApp-ilmoituksen pohjan, mutta nykyisessä HTML-käyttöliittymässä ei ole `notifyGrandmaButton`-painiketta eikä vastaanottajaa ole asetettu. Ilmoitustoiminto ei siis ole käyttäjän käytettävissä.
- Enter-näppäin avaa kelvollisen Meet-koodin suoraan ilman kolmen sekunnin painallusta. Tämä on syytä päättää tietoisesti: joko hyväksytään aikuisen pikanäppäimeksi tai muutetaan noudattamaan samaa varmistusta.
- SOITA ei sisällä omaa videopuhelutekniikkaa, vaan toimii turvallisena siirtymänä Google Meetiin.

## 21. ROBOHAASTE-sovellus

Sijainti:

```text
apps/robot-challenge/
```

ROBOHAASTE on erillinen, OHJELMOINTI-sovellusta laajempi ohjelmointipeli. Vanha OHJELMOINTI säilyy kevyenä 4×4-harjoituksena, kun taas ROBOHAASTE tarjoaa suuret kentät, erikoiskomennot ja oman editorin.

Nykyinen toteutus:

- ruudukko on 10×10
- valittavana on viisi kenttäpaikkaa
- mukana on viisi valmista oletuskenttää
- komentojonossa voi olla enintään 20 komentoa
- liikkumiskomennot ovat ylös, oikealle, alas ja vasemmalle
- robotti ei käänny, vaan liikesuunta annetaan jokaisella komennolla erikseen
- erikoiskomennot ovat PAINA ja TYÖNNÄ
- PAINA avaa robotin vieressä olevan vihreän tai sinisen napin väriset ovet
- TYÖNNÄ siirtää robotin vieressä olevaa laatikkoa yhden ruudun eteenpäin, jos tila on vapaa
- mukana ovat seinät, laatikot, robotti, sydänmaali, vihreät ja siniset napit sekä ovet
- täysi tai virheellinen liike keskeyttää suorituksen ja antaa virhepalautteen
- komentopaikkaa painamalla yksittäisen komennon voi poistaa jonosta
- kynäpainike vaihtaa kenttäeditoriin
- editorilla voi sijoittaa ja poistaa kaikki käytössä olevat kenttäelementit
- muokatut kentät tallennetaan LocalStorageen
- yritysten ja suoritettujen komentojen määrät tallennetaan kenttäkohtaisesti LocalStorageen
- onnistumisnäkymä näyttää yritys- ja komentomäärän

Tallennusavaimet:

```text
kidos-robot-challenge-levels-v3
kidos-robot-challenge-stats-v3
```

Nykytila:

```text
ROBOHAASTE = toimiva ensimmäinen laaja versio ja kenttäeditori
```

Huomiot:

- Napit eivät ole käveltäviä ruutuja, vaan niitä painetaan viereisestä ruudusta.
- Avattu ovi muuttuu kuljettavaksi loppusuorituksen ajaksi.
- Uudelleenkäynnistyspainike tyhjentää komentojonon, palauttaa kentän alkutilaan ja nollaa kyseisen kentän tilastot.
- Editorissa ei tällä hetkellä validoida kentän ratkaistavuutta. Se voi tallentaa kentän, josta puuttuu robotti tai sydän; tällöin suoritus ei käynnisty.
- Kaksi ohjauspaneelin `?`-painiketta on varattu tuleville komennoille ja on nyt poistettu käytöstä.

## 22. Kehityssäännöt

Projektissa noudatetaan näitä sääntöjä:

### 1. Ei rikota toimivaa peliä

Kun muokataan olemassa olevaa sovellusta, ei korvata koko rakennetta turhaan.

### 2. Muutokset näytetään tiedostokohtaisesti

Pienissä muutoksissa koodi annetaan mieluiten näin:

```text
MUUTETTU TIEDOSTO:
apps/numbers/numbers.js
```

Ja sen jälkeen kyseisen tiedoston sisältö.

Pieniä muutoksia varten ei tehdä ZIP-tiedostoa.

### 3. Sovelluksilla on omat kansiot

Jokainen sovellus saa oman kansionsa `apps/`-kansion alle.

### 4. Yhteiset asiat ovat shared- tai assets-kansiossa

Esimerkiksi:

```text
shared/audio.js
assets/kidos-cursor.svg
```

### 5. Ei poikkeusratkaisuja yksittäisiin sovelluksiin

Jos jokin asia on yleinen, siitä tehdään yhteinen ratkaisu.

### 6. Ei turhaa monimutkaisuutta

KidOS ei tarvitse raskasta frameworkia tai palvelinta.

### 7. Selaimen välimuisti huomioidaan

Iframe-sovelluksiin lisätään cache-buster.

### 8. Emoji-riippuvuutta tarkkaillaan

Emoji-symbolit ovat nopeita ja käteviä prototyypissä, mutta ne voivat näyttää eri laitteilla erilaisilta. Jos jokin tärkeä symboli hajoaa, tehdään siitä CSS- tai SVG-pohjainen oma symboli.

## 23. Koodikatselmuksen tulos

Tarkistettu zipin JavaScript-tiedostot syntaksin osalta:

```text
script.js                        OK
shared/audio.js                  OK
apps/coloring/coloring.js        OK
apps/call/call.js                OK
apps/colors/colors.js            OK
apps/drawing/drawing.js          OK
apps/letters/letters.js          OK
apps/lock/lock.js                OK
apps/music/music.js              OK
apps/numbers/numbers.js          OK
apps/photos/photos.js            OK
apps/programming/programming.js  OK
apps/robot-challenge/robot-challenge.js  OK
apps/story/story.js              OK
```

Kaikki 14 JavaScript-tiedostoa läpäisivät syntaksitarkistuksen. Lisäksi HTML-tiedostojen paikalliset tiedostoviittaukset löytyvät zipistä.

Tämä ei vielä todista, että kaikki käyttöliittymätoiminnot ovat virheettömiä selaimessa. Katselmus ei sisältänyt kaikkien sovellusten interaktiivista käyttötestiä.

## 24. Havaitut ristiriidat ja tekninen velka

### 1. README-tiedostot ovat vanhentuneita

Juurihakemiston README kuvaa vain VÄRIT-, NUMEROT- ja PIIRRÄ-sovellukset. `apps/colors/README.md` käyttää vielä vanhaa LeikkiOS-nimeä.

### 2. PIIRRÄ on olemassa, mutta ei työpöydällä

`apps/drawing/` on zipissä, mutta `script.js` ja `index.html` eivät tarjoa sitä työpöydän sovelluksena.

Päätettävä:

```text
Lisätäänkö PIIRRÄ takaisin työpöydälle vai jätetäänkö se myöhemmäksi?
```

### 3. ÄÄNET-nimi on muuttunut MUSIIKIKSI

Aiempi masterplan puhuu sovelluksesta nimellä `ÄÄNET`, mutta koodi käyttää nimeä `MUSIIKKI`.

Päätettävä:

```text
Käytetäänkö lapselle nimeä ÄÄNET vai MUSIIKKI?
```

### 4. Custom cursor ei ole vielä täysin tavoitteiden mukainen

Oma SVG-kursori on olemassa, mutta osa painikkeista käyttää edelleen `cursor: pointer;` -määritystä.

Tämä voi aiheuttaa sen, että klikattavan elementin kohdalla näkyy käyttöjärjestelmän kursori.

### 5. Työpöydän äänet eivät käytä shared/audio.js-tiedostoa

Työpöydällä on oma `playDesktopSound()`-toteutus.

Tämä toimii, mutta rikkoo hieman periaatetta, että yhteiset äänet pidetään yhdessä paikassa.

### 6. SOITA-sovelluksessa on keskeneräinen ilmoitustoiminto

JavaScriptissä on sähköposti-, SMS- ja WhatsApp-ilmoituksen pohja, mutta HTML:stä puuttuu sitä käyttävä painike ja vastaanottaja-asetus on tyhjä.

### 7. Placeholder-tiedosto on yhä mukana

`apps/placeholder.html` ei näytä olevan nykyisten työpöytäsovellusten käytössä, mutta sitä ei ole poistettu.

### 8. ROBOHAASTEEN editori sallii puutteelliset kentät

Editorissa ei tarkisteta, että kentässä on täsmälleen yksi robotti ja yksi sydän tai että kenttä on mahdollista ratkaista.

## 25. Nykyinen projektitila

Katselmuksen perusteella KidOS on edennyt selvästi pidemmälle kuin vanha masterplan väitti.

Nykytila:

```text
KidOS-työpöytä       = tehty
Sovellusikkuna       = tehty
Punainen X-sulku     = tehty
Lukitus              = tehty perusversiona
Custom cursor        = osittain tehty
Klikattavien korostus = tehty työpöydällä ja monessa sovelluksessa
Yhteiset äänet       = tehty ja käytössä useimmissa sovelluksissa
VÄRIT                = toimiva
NUMEROT              = toimiva
KIRJAIMET            = toimiva
MUSIIKKI / ÄÄNET     = toimiva
TARINA               = toimiva ensimmäinen versio
OHJELMOINTI          = toimiva 4x4-versiona
KUVAT                = toimiva symboligalleria
VÄRITYS              = toimiva ensimmäinen versio
SOITA                 = toimiva Meet-linkin avaava perusversio
ROBOHAASTE            = toimiva laaja versio ja kenttäeditori
PIIRRÄ               = olemassa, mutta ei viimeistelty eikä työpöydällä
```

Projektin painopiste siirtyy nyt uusien perustoimintojen rakentamisesta kokonaisuuden siistimiseen.

## 26. Tärkein seuraava työlista

### Korjaa ensin nämä — tila 2026-09-18

1. **TEHTY.** Juurihakemiston README päivitetty vastaamaan kaikkia nykyisiä sovelluksia.
2. **TEHTY.** Vanha `apps/colors/README.md` (LeikkiOS-jäänne) poistettu.
3. **TEHTY.** Kaikki `cursor: pointer;` -määritykset korvattu KidOSin omalla kursorilla (`apps/*/style.css` ja juuren `style.css`, 19 kohtaa).
4. **PÄÄTETTY.** Nimeksi vakiintuu `MUSIIKKI`. Koodia ei muutettu, koska se käytti jo tätä nimeä.
5. **PÄÄTETTY.** `PIIRRÄ` jätetään toistaiseksi työpöydän ulkopuolelle. Pieni epäjohdonmukaisuus korjattu: `apps/drawing/index.html` lataa nyt `shared/audio.js`:n, jotta se on valmiimpi myöhempää viimeistelyä varten.
6. **TEHTY.** SOITA-sovelluksen käyttämätön ilmoitustoiminto (`notifyGrandmaButton`, `notifyGrandma()`, `grandmaNotify`) poistettu `call.js`:stä, koska HTML:ssä ei ollut vastaavaa painiketta eikä vastaanottajaa ollut asetettu.
7. **TEHTY.** ROBOHAASTEEN editoriin lisätty näkyvä varoitus (`#editorWarning`), joka kertoo jos kentästä puuttuu robotti ja/tai sydän. Suoritus itsessään esti tämän jo aiemmin pehmeästi (`hasRequiredPieces`), mutta editorissa ei ollut mitään visuaalista vihjettä.
8. **TEHTY.** Työpöydän äänet (`script.js`) käyttävät nyt `shared/audio.js`:n `playOpenSound`/`playCloseSound`-funktioita oman Web Audio -toteutuksen sijaan. `index.html` lataa `shared/audio.js`:n ennen `script.js`:ää.
9. **TEHTY.** Käyttämätön `apps/placeholder.html` poistettu.

Kaikki yhdeksän kohtaa on nyt korjattu. Jäljelle jäävät avoimet kysymykset (esim. SOITA:n Enter-pikanäppäin, ROBOHAASTEEN kentän ratkaistavuustarkistus) on listattu kohdissa 20 ja 27.

### Sen jälkeen viimeistele

- testaa kaikki sovellukset iframe-ikkunassa
- tarkista pienempi näyttö / leveä näyttö
- varmista, että lukko toimii myös sovelluksen sisältä
- varmista, että Escape ei avaa lukkoa vahingossa vaan vain sulkee sovelluksen tai kuvanäkymän
- tarkista, että kaikki tekstit ovat isoilla kirjaimilla
- tarkista, että sovellukset eivät näytä vanhoja placeholder-versioita
- tarkista, että hover/focus-korostus toimii kaikissa klikattavissa elementeissä
- testaa SOITA eri selainten ponnahdusikkunaestoilla
- testaa ROBOHAASTEEN viisi oletuskenttää alusta loppuun
- varmista ROBOHAASTEEN editorin ja LocalStoragen toiminta selaimen uudelleenkäynnistyksen jälkeen

## 27. Myöhemmät jatkoideat

Näitä ei tarvita perusversion valmistumiseen:

- PWA-tuki
- koko ruudun tila
- äänten päälle/pois -asetus
- vanhemman asetussivu
- lisää kirjain- ja sanapaketteja
- lisää lauluja
- lisää värityskuvia
- oikeita optimoituja kuvia KUVAT-sovellukseen
- muistipeli
- muotopeli
- palkintotähdet tai tarrat
- LocalStorage lasten saavutuksille
- lukon vaikeustasot
- täysin animoitu oma kursori
- SOITA-sovelluksen aikuisen asetukset ja useampi turvallinen yhteystieto
- ROBOHAASTEEN uudet komennot nykyisiin `?`-paikkoihin
- ROBOHAASTEEN kentän validointi ja ratkaistavuustarkistus
- ROBOHAASTEEN kenttien vienti ja tuonti tiedostona

## 28. KidOSin tavoite

KidOSin tavoite on olla pieni, turvallinen ja hauska leikkiympäristö.

Sen ei tarvitse olla teknisesti monimutkainen.

Tärkeintä on, että lapsi voi:

- klikata
- kokeilla
- onnistua
- kuulla palautetta
- oppia värejä
- harjoitella numeroita
- tutustua kirjaimiin
- soittaa ääniä
- katsoa kuvia
- värittää
- piirtää
- kokeilla ohjelmointiajattelua
- ratkaista laajempia robottihaasteita ja rakentaa omia kenttiä
- pyytää aikuisen avulla turvallisesti videopuhelun avaamista
- käyttää tietokonetta turvallisesti

KidOS onnistuu, jos lapsi ymmärtää mitä voi tehdä, uskaltaa kokeilla ja ilahtuu onnistumisesta.
