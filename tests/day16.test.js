const day16 = require('../src/day16');

test('day 16-1 returns a correct output after one phase', () => {
  const input = [1, 2, 3, 4, 5, 6, 7, 8];
  expect(day16.phase(input)).toStrictEqual([4, 8, 2, 2, 6, 1, 5, 8]);
});

test('day 16-1 returns a correct output after 100 phases', () => {
  const input = Array.from('80871224585914546619083218645595').map(Number);
  expect(day16.repeatPhaseHundredTimes(input).slice(0, 8))
    .toStrictEqual([2, 4, 1, 7, 6, 1, 7, 6]);
});

test('day 16-2-1 returns a correct output after 100 phases', () => {
  const input = Array.from('03036732577212944063491565474664').map(Number);
  const offset = +input.slice(0, 7).join('');
  const signal = day16.repeatArray(10000, input).splice(offset);
  expect(day16.repeatHalfPhaseHundredTimes(signal).slice(0, 8))
    .toStrictEqual([8, 4, 4, 6, 2, 0, 2, 6]);
});

test('day 16-2-2 returns a correct output after 100 phases', () => {
  const input = Array.from('02935109699940807407585447034323').map(Number);
  const offset = +input.slice(0, 7).join('');
  const signal = day16.repeatArray(10000, input).slice(offset);
  expect(day16.repeatHalfPhaseHundredTimes(signal).slice(0, 8))
    .toStrictEqual([7, 8, 7, 2, 5, 2, 7, 0]);
});
