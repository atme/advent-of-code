const day10 = require('../src/day10');

test('day 10-1-1 find best location', () => {
  const data = `
    .#..#
    .....
    #####
    ....#
    ...##`;
  const map = day10.asteroidMap(data, 20);
  const result = day10.multiply(20)({ x: 3, y: 4 });
  expect(day10.bestLocation(map)).toStrictEqual(result);
});

test('day 10-1-2 find best location', () => {
  const data = `
    ......#.#.
    #..#.#....
    ..#######.
    .#.#.###..
    .#..#.....
    ..#....#.#
    #..#....#.
    .##.#..###
    ##...#..#.
    .#....####`;
  const map = day10.asteroidMap(data, 20);
  const result = day10.multiply(20)({ x: 5, y: 8 });
  expect(day10.bestLocation(map)).toStrictEqual(result);
});

test('day 10-1-3 count asteroids correct', () => {
  const data = `
    ......#.#.
    #..#.#....
    ..#######.
    .#.#.###..
    .#..#.....
    ..#....#.#
    #..#....#.
    .##.#..###
    ##...#..#.
    .#....####`;
  const map = day10.asteroidMap(data);
  const bestLocation = day10.bestLocation(map);
  expect(day10.seeableAsteroids(bestLocation, map)).toHaveLength(33);
});

test('day 10-1-4 count asteroids correct', () => {
  const data = `
    .#..##.###...#######
    ##.############..##.
    .#.######.########.#
    .###.#######.####.#.
    #####.##.#.##.###.##
    ..#####..#.#########
    ####################
    #.####....###.#.#.##
    ##.#################
    #####.##.###..####..
    ..######..##.#######
    ####.##.####...##..#
    .#####..#.######.###
    ##...#.##########...
    #.##########.#######
    .####.#.###.###.#.##
    ....##.##.###..#####
    .#.#.###########.###
    #.#.#.#####.####.###
    ###.##.####.##.#..##`;
  const map = day10.asteroidMap(data);
  const bestLocation = day10.bestLocation(map);
  expect(day10.seeableAsteroids(bestLocation, map)).toHaveLength(210);
});

test('day 10-2-1 clockwise vaporize correct asteroid', () => {
  const data = `
    .#..##.###...#######
    ##.############..##.
    .#.######.########.#
    .###.#######.####.#.
    #####.##.#.##.###.##
    ..#####..#.#########
    ####################
    #.####....###.#.#.##
    ##.#################
    #####.##.###..####..
    ..######..##.#######
    ####.##.####...##..#
    .#####..#.######.###
    ##...#.##########...
    #.##########.#######
    .####.#.###.###.#.##
    ....##.##.###..#####
    .#.#.###########.###
    #.#.#.#####.####.###
    ###.##.####.##.#..##`;
  const map = day10.asteroidMap(data);
  const bestLocation = day10.bestLocation(map);
  const result = day10.multiply(20)({ x: 11, y: 12 });
  expect(day10.findVaporizedAsteroid(1, bestLocation, map))
    .toStrictEqual(result);
});
