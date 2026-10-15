import test from 'node:test';
import assert from 'node:assert/strict';
import { generate, decodeColor } from '../docs/converter.mjs';

test('body and shadow colors restore size and offset across all byte values', () => {
  for (let size = 1; size <= 255; size++) {
    for (let offset = -128; offset <= 127; offset++) {
      const encoded = generate({ size, offset });
      const expected = { size, offset };
      assert.deepEqual(decodeColor(encoded.color), expected);
      assert.deepEqual(decodeColor(encoded.shadowColor), expected);
      assert.deepEqual(decodeColor(encoded.shadowHex), expected);
    }
  }
});

test('decoder accepts uppercase, whitespace and legacy color, rejects unrelated colors', () => {
  assert.deepEqual(decodeColor(' #FE0880 '), { size: 8, offset: 0 });
  assert.deepEqual(decodeColor('#fffffe'), { size: 24, offset: 0 });
  for (const value of ['', '#ffffff', '#fe0080', '0', '4294967296', '-2147483649', '#fe0880oops', '1.5']) {
    assert.throws(() => decodeColor(value));
  }
});

test('default: Alex, 8x8, Y0, tellraw, matching shadow bytes', () => {
  assert.equal(generate().command, '/tellraw @a {player:"Alex",color:"#fe0880",shadow_color:-194432}');
});
test('JSON-only output parses as a text component with correct field types', () => {
  assert.deepEqual(JSON.parse(generate().json), { player: 'Alex', color: '#fe0880', shadow_color: -194432 });
  assert.equal(JSON.parse(generate({ hat: false }).json).hat, false);
});
test('one-unit values: 17x17, Y-3 moves upwards', () => {
  const result = generate({ player: 'NeAc', size: 17, offset: -3 });
  assert.equal(result.color, '#fe117d');
  assert.equal(result.shadowColor, -192131);
  assert.equal(result.shadowHex, '0xfffd117d');
});
test('extreme size and offset bytes', () => {
  const smallest = generate({ size: 1, offset: -128 });
  assert.equal(smallest.color, '#fe0100');
  assert.equal(smallest.shadowColor, -196352);
  const largest = generate({ size: 255, offset: 127 });
  assert.equal(largest.color, '#feffff');
  assert.equal(largest.shadowColor, -131073);
});
test('shadow off and hat off, tellraw target', () => {
  assert.equal(generate({ shadow: false, hat: false, target: '@s', mode: 'tellraw' }).command, '/tellraw @s {player:"Alex",hat:false,color:"#fe0880",shadow_color:0}');
});
test('subtitle and title are generated as title subcommands', () => {
  assert.match(generate({ mode: 'subtitle', target: '@p' }).command, /^\/title @p subtitle /);
  assert.match(generate({ mode: 'title' }).command, /^\/title @a title /);
});
test('invalid and fractional values cannot create commands', () => {
  for (const size of [0, 256, 3.5, NaN, Infinity]) assert.throws(() => generate({ size }));
  for (const offset of [-129, 128, 0.5, NaN]) assert.throws(() => generate({ offset }));
  for (const player of ['', 'bad name', '"NeAc"', '12345678901234567']) assert.throws(() => generate({ player }));
  assert.throws(() => generate({ target: '@e' }));
  assert.throws(() => generate({ mode: 'other' }));
});
