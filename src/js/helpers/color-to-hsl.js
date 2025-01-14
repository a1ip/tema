import { named } from '../data/named';

export function colorToHsl ({ color, format }) {
  color = color.toLowerCase();

  if (format === 'keyword') {
    return color;
  }
  if (format.includes('hsl')) {
    return hslFromString(color);
  }
  if (format.includes('rgb')) {
    return RGBToHSL(rgbFromString(color));
  }
  if (format === 'named') {
    return RGBToHSL(rgbFromString(named[color]));
  }

  return RGBToHSL(hexToRGB(color));
}

function hslFromString (str) {
  let colorParts = str
    .match(/\(((.*))\)/)[1]
    .split(',');

  colorParts = colorParts.map(item => {
    return +item.trim().replace('%', '');
  });
  const [h, s, l, a] = colorParts;

  return { h, s, l, a };
}

function rgbFromString (str) {
  let colorParts = str
    .match(/\(((.*))\)/)[1]
    .split(',');

  colorParts = colorParts.map(item => {
    return +item.trim().replace('%', '');
  });
  const [r, g, b, a] = colorParts;

  return { r, g, b, a };
}

// ---------------------------------------------
// https://css-tricks.com/converting-color-spaces-in-javascript/

function hexToRGB (h) {
  let r = 0; let g = 0; let b = 0; let a = '';

  // 3 digits
  if (h.length < 7) {
    r = '0x' + h[1] + h[1];
    g = '0x' + h[2] + h[2];
    b = '0x' + h[3] + h[3];

    if (h[4]) {
      a = '0x' + h[4] + h[4];
    }

  // 6 digits
  } else {
    r = '0x' + h[1] + h[2];
    g = '0x' + h[3] + h[4];
    b = '0x' + h[5] + h[6];

    if (h[7]) {
      a = '0x' + h[7] + h[8];
    }
  }

  if (a) {
    a = +(parseInt(a, 16) / 255).toFixed(1);
  }

  return { r, g, b, a };
}

function RGBToHSL ({ r, g, b, a }) {
  // Make r, g, and b fractions of 1
  r /= 255;
  g /= 255;
  b /= 255;

  // Find greatest and smallest channel values
  const cmin = Math.min(r, g, b);
      const cmax = Math.max(r, g, b);
      const delta = cmax - cmin;
      let h = 0;
      let s = 0;
      let l = 0;

  if (delta === 0) {
    h = 0;
  } else if (cmax === r) {
    // Red is max
    h = ((g - b) / delta) % 6;
  } else if (cmax === g) {
    // Green is max
    h = (b - r) / delta + 2;
  } else {
    // Blue is max
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) { h += 360; }

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l, a };
}
