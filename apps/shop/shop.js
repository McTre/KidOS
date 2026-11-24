const STORAGE_KEY = 'kidos-shop-v1';

// Viivakoodinlukija näkyy selaimelle näppäimistönä: se "kirjoittaa" koodin
// hyvin nopeasti ja painaa lopuksi Enteriä. Lapsen tavallinen näppäily on
// paljon hitaampaa, joten nopeus erottaa lukijan näppäimistöstä.
const SCAN_CHAR_GAP_MS = 80;
const SCAN_MIN_LENGTH = 4;
const SCAN_IDLE_COMMIT_MS = 200;
const SCAN_IDLE_MIN_LENGTH = 6;

const SETTINGS_HOLD_MS = 2000;
const THANKS_AUTO_CLOSE_MS = 4500;
const MAX_SHELF = 12;
const MAX_CART_ITEMS = 40;
const MAX_PRICE = 99;

const DEFAULT_PRODUCTS = [
  { emoji: '🍎', name: 'OMENA', price: 1, shelf: true },
  { emoji: '🍌', name: 'BANAANI', price: 1, shelf: true },
  { emoji: '🥛', name: 'MAITO', price: 2, shelf: true },
  { emoji: '🍞', name: 'LEIPÄ', price: 2, shelf: true },
  { emoji: '🧀', name: 'JUUSTO', price: 3, shelf: true },
  { emoji: '🥕', name: 'PORKKANA', price: 1, shelf: true },
  { emoji: '🍓', name: 'MANSIKAT', price: 3, shelf: true },
  { emoji: '🍪', name: 'KEKSIT', price: 2, shelf: true },
  { emoji: '🍦', name: 'JÄÄTELÖ', price: 3, shelf: false },
  { emoji: '🥚', name: 'MUNAT', price: 2, shelf: false }
];

const EMOJI_CHOICES = [
  '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍒', '🍑', '🥝',
  '🍅', '🥕', '🌽', '🥒', '🥦', '🥔', '🧅', '🍄', '🥜', '🍞', '🥐', '🥖',
  '🧀', '🥚', '🥛', '🧃', '🧈', '🍯', '🥣', '🍕', '🍝', '🐟', '🍗', '🥫',
  '🍪', '🍫', '🍬', '🍭', '🍦', '🍩', '🧁', '🎂', '🧸', '🎈', '⚽', '🖍️',
  '📕', '🧦', '🧴', '🧻', '🪥', '🧼', '🌷', '🐶', '🐱', '⭐'
];

const shelfElement = document.getElementById('shelf');
const cartElement = document.getElementById('cart');
const totalElement = document.getElementById('total');
const scannerElement = document.getElementById('scanner');
const scannerMessage = document.getElementById('scannerMessage');
const clearButton = document.getElementById('clearButton');
const payCashButton = document.getElementById('payCash');
const payCardButton = document.getElementById('payCard');

const cardOverlay = document.getElementById('cardOverlay');
const cardTotal = document.getElementById('cardTotal');
const cardVisual = document.getElementById('cardVisual');
const cardHint = document.getElementById('cardHint');
const cardCancel = document.getElementById('cardCancel');

const thanksOverlay = document.getElementById('thanksOverlay');
const thanksMethod = document.getElementById('thanksMethod');
const thanksTotal = document.getElementById('thanksTotal');
const thanksItems = document.getElementById('thanksItems');

const settingsButton = document.getElementById('settingsButton');
const settingsOverlay = document.getElementById('settingsOverlay');
const settingsClose = document.getElementById('settingsClose');
const productRows = document.getElementById('productRows');
const addProductButton = document.getElementById('addProduct');
const cardCodesElement = document.getElementById('cardCodes');
const learnCardButton = document.getElementById('learnCard');
const resetShopButton = document.getElementById('resetShop');
const learnBanner = document.getElementById('learnBanner');
const learnText = document.getElementById('learnText');
const learnBufferElement = document.getElementById('learnBuffer');
const learnCancelButton = document.getElementById('learnCancel');
const emojiPicker = document.getElementById('emojiPicker');

document.getElementById('maxShelf').textContent = MAX_SHELF;

let shop = loadShop();
let cart = [];
let mode = 'shop'; // shop | card | thanks | settings

let scanBuffer = '';
let lastScanKeyAt = 0;
let scanIdleTimer = null;
let scannerMessageTimer = null;

let learnTarget = null; // { type: 'product', id } | { type: 'card' }
let learnBuffer = '';
let emojiTargetId = null;

let holdTimer = null;
let holdFrame = null;
let holdStartedAt = 0;

let thanksTimer = null;

/* ---------- Tallennus ---------- */

function makeId() {
  return `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

function createDefaultShop() {
  return {
    products: DEFAULT_PRODUCTS.map((product) => ({
      id: makeId(),
      emoji: product.emoji,
      name: product.name,
      price: product.price,
      shelf: product.shelf,
      codes: []
    })),
    cards: []
  };
}

function loadShop() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (saved && Array.isArray(saved.products) && Array.isArray(saved.cards)) {
      saved.products = saved.products
        .filter((product) => product && product.id)
        .map((product) => ({
          id: String(product.id),
          emoji: product.emoji || '⭐',
          name: String(product.name || 'TUOTE'),
          price: clampPrice(product.price),
          shelf: Boolean(product.shelf),
          codes: Array.isArray(product.codes) ? product.codes.map(String) : []
        }));
      saved.cards = saved.cards.map(String);
      return saved;
    }
  } catch (error) {
    // Rikkinäinen tallennus: aloitetaan oletuksista.
  }

  return createDefaultShop();
}

function saveShop() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shop));
  } catch (error) {
    // LocalStorage ei ehkä ole käytettävissä; kauppa toimii silti tämän kerran.
  }
}

function clampPrice(value) {
  const number = Math.round(Number(value));

  if (!Number.isFinite(number)) {
    return 1;
  }

  return Math.min(MAX_PRICE, Math.max(0, number));
}

function findProduct(id) {
  return shop.products.find((product) => product.id === id);
}

function findProductByCode(code) {
  return shop.products.find((product) => product.codes.includes(code));
}

function shelfProducts() {
  return shop.products.filter((product) => product.shelf).slice(0, MAX_SHELF);
}

/* ---------- Hylly ja kori ---------- */

function renderShelf() {
  shelfElement.innerHTML = '';

  shelfProducts().forEach((product) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'product-button';
    button.setAttribute('aria-label', `${product.name}, ${product.price} euroa`);
    button.innerHTML = `
      <span class="product-emoji" aria-hidden="true"></span>
      <span class="product-name"></span>
      <span class="price-tag"></span>
    `;
    button.querySelector('.product-emoji').textContent = product.emoji;
    button.querySelector('.product-name').textContent = product.name;
    button.querySelector('.price-tag').textContent = `${product.price} €`;

    button.addEventListener('click', () => {
      if (mode !== 'shop') {
        return;
      }

      if (addToCart(product.id)) {
        playSoftPopSound();
        bounce(button);
      }
    });

    shelfElement.appendChild(button);
  });
}

function cartCount() {
  return cart.reduce((sum, row) => sum + row.qty, 0);
}

function cartTotal() {
  return cart.reduce((sum, row) => {
    const product = findProduct(row.id);
    return sum + (product ? product.price * row.qty : 0);
  }, 0);
}

function addToCart(productId) {
  if (cartCount() >= MAX_CART_ITEMS) {
    playWrongSound();
    return false;
  }

  const existing = cart.find((row) => row.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }

  renderCart(productId);
  return true;
}

function removeOneFromCart(productId) {
  const row = cart.find((item) => item.id === productId);

  if (!row) {
    return;
  }

  row.qty -= 1;

  if (row.qty <= 0) {
    cart = cart.filter((item) => item.id !== productId);
  }

  playSoftPopSound();
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
}

function renderCart(highlightId = null) {
  // Poistetut tuotteet (asetuksista) pudotetaan korista pois.
  cart = cart.filter((row) => findProduct(row.id));

  cartElement.innerHTML = '';

  cart.forEach((row) => {
    const product = findProduct(row.id);
    const item = document.createElement('li');
    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'cart-row';
    button.setAttribute('aria-label', `Poista yksi: ${product.name}`);
    button.innerHTML = `
      <span class="cart-emoji" aria-hidden="true"></span>
      <span class="cart-name"></span>
      <span class="cart-qty"></span>
      <span class="cart-price"></span>
    `;
    button.querySelector('.cart-emoji').textContent = product.emoji;
    button.querySelector('.cart-name').textContent = product.name;
    button.querySelector('.cart-qty').textContent = row.qty > 1 ? `×${row.qty}` : '';
    button.querySelector('.cart-price').textContent = `${product.price * row.qty} €`;

    button.addEventListener('click', () => {
      if (mode === 'shop') {
        removeOneFromCart(row.id);
      }
    });

    if (row.id === highlightId) {
      button.classList.add('just-added');
    }

    item.appendChild(button);
    cartElement.appendChild(item);

    if (row.id === highlightId) {
      button.scrollIntoView({ block: 'nearest' });
    }
  });

  totalElement.textContent = `${cartTotal()} €`;

  const empty = cart.length === 0;
  payCashButton.disabled = empty;
  payCardButton.disabled = empty;
  clearButton.disabled = empty;
}

function bounce(element) {
  element.classList.remove('bounce');
  void element.offsetWidth;
  element.classList.add('bounce');
}

/* ---------- Maksaminen ---------- */

function openCardPayment() {
  if (mode !== 'shop' || cart.length === 0) {
    return;
  }

  mode = 'card';
  cardTotal.textContent = `${cartTotal()} €`;

  const needsScan = shop.cards.length > 0;
  cardHint.textContent = needsScan ? 'LUE KORTTI' : 'PAINA KORTTIA';
  cardVisual.classList.toggle('tappable', !needsScan);
  cardOverlay.classList.remove('hidden');
  playNewRoundSound();
}

function closeCardPayment() {
  cardOverlay.classList.add('hidden');
  cardVisual.classList.remove('rejected', 'accepted');

  if (mode === 'card') {
    mode = 'shop';
  }
}

function completePayment(method) {
  if (cart.length === 0) {
    return;
  }

  closeCardPayment();
  mode = 'thanks';

  thanksMethod.textContent = method === 'card' ? '💳' : '💶';
  thanksTotal.textContent = `${cartTotal()} €`;
  thanksItems.textContent = cart
    .map((row) => {
      const product = findProduct(row.id);
      return product ? product.emoji.repeat(Math.min(row.qty, 5)) : '';
    })
    .join(' ');

  thanksOverlay.classList.remove('hidden');
  playWinSound();

  clearTimeout(thanksTimer);
  thanksTimer = setTimeout(finishThanks, THANKS_AUTO_CLOSE_MS);
}

function finishThanks() {
  clearTimeout(thanksTimer);
  thanksOverlay.classList.add('hidden');
  clearCart();
  mode = 'shop';
}

/* ---------- Viivakoodinlukija ---------- */

function isTypingField(target) {
  return (
    target instanceof HTMLElement &&
    (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
  );
}

function resetScanBuffer() {
  scanBuffer = '';
  clearTimeout(scanIdleTimer);
}

function commitScanBuffer() {
  const code = scanBuffer.trim();
  resetScanBuffer();

  if (code.length >= SCAN_MIN_LENGTH) {
    handleScan(code);
  }
}

function onKeyDown(event) {
  if (learnTarget) {
    handleLearnKey(event);
    return;
  }

  if (isTypingField(event.target)) {
    return;
  }

  if (event.key === 'Enter' || event.key === 'Tab') {
    if (scanBuffer.length >= SCAN_MIN_LENGTH && performance.now() - lastScanKeyAt < SCAN_CHAR_GAP_MS * 2) {
      // Estetään Enteriä painamasta samalla esim. kohdistettua maksunappia.
      event.preventDefault();
      event.stopPropagation();
      commitScanBuffer();
    } else {
      resetScanBuffer();
    }
    return;
  }

  if (event.key.length !== 1 || event.ctrlKey || event.altKey || event.metaKey) {
    return;
  }

  const now = performance.now();

  if (now - lastScanKeyAt > SCAN_CHAR_GAP_MS) {
    scanBuffer = '';
  }

  scanBuffer += event.key;
  lastScanKeyAt = now;

  // Varalla lukijoille, jotka eivät lähetä Enteriä koodin perään.
  clearTimeout(scanIdleTimer);
  scanIdleTimer = setTimeout(() => {
    if (scanBuffer.length >= SCAN_IDLE_MIN_LENGTH) {
      commitScanBuffer();
    } else {
      resetScanBuffer();
    }
  }, SCAN_IDLE_COMMIT_MS);
}

function handleScan(code) {
  if (mode === 'settings') {
    return;
  }

  if (mode === 'thanks') {
    finishThanks();
  }

  if (shop.cards.includes(code)) {
    if (cart.length > 0) {
      playScanBeep();
      cardVisual.classList.add('accepted');
      completePayment('card');
    } else {
      showScannerMessage('💳', 'bad');
      playWrongSound();
    }
    return;
  }

  if (mode === 'card') {
    cardVisual.classList.remove('rejected');
    void cardVisual.offsetWidth;
    cardVisual.classList.add('rejected');
    playWrongSound();
    return;
  }

  const product = findProductByCode(code);

  if (!product) {
    showScannerMessage('?', 'bad');
    playWrongSound();
    return;
  }

  if (addToCart(product.id)) {
    playScanBeep();
    showScannerMessage(product.emoji, 'good');
  }
}

function showScannerMessage(text, tone) {
  clearTimeout(scannerMessageTimer);
  scannerMessage.textContent = text;
  scannerElement.classList.remove('good', 'bad');
  void scannerElement.offsetWidth;
  scannerElement.classList.add(tone);

  scannerMessageTimer = setTimeout(() => {
    scannerElement.classList.remove('good', 'bad');
    scannerMessage.textContent = '';
  }, 1100);
}

function playScanBeep() {
  if (typeof playTone === 'function') {
    playTone(1760, 0.11, 'square', 0.03);
  }
}

/* ---------- Asetukset: avaaminen pitkällä painalluksella ---------- */

function startSettingsHold(event) {
  if (mode !== 'shop') {
    return;
  }

  event.preventDefault();
  stopSettingsHold();
  holdStartedAt = performance.now();
  settingsButton.classList.add('holding');

  const tick = () => {
    const progress = Math.min(1, (performance.now() - holdStartedAt) / SETTINGS_HOLD_MS);
    settingsButton.style.setProperty('--hold', progress);
    holdFrame = requestAnimationFrame(tick);
  };
  tick();

  holdTimer = setTimeout(() => {
    stopSettingsHold();
    openSettings();
  }, SETTINGS_HOLD_MS);
}

function stopSettingsHold() {
  clearTimeout(holdTimer);
  cancelAnimationFrame(holdFrame);
  holdTimer = null;
  settingsButton.classList.remove('holding');
  settingsButton.style.setProperty('--hold', 0);
}

function openSettings() {
  mode = 'settings';
  resetScanBuffer();
  renderSettings();
  settingsOverlay.classList.remove('hidden');
  playOpenSound();
}

function closeSettings() {
  cancelLearn();
  closeEmojiPicker();
  settingsOverlay.classList.add('hidden');
  mode = 'shop';
  renderShelf();
  renderCart();
  playCloseSound();
}

/* ---------- Asetukset: tuotteet ja kortit ---------- */

function renderSettings() {
  renderProductRows();
  renderCardCodes();
}

function renderProductRows() {
  productRows.innerHTML = '';
  const shelfIds = new Set(shelfProducts().map((product) => product.id));

  shop.products.forEach((product) => {
    const row = document.createElement('div');
    row.className = 'product-row';

    const emojiButton = document.createElement('button');
    emojiButton.type = 'button';
    emojiButton.className = 'emoji-choice';
    emojiButton.textContent = product.emoji;
    emojiButton.setAttribute('aria-label', 'Vaihda kuva');
    emojiButton.addEventListener('click', () => openEmojiPicker(product.id, emojiButton));

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'name-input';
    nameInput.maxLength = 14;
    nameInput.value = product.name;
    nameInput.setAttribute('aria-label', 'Tuotteen nimi');
    nameInput.addEventListener('input', () => {
      product.name = nameInput.value.toUpperCase().trim() || 'TUOTE';
      saveShop();
    });

    const priceLabel = document.createElement('label');
    priceLabel.className = 'price-field';
    const priceInput = document.createElement('input');
    priceInput.type = 'number';
    priceInput.min = '0';
    priceInput.max = String(MAX_PRICE);
    priceInput.step = '1';
    priceInput.value = product.price;
    priceInput.setAttribute('aria-label', 'Hinta euroina');
    priceInput.addEventListener('change', () => {
      product.price = clampPrice(priceInput.value);
      priceInput.value = product.price;
      saveShop();
    });
    priceLabel.append(priceInput, document.createTextNode(' €'));

    const shelfLabel = document.createElement('label');
    shelfLabel.className = 'shelf-toggle';
    const shelfInput = document.createElement('input');
    shelfInput.type = 'checkbox';
    shelfInput.checked = product.shelf;
    shelfInput.addEventListener('change', () => {
      product.shelf = shelfInput.checked;
      saveShop();
      renderProductRows();
    });
    shelfLabel.append(shelfInput, document.createTextNode(' HYLLYLLÄ'));

    if (product.shelf && !shelfIds.has(product.id)) {
      shelfLabel.classList.add('overflow');
      shelfLabel.title = `Hyllyyn mahtuu vain ${MAX_SHELF} tuotetta`;
    }

    const codes = document.createElement('div');
    codes.className = 'codes';

    product.codes.forEach((code) => {
      codes.appendChild(
        makeCodeChip(code, () => {
          product.codes = product.codes.filter((item) => item !== code);
          saveShop();
          renderProductRows();
        })
      );
    });

    const learnButton = document.createElement('button');
    learnButton.type = 'button';
    learnButton.className = 'small-action';
    learnButton.textContent = '▮▯▮ OPETA KOODI';
    learnButton.addEventListener('click', () => startLearn({ type: 'product', id: product.id }));
    codes.appendChild(learnButton);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-button';
    deleteButton.textContent = '×';
    deleteButton.setAttribute('aria-label', `Poista tuote ${product.name}`);
    deleteButton.addEventListener('click', () => {
      if (!confirm(`Poistetaanko tuote ${product.name}?`)) {
        return;
      }

      shop.products = shop.products.filter((item) => item.id !== product.id);
      saveShop();
      renderProductRows();
    });

    row.append(emojiButton, nameInput, priceLabel, shelfLabel, codes, deleteButton);
    productRows.appendChild(row);
  });
}

function makeCodeChip(code, onRemove) {
  const chip = document.createElement('span');
  chip.className = 'code-chip';
  chip.textContent = code;

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.textContent = '×';
  remove.setAttribute('aria-label', `Poista koodi ${code}`);
  remove.addEventListener('click', onRemove);

  chip.appendChild(remove);
  return chip;
}

function renderCardCodes() {
  cardCodesElement.innerHTML = '';

  if (shop.cards.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'muted';
    empty.textContent = 'Ei opetettuja kortteja.';
    cardCodesElement.appendChild(empty);
    return;
  }

  shop.cards.forEach((code) => {
    cardCodesElement.appendChild(
      makeCodeChip(`💳 ${code}`, () => {
        shop.cards = shop.cards.filter((item) => item !== code);
        saveShop();
        renderCardCodes();
      })
    );
  });
}

function addProduct() {
  shop.products.push({
    id: makeId(),
    emoji: '⭐',
    name: 'UUSI',
    price: 1,
    shelf: shelfProducts().length < MAX_SHELF,
    codes: []
  });
  saveShop();
  renderProductRows();

  const inputs = productRows.querySelectorAll('.name-input');
  const last = inputs[inputs.length - 1];

  if (last) {
    last.scrollIntoView({ block: 'center' });
    last.focus();
    last.select();
  }
}

function resetShop() {
  if (!confirm('Palautetaanko oletustuotteet? Omat tuotteet ja opetetut koodit poistuvat. Maksukortit säilyvät.')) {
    return;
  }

  const cards = shop.cards;
  shop = createDefaultShop();
  shop.cards = cards;
  cart = [];
  saveShop();
  renderSettings();
}

/* ---------- Asetukset: koodin opettaminen ---------- */

function startLearn(target) {
  closeEmojiPicker();

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  learnTarget = target;
  learnBuffer = '';

  if (target.type === 'card') {
    learnText.textContent = '💳 LUE MAKSUKORTTI LUKIJALLA';
  } else {
    const product = findProduct(target.id);
    learnText.textContent = `${product ? product.emoji : ''} LUE TUOTTEEN VIIVAKOODI`;
  }

  renderLearnBuffer();
  learnBanner.classList.remove('hidden');
}

function cancelLearn() {
  learnTarget = null;
  learnBuffer = '';
  learnBanner.classList.add('hidden');
}

function renderLearnBuffer() {
  learnBufferElement.textContent = learnBuffer || '…';
}

function handleLearnKey(event) {
  if (event.key === 'Escape') {
    event.preventDefault();
    cancelLearn();
    return;
  }

  if (event.key === 'Enter' || event.key === 'Tab') {
    event.preventDefault();
    const code = learnBuffer.trim();

    if (code) {
      finishLearn(code);
    }
    return;
  }

  if (event.key === 'Backspace') {
    event.preventDefault();
    learnBuffer = learnBuffer.slice(0, -1);
    renderLearnBuffer();
    return;
  }

  if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
    event.preventDefault();
    learnBuffer += event.key;
    renderLearnBuffer();
  }
}

function finishLearn(code) {
  const target = learnTarget;
  cancelLearn();

  if (target.type === 'card') {
    const owner = findProductByCode(code);

    if (owner) {
      playWrongSound();
      alert(`Koodi ${code} kuuluu jo tuotteelle ${owner.name}. Poista se tuotteelta ensin.`);
      return;
    }

    if (!shop.cards.includes(code)) {
      shop.cards.push(code);
    }

    saveShop();
    renderCardCodes();
    playCorrectSound();
    return;
  }

  const product = findProduct(target.id);

  if (!product) {
    return;
  }

  if (shop.cards.includes(code)) {
    playWrongSound();
    alert(`Koodi ${code} on maksukortin koodi. Poista kortti ensin, jos haluat käyttää sitä tuotteelle.`);
    return;
  }

  const owner = findProductByCode(code);

  if (owner && owner.id !== product.id) {
    if (!confirm(`Koodi ${code} kuuluu nyt tuotteelle ${owner.name}. Siirretäänkö se tuotteelle ${product.name}?`)) {
      return;
    }

    owner.codes = owner.codes.filter((item) => item !== code);
  }

  if (!product.codes.includes(code)) {
    product.codes.push(code);
  }

  saveShop();
  renderProductRows();
  playCorrectSound();
}

/* ---------- Asetukset: kuvan valinta ---------- */

function openEmojiPicker(productId, anchor) {
  emojiTargetId = productId;
  emojiPicker.innerHTML = '';

  EMOJI_CHOICES.forEach((emoji) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = emoji;
    button.addEventListener('click', () => {
      const product = findProduct(emojiTargetId);

      if (product) {
        product.emoji = emoji;
        saveShop();
        renderProductRows();
      }

      closeEmojiPicker();
    });
    emojiPicker.appendChild(button);
  });

  const card = settingsOverlay.querySelector('.settings-card').getBoundingClientRect();
  const rect = anchor.getBoundingClientRect();
  emojiPicker.style.top = `${Math.max(12, Math.min(rect.bottom - card.top + 6, card.height - 300))}px`;
  emojiPicker.style.left = `${Math.max(12, rect.left - card.left)}px`;
  emojiPicker.classList.remove('hidden');
}

function closeEmojiPicker() {
  emojiTargetId = null;
  emojiPicker.classList.add('hidden');
}

/* ---------- Tapahtumat ---------- */

document.addEventListener('keydown', onKeyDown, true);

// Kaupan puolella napit eivät jää kohdistetuiksi, ettei lapsen Enter-painallus
// "klikkaa" viimeksi painettua tuotetta tai maksunappia uudestaan.
document.addEventListener('click', (event) => {
  const button = event.target instanceof Element ? event.target.closest('button') : null;

  if (button && !settingsOverlay.contains(button)) {
    button.blur();
  }
});

clearButton.addEventListener('click', () => {
  if (mode === 'shop' && cart.length > 0) {
    clearCart();
    playCloseSound();
  }
});

payCashButton.addEventListener('click', () => {
  if (mode === 'shop') {
    completePayment('cash');
  }
});

payCardButton.addEventListener('click', openCardPayment);

cardCancel.addEventListener('click', () => {
  closeCardPayment();
  playCloseSound();
});

cardVisual.addEventListener('click', () => {
  if (mode === 'card' && shop.cards.length === 0) {
    cardVisual.classList.add('accepted');
    completePayment('card');
  }
});

thanksOverlay.addEventListener('click', finishThanks);

settingsButton.addEventListener('pointerdown', startSettingsHold);
settingsButton.addEventListener('pointerup', stopSettingsHold);
settingsButton.addEventListener('pointerleave', stopSettingsHold);
settingsButton.addEventListener('pointercancel', stopSettingsHold);
settingsButton.addEventListener('contextmenu', (event) => event.preventDefault());

settingsClose.addEventListener('click', closeSettings);
addProductButton.addEventListener('click', addProduct);
learnCardButton.addEventListener('click', () => startLearn({ type: 'card' }));
learnCancelButton.addEventListener('click', cancelLearn);
resetShopButton.addEventListener('click', resetShop);

settingsOverlay.addEventListener('click', (event) => {
  if (
    !emojiPicker.classList.contains('hidden') &&
    !emojiPicker.contains(event.target) &&
    !event.target.classList.contains('emoji-choice')
  ) {
    closeEmojiPicker();
  }
});

renderShelf();
renderCart();
