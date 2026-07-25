// Color theory utility to convert HEX <-> HSL and generate harmonious 6-color synthesized palettes

export function hexToHsl(hex) {
  if (!hex || typeof hex !== 'string') return { h: 0, s: 0, l: 0 };
  let c = hex.replace('#', '').trim();
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  if (c.length !== 6) return { h: 0, s: 0, l: 0 };
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

  const toHex = num => Math.round((num + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function synthesizeSixColorPalette(colA = {}, colB = {}) {
  const getColors = (col) => [
    col.accent, col.primary, col.secondary, col.card, col.surface
  ].filter(c => typeof c === 'string' && c.startsWith('#'));

  const listA = getColors(colA);
  const listB = getColors(colB);
  const allColors = [...listA, ...listB];

  // Helper to find strongest chromatic color in a list
  const getStrongestColor = (colorList) => {
    let best = null;
    let maxSat = -1;
    for (const hex of colorList) {
      const hsl = hexToHsl(hex);
      if (hsl.s >= 18 && hsl.l >= 12 && hsl.l <= 88) {
        if (hsl.s > maxSat) {
          maxSat = hsl.s;
          best = { hex, hsl };
        }
      }
    }
    return best;
  };

  const strongA = getStrongestColor(listA);
  const strongB = getStrongestColor(listB);

  // 1. Light Base (light color >= 75% lightness, or #f8fafc)
  let lightBaseHex = '#f8fafc';
  let maxL = -1;
  for (const hex of allColors) {
    const hsl = hexToHsl(hex);
    if (hsl.l >= 75 && hsl.l > maxL) {
      maxL = hsl.l;
      lightBaseHex = hex;
    }
  }

  // 2. Dark Base (dark color <= 30% lightness, or #0f172a)
  let darkBaseHex = '#0f172a';
  let minL = 101;
  for (const hex of allColors) {
    const hsl = hexToHsl(hex);
    if (hsl.l <= 30 && hsl.l < minL) {
      minL = hsl.l;
      darkBaseHex = hex;
    }
  }

  // 3. Accent A (from Card A)
  const accentAHex = strongA ? strongA.hex : (colA.accent || colA.primary || '#4f46e5');

  // 4. Accent B (from Card B)
  const accentBHex = strongB ? strongB.hex : (colB.accent || colB.primary || '#10b981');

  // 5. Synthesized Harmonious Accent playing off Accent A & Accent B
  let synthesizedAccentHex = '#6366f1';
  if (strongA && strongB) {
    let diff = Math.abs(strongA.hsl.h - strongB.hsl.h);
    let midHue = (strongA.hsl.h + strongB.hsl.h) / 2;
    if (diff > 180) {
      midHue = (midHue + 180) % 360;
    }
    const synthSat = Math.max(strongA.hsl.s, strongB.hsl.s, 70);
    const synthLight = Math.min(Math.max(Math.round((strongA.hsl.l + strongB.hsl.l) / 2), 45), 65);
    synthesizedAccentHex = hslToHex(midHue, synthSat, synthLight);
  } else if (strongA) {
    const synthHue = (strongA.hsl.h + 45) % 360;
    synthesizedAccentHex = hslToHex(synthHue, Math.max(strongA.hsl.s, 70), 55);
  } else if (strongB) {
    const synthHue = (strongB.hsl.h - 45 + 360) % 360;
    synthesizedAccentHex = hslToHex(synthHue, Math.max(strongB.hsl.s, 70), 55);
  } else {
    synthesizedAccentHex = '#f59e0b';
  }

  // 6. Neutral High-Contrast Text / Frame
  const neutralTextHex = '#0f172a';

  return {
    lightBase: lightBaseHex,
    darkBase: darkBaseHex,
    accentA: accentAHex,
    accentB: accentBHex,
    synthesizedAccent: synthesizedAccentHex,
    neutralText: neutralTextHex,

    // Aliases for layout compatibility
    primary: accentAHex,
    secondary: accentBHex,
    accent: synthesizedAccentHex,
    surface: lightBaseHex,
    card: darkBaseHex
  };
}
