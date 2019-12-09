const day09 = require('../src/day09');

test('day 9-1 produces a copy of itself as output', () => {
  const program = [
    109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99,
  ];
  expect(day09.getOutputs(program)).toStrictEqual(program);
});

test('day 9-1 should output a 16-digit number', () => {
  const program = [1102, 34915192, 34915192, 7, 4, 7, 99, 0];
  expect(day09.getOutputs(program).shift()).toBe(1219070632396864);
});

test('day 9-1 should output the large number in the middle', () => {
  const program = [104, 1125899906842624, 99];
  expect(day09.getOutputs(program).shift()).toBe(1125899906842624);
});
