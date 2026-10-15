// Size and offset are bytes, shared by the body and shadow markers.
export function decodeColor(input) {
  const value = String(input).trim();
  let packed;
  if (/^(?:#|0x)[0-9a-f]{6}(?:[0-9a-f]{2})?$/i.test(value)) {
    packed = Number.parseInt(value.replace(/^(#|0x)/i, ''), 16);
  } else if (/^-?\d+$/.test(value)) {
    packed = Number(value);
    if (!Number.isSafeInteger(packed) || packed < -2147483648 || packed > 4294967295) {
      throw new Error('色の整数は32ビットの範囲で入力してください。');
    }
  } else {
    throw new Error('色は #fe0880、0xfffd0880、-194432 のように入力してください。');
  }
  const rgb = packed & 0xffffff;
  if (rgb === 0xfffffe) return { size: 24, offset: 0 };
  const marker = rgb >>> 16;
  const size = (rgb >>> 8) & 0xff;
  if (![0xfe, 0xfd].includes(marker) || size === 0) {
    throw new Error('TextHeadGlyphのサイズ・Yオフセットが入った色を入力してください。');
  }
  return { size, offset: (rgb & 0xff) - 128 };
}

export function generate({ player = 'Alex', size = 8, offset = 0, shadow = true, hat = true, target = '@a', mode = 'tellraw' } = {}) {
  if (!/^[A-Za-z0-9_]{1,16}$/.test(player)) throw new Error('MCIDは英数字・_で1〜16文字にしてください。');
  if (!Number.isInteger(size) || size < 1 || size > 255) throw new Error('サイズは1〜255の整数にしてください。');
  if (!Number.isInteger(offset) || offset < -128 || offset > 127) throw new Error('Yオフセットは−128〜127の整数にしてください。');
  if (!['@a', '@s', '@p', '@r'].includes(target)) throw new Error('表示先を選択してください。');
  if (!['actionbar', 'title', 'subtitle', 'tellraw'].includes(mode)) throw new Error('表示方法を選択してください。');
  const hex = n => n.toString(16).padStart(2, '0');
  const encodedY = offset + 128;
  const payload = hex(size) + hex(encodedY);
  const color = '#fe' + payload;
  const shadowColor = shadow ? (0xfffd0000 | (size << 8) | encodedY) : 0;
  const component = `{player:"${player}"${hat ? '' : ',hat:false'},color:"${color}",shadow_color:${shadowColor}}`;
  const json = JSON.stringify({ player, ...(!hat ? { hat: false } : {}), color, shadow_color: shadowColor });
  const prefix = mode === 'tellraw' ? `/tellraw ${target}` : `/title ${target} ${mode}`;
  return { color, shadowColor, shadowHex: shadow ? '0xfffd' + payload : '0x00000000', component, json, command: `${prefix} ${component}` };
}
