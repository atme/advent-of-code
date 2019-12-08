const day08 = require('../src/day08');

test('day 8-1 image is decoded correct', () => {
  const image = '123456789012';
  const wide = 3;
  const tall = 2;
  const layers = [
    [ [1, 2, 3], [4, 5, 6] ],
    [ [7, 8, 9], [0, 1, 2] ],
  ];
  expect(day08.decode(image, wide, tall)).toStrictEqual(layers);
});

test('day 8-2 image is drawn correct', () => {
  const image = '0222112222120000';
  const wide = 2;
  const tall = 2;
  const result = [
    [ 0, 1 ],
    [ 1, 0 ],
  ];
  const layers = day08.decode(image, wide, tall);
  expect(day08.unite(layers)).toStrictEqual(result);
});
