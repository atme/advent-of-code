const day05 = require('../src/day05');

test('day 5-1 should have correct output', () => {
  const opcode = [1002, 4, 3, 4, 33];
  expect(day05.run(opcode, 0).output).toBe(0);
});

test('day 5-1 should have correct array', () => {
  const opcode = [1002, 4, 3, 4, 33];
  expect(day05.run(opcode, 0).memory).toStrictEqual([1002, 4, 3, 4, 99]);
});

test('day 5-1 input is equal to 8', () => {
  const opcode = [3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8];
  expect(day05.run(opcode, 8).output).toBe(1);
});

test('day 5-1 input is not equal to 8', () => {
  const opcode = [3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8];
  expect(day05.run(opcode, 5).output).toBe(0);
});

test('day 5-1 input is less than 8', () => {
  const opcode = [3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8];
  expect(day05.run(opcode, 7).output).toBe(1);
});

test('day 5-1 input is not less than 8', () => {
  const opcode = [3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8];
  expect(day05.run(opcode, 8).output).toBe(0);
});
