const day12 = require('../src/day12');

test('day 12-1-1 next step is correct', () => {
  const planets = [
    {
      position: { x: -1, y: 0, z: 2 },
      velocity: { x: 0, y: 0, z: 0 },
    },
    {
      position: { x: 2, y: -10, z: -7 },
      velocity: { x: 0, y: 0, z: 0 },
    },
    {
      position: { x: 4, y: -8, z: 8 },
      velocity: { x: 0, y: 0, z: 0 },
    },
    {
      position: { x: 3, y: 5, z: -1 },
      velocity: { x: 0, y: 0, z: 0 },
    },
  ];
  const result = [
    {
      position: { x: 2, y: -1, z: 1 },
      velocity: { x: 3, y: -1, z: -1 },
    },
    {
      position: { x: 3, y: -7, z: -4 },
      velocity: { x: 1, y: 3, z: 3 },
    },
    {
      position: { x: 1, y: -7, z: 5 },
      velocity: { x: -3, y: 1, z: -3 },
    },
    {
      position: { x: 2, y: 2, z: 0 },
      velocity: { x: -1, y: -3, z: 1 },
    },
  ];
  expect(day12.step(planets)).toStrictEqual(result);
});

test('day 12-1-2 gets total energy', () => {
  const planets = [
    {
      position: { x: -1, y: 0, z: 2 },
      velocity: { x: 0, y: 0, z: 0 },
    },
    {
      position: { x: 2, y: -10, z: -7 },
      velocity: { x: 0, y: 0, z: 0 },
    },
    {
      position: { x: 4, y: -8, z: 8 },
      velocity: { x: 0, y: 0, z: 0 },
    },
    {
      position: { x: 3, y: 5, z: -1 },
      velocity: { x: 0, y: 0, z: 0 },
    },
  ];
  const space = day12.steps(planets, 10);
  expect(day12.totalEnergy(space)).toBe(179);
});

test('day 12-1-3 gets total energy', () => {
  const planets = [
    {
      position: { x: -8, y: -10, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
    },
    {
      position: { x: 5, y: 5, z: 10 },
      velocity: { x: 0, y: 0, z: 0 },
    },
    {
      position: { x: 2, y: -7, z: 3 },
      velocity: { x: 0, y: 0, z: 0 },
    },
    {
      position: { x: 9, y: -8, z: -3 },
      velocity: { x: 0, y: 0, z: 0 },
    },
  ];
  const space = day12.steps(planets, 100);
  expect(day12.totalEnergy(space)).toBe(1940);
});

test('day 12-2-1 universe repeated', () => {
  const planets = [
    {
      position: { x: -1, y: 0, z: 2 },
      velocity: { x: 0, y: 0, z: 0 },
    },
    {
      position: { x: 2, y: -10, z: -7 },
      velocity: { x: 0, y: 0, z: 0 },
    },
    {
      position: { x: 4, y: -8, z: 8 },
      velocity: { x: 0, y: 0, z: 0 },
    },
    {
      position: { x: 3, y: 5, z: -1 },
      velocity: { x: 0, y: 0, z: 0 },
    },
  ];
  expect(day12.repeated(planets)).toBe(2772);
});

test('day 12-2-2 universe repeated', () => {
  const planets = [
    {
      position: { x: -8, y: -10, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
    },
    {
      position: { x: 5, y: 5, z: 10 },
      velocity: { x: 0, y: 0, z: 0 },
    },
    {
      position: { x: 2, y: -7, z: 3 },
      velocity: { x: 0, y: 0, z: 0 },
    },
    {
      position: { x: 9, y: -8, z: -3 },
      velocity: { x: 0, y: 0, z: 0 },
    },
  ];
  expect(day12.repeated(planets)).toBe(4686774924);
});
