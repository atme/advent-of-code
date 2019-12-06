const day06 = require('../src/day06');

test('day 6-1 returns correct total number of orbits', () => {
  const orbits = [
    'COM)B',
    'B)C',
    'C)D',
    'D)E',
    'E)F',
    'B)G',
    'G)H',
    'D)I',
    'E)J',
    'J)K',
    'K)L'
  ];
  expect(day06.count(orbits)).toBe(42);
});

test('day 6-2 returns minimum number of orbital transfers', () => {
  const orbits = [
    'COM)B',
    'B)C',
    'C)D',
    'D)E',
    'E)F',
    'B)G',
    'G)H',
    'D)I',
    'E)J',
    'J)K',
    'K)L',
    'K)YOU',
    'I)SAN'
  ];
  expect(day06.transfers(orbits)).toBe(4);
});
