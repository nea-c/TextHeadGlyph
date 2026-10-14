import { generate } from './converter.mjs?v=hat-default-10';

const $ = id => document.getElementById(id);
const form = $('settings');
const canvas = $('preview');
const ctx = canvas.getContext('2d');
const face = document.createElement('canvas');
face.width = face.height = 8;
const faceCtx = face.getContext('2d');
let skin = null;
let requestId = 0;
let valid = true;
let currentJSON = '';
let currentComponent = '';
let lastSettings = { size: 8, offset: 0, shadow: true, hat: true };
let referenceText = null;
let referenceShadow = null;

// 0. Use vanilla bitmap glyphs and their visible widths, rather than a web font.
async function loadReferenceText() {
  const image = new Image();
  image.src = 'assets/ascii.png';
  await image.decode();
  const atlas = document.createElement('canvas');
  atlas.width = image.naturalWidth;
  atlas.height = image.naturalHeight;
  const atlasCtx = atlas.getContext('2d');
  atlasCtx.drawImage(image, 0, 0);
  const cell = image.naturalWidth / 16;
  const scale = 8 / cell;
  const chars = [...'ABC 123'];
  const glyphs = chars.map(char => {
    const code = char.charCodeAt(0);
    const x = (code % 16) * cell;
    const y = Math.floor(code / 16) * cell;
    const pixels = atlasCtx.getImageData(x, y, cell, cell).data;
    let visibleWidth = 0;
    for (let column = 0; column < cell; column++) {
      for (let row = 0; row < cell; row++) {
        if (pixels[(row * cell + column) * 4 + 3]) visibleWidth = column + 1;
      }
    }
    return { x, y, advance: char === ' ' ? 4 : visibleWidth * scale + 1 };
  });
  referenceText = document.createElement('canvas');
  referenceText.width = Math.ceil(glyphs.reduce((sum, glyph) => sum + glyph.advance, 0));
  referenceText.height = 8;
  const textCtx = referenceText.getContext('2d');
  textCtx.imageSmoothingEnabled = false;
  let x = 0;
  for (const glyph of glyphs) {
    textCtx.drawImage(image, glyph.x, glyph.y, cell, cell, x, 0, 8, 8);
    x += glyph.advance;
  }
  referenceShadow = document.createElement('canvas');
  referenceShadow.width = referenceText.width;
  referenceShadow.height = 8;
  const shadowCtx = referenceShadow.getContext('2d');
  shadowCtx.drawImage(referenceText, 0, 0);
  const pixels = shadowCtx.getImageData(0, 0, referenceShadow.width, 8);
  for (let i = 0; i < pixels.data.length; i += 4) {
    for (let channel = 0; channel < 3; channel++) pixels.data[i + channel] = Math.round(pixels.data[i + channel] * 63 / 255);
  }
  shadowCtx.putImageData(pixels, 0, 0);
  draw();
}

function readSettings() {
  return {
    player: $('player').value.trim(),
    size: $('size').value === '' ? NaN : Number($('size').value),
    offset: $('offset').value === '' ? NaN : Number($('offset').value),
    shadow: $('shadow').checked,
    hat: $('hat').checked,
    target: $('target').value,
    mode: $('mode').value
  };
}

function update() {
  $('copy-status').textContent = '';
  $('json-copy-fallback').hidden = true;
  const settings = readSettings();
  try {
    const encoded = generate(settings);
    $('command').value = encoded.command;
    currentJSON = encoded.json;
    currentComponent = encoded.component;
    $('body-color').textContent = encoded.color;
    $('shadow-color').textContent = `${encoded.shadowColor} (${encoded.shadowHex})`;
    $('size-echo').textContent = settings.size;
    $('offset-direction').textContent = settings.offset === 0 ? '元の位置' : `${settings.offset < 0 ? '上' : '下'}へ${Math.abs(settings.offset)}`;
    $('size-range').value = settings.size;
    $('offset-range').value = settings.offset;
    $('error').hidden = true;
    lastSettings = settings;
    valid = true;
    canvas.setAttribute('aria-label', `プレビューの頭。${settings.size}×${settings.size}、Yオフセット${settings.offset}、影${settings.shadow ? 'あり' : 'なし'}。`);
  } catch (error) {
    $('error').textContent = error.message;
    $('error').hidden = false;
    $('command').value = '';
    currentJSON = '';
    currentComponent = '';
    $('body-color').textContent = '—';
    $('shadow-color').textContent = '—';
    valid = false;
  }
  $('copy').disabled = !valid;
  $('copy-json').disabled = !valid;
  $('copy-component').disabled = !valid;
  draw();
}

// Render the same 8x8 face and hat rectangles as the resource-pack shader.
function composeHead() {
  faceCtx.clearRect(0, 0, 8, 8);
  if (!skin) return;
  faceCtx.drawImage(skin, 8, 8, 8, 8, 0, 0, 8, 8);
  if (lastSettings.hat) faceCtx.drawImage(skin, 40, 8, 8, 8, 0, 0, 8, 8);
}

function draw() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (!width || !height) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;
  const { size, offset, shadow } = lastSettings;
  // Auto-fit both the original glyph and the transformed head, including shadow.
  const textWidth = referenceText ? referenceText.width : 40;
  const left = -textWidth - 4;
  const right = Math.max(8, size + (shadow ? 1 : 0));
  const top = Math.min(-8, offset - size);
  const bottom = Math.max(0, offset + (shadow ? 1 : 0));
  const zoom = Math.min(4, (width - 88) / (right - left), (height - 104) / (bottom - top));
  const originX = (width - (right - left) * zoom) / 2 - left * zoom;
  const originY = (height - (bottom - top) * zoom) / 2 - top * zoom;
  $('zoom-label').textContent = `表示倍率 ${Number(zoom.toFixed(2))}×`;
  ctx.strokeStyle = '#62738b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(24, originY);
  ctx.lineTo(width - 24, originY);
  ctx.stroke();
  ctx.fillStyle = '#c1cddd';
  ctx.font = '11px "Yu Gothic UI", sans-serif';
  ctx.fillText('基準の下端 / Y = 0', 16, originY + 17);
  // 1. Reference text remains at vanilla size and position as the head changes.
  if (referenceText) {
    const textX = originX + left * zoom;
    const textY = originY - 7 * zoom;
    if (shadow) ctx.drawImage(referenceShadow, textX + zoom, textY + zoom, textWidth * zoom, 8 * zoom);
    ctx.drawImage(referenceText, textX, textY, textWidth * zoom, 8 * zoom);
  }
  composeHead();
  const x = originX;
  const y = originY + (offset - size) * zoom;
  if (skin) {
    if (shadow) {
      // Multiply RGB by 63/255 while keeping the face/hat alpha unchanged.
      const shaded = document.createElement('canvas');
      shaded.width = shaded.height = 8;
      const shadedCtx = shaded.getContext('2d');
      shadedCtx.drawImage(face, 0, 0);
      const pixels = shadedCtx.getImageData(0, 0, 8, 8);
      for (let i = 0; i < pixels.data.length; i += 4) {
        for (let channel = 0; channel < 3; channel++) pixels.data[i + channel] = Math.round(pixels.data[i + channel] * 63 / 255);
      }
      shadedCtx.putImageData(pixels, 0, 0);
      ctx.drawImage(shaded, x + zoom, y + zoom, size * zoom, size * zoom);
    }
    ctx.drawImage(face, x, y, size * zoom, size * zoom);
  }
  ctx.setLineDash([4, 3]);
  ctx.strokeStyle = '#b4c1d3';
  ctx.strokeRect(originX, originY - 8 * zoom, 8 * zoom, 8 * zoom);
  ctx.setLineDash([]);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    const timer = setTimeout(() => { image.src = ''; reject(new Error('スキン取得がタイムアウトしました。')); }, 15000);
    image.onload = () => {
      clearTimeout(timer);
      if (image.naturalWidth !== 64 || ![32, 64].includes(image.naturalHeight)) {
        reject(new Error('64×64または64×32のスキンPNGを選んでください。'));
      } else {
        // Ensure the image can be sampled without tainting the preview canvas.
        const probe = document.createElement('canvas');
        probe.width = probe.height = 1;
        const probeCtx = probe.getContext('2d');
        try {
          probeCtx.drawImage(image, 0, 0);
          probeCtx.getImageData(0, 0, 1, 1);
          resolve(image);
        } catch {
          reject(new Error('このスキンを読み込めません。PNGを選んでください。'));
        }
      }
    };
    image.onerror = () => { clearTimeout(timer); reject(new Error('スキンを取得できませんでした。MCIDを確認するか、PNGを選んでください。')); };
    image.src = src;
  });
}

async function setSkin(src, message) {
  const id = ++requestId;
  $('skin-status').textContent = 'スキンを読み込み中…';
  try {
    const image = await loadImage(src);
    if (id !== requestId) return;
    skin = image;
    $('skin-status').textContent = message;
    draw();
  } catch (error) {
    if (id === requestId) $('skin-status').textContent = error.message + ' 現在のスキンを維持します。';
  }
}

form.addEventListener('submit', event => event.preventDefault());
form.addEventListener('input', update);
form.addEventListener('change', update);
$('size-range').addEventListener('input', () => { $('size').value = $('size-range').value; update(); });
$('offset-range').addEventListener('input', () => { $('offset').value = $('offset-range').value; update(); });
form.addEventListener('reset', () => {
  setTimeout(() => { update(); setSkin('assets/alex.png', '標準Alexを表示しています。'); }, 0);
});
$('load-skin').addEventListener('click', () => {
  const player = $('player').value.trim();
  if (!/^[A-Za-z0-9_]{1,16}$/.test(player)) { update(); return; }
  setSkin(`https://mc-heads.net/skin/${encodeURIComponent(player)}`, `${player}のスキンを表示しています。`);
});
$('player').addEventListener('input', () => {
  $('skin-status').textContent = 'MCIDを変更しました。「スキン取得」でプレビューを更新できます。';
});
$('default-skin').addEventListener('click', () => setSkin('assets/alex.png', '標準Alexを表示しています。'));
$('skin-file').addEventListener('change', async event => {
  const file = event.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  try { await setSkin(url, `${file.name}を表示しています。`); }
  finally { URL.revokeObjectURL(url); event.target.value = ''; }
});
async function copyText(text, label = 'コマンド') {
  if (!valid) return;
  const componentOnly = label !== 'コマンド';
  try {
    await navigator.clipboard.writeText(text);
    $('json-copy-fallback').hidden = true;
    $('copy-status').textContent = `${label}をコピーしました。`;
  } catch {
    const field = componentOnly ? $('json-copy-fallback') : $('command');
    if (componentOnly) { field.value = text; field.hidden = false; }
    field.focus();
    field.select();
    $('copy-status').textContent = `選択した${label}をCtrl+Cでコピーしてください。`;
  }
}
$('copy').addEventListener('click', () => copyText($('command').value));
$('copy-json').addEventListener('click', () => copyText(currentJSON, '正規JSON'));
$('copy-component').addEventListener('click', () => copyText(currentComponent, 'テキストコンポーネント'));
new ResizeObserver(draw).observe($('preview-stage'));
update();
setSkin('assets/alex.png', '標準Alexを表示しています。');
loadReferenceText().catch(() => {
  $('skin-status').textContent = '比較用フォントを読み込めませんでした。ページを再読み込みしてください。';
});
