import test from 'node:test';
import assert from 'node:assert/strict';
import { generate } from '../docs/converter.mjs';

test('default: Alex, 8x8, Y0, actionbar, matching shadow bytes', () => {
  assert.equal(generate().command, '/title @a actionbar {player:"Alex",hat:true,color:"#fe0880",shadow_color:-194432}');
});
test('one-unit values: 17x17, UI Y+3 moves upwards', () => {
  const result = generate({ player: 'NeAc', size: 17, offset: 3 });
  assert.equal(result.color, '#fe117d');
  assert.equal(result.shadowColor, -192131);
  assert.equal(result.shadowHex, '0xfffd117d');
});
test('extreme size and offset bytes', () => {
  const smallest = generate({ size: 1, offset: 128 });
  assert.equal(smallest.color, '#fe0100');
  assert.equal(smallest.shadowColor, -196352);
  const largest = generate({ size: 255, offset: -127 });
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
  for (const offset of [-128, 129, 0.5, NaN]) assert.throws(() => generate({ offset }));
  for (const player of ['', 'bad name', '"NeAc"', '12345678901234567']) assert.throws(() => generate({ player }));
  assert.throws(() => generate({ target: '@e' }));
  assert.throws(() => generate({ mode: 'other' }));
});
