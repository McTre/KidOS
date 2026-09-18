#!/bin/bash
# Käynnistää KidOSin täysruudulla Chromiumissa Raspberry Pi OS:ssa.
# Toimii siitä kansiosta käsin missä tämä tiedosto sijaitsee, eikä
# vaadi kiinteää polkua repoon.

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if command -v chromium-browser >/dev/null 2>&1; then
  BROWSER=chromium-browser
elif command -v chromium >/dev/null 2>&1; then
  BROWSER=chromium
else
  echo "Chromiumia ei löytynyt. Asenna Chromium tai muokkaa tätä skriptiä." >&2
  exit 1
fi

# Estetään näytönsäästäjä/sammutus kesken leikin.
xset s off >/dev/null 2>&1
xset s noblank >/dev/null 2>&1
xset -dpms >/dev/null 2>&1

exec "$BROWSER" \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --no-first-run \
  --disable-session-crashed-bubble \
  --check-for-update-interval=31536000 \
  "file://$DIR/index.html"
