// Size and offset are bytes, shared by the body and shadow markers.
export function generate({ player = 'Alex', size = 8, offset = 0, shadow = true, hat = true, target = '@a', mode = 'actionbar' } = {}) {
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
  const component = `{player:"${player}",hat:${Boolean(hat)},color:"${color}",shadow_color:${shadowColor}}`;
  const prefix = mode === 'tellraw' ? `/tellraw ${target}` : `/title ${target} ${mode}`;
  return { color, shadowColor, shadowHex: shadow ? '0xfffd' + payload : '0x00000000', component, command: `${prefix} ${component}` };
}
