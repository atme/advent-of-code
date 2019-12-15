const coordinates = (line, y) => line.map(
  (point, x) => (point === '#' ? { x, y } : { x: -1, y: -1 }),
);

const isAsteroid = (coordinate) => coordinate.x !== -1;

// Bresenham's line algorithm
const pathTo = (asteroid1) => (asteroid2) => {
  const path = [];
  const dx = Math.abs(asteroid1.x - asteroid2.x);
  const dy = Math.abs(asteroid1.y - asteroid2.y);
  const directionY = asteroid1.y - asteroid2.y < 0 ? 1 : -1;
  const directionX = asteroid1.x - asteroid2.x < 0 ? 1 : -1;

  let error = 0;
  if (dx > dy) {
    let { y } = asteroid1;
    for (let { x } = asteroid1; x !== asteroid2.x; x += directionX) {
      path.push({ x, y });
      error += dy;
      if (2 * error >= dx) {
        y += directionY;
        error -= dx;
      }
    }
  } else {
    let { x } = asteroid1;
    for (let { y } = asteroid1; y !== asteroid2.y; y += directionY) {
      path.push({ x, y });
      error += dx;
      if (2 * error >= dy) {
        x += directionX;
        error -= dy;
      }
    }
  }
  path.push(asteroid2);
  return path;
};

const equal = (coordinate1) => (coordinate2) => coordinate1.x === coordinate2.x
  && coordinate1.y === coordinate2.y;

const notEqual = (coordinate1) => (coordinate2) => !equal(coordinate1)(coordinate2);

const notSame = (index1) => (_, index2) => index1 !== index2;

const cross = (path1) => (path2) => {
  if (path1.length <= path2.length) {
    return false;
  }
  return equal(path1[path2.length - 1])(path2[path2.length - 1]);
};

const attainable = (path, index, paths) => paths
  .filter(notSame(index))
  .find(cross(path)) === undefined;

const paths = (asteroid, index, asteroids) => asteroids
  .filter(notSame(index))
  .map(pathTo(asteroid))
  .filter(attainable);

const max = (acc, value) => (acc.length > value.length ? acc : value);

const multiply = (factor) => (coordinate) => (
  { x: coordinate.x * factor, y: coordinate.y * factor }
);
exports.multiply = multiply;

const parse = (map) => map
  .trim()
  .split('\n')
  .map((line) => line.trim())
  .map((line) => line.split(''));

const asteroidMap = (map, accuracy = 20) => parse(map)
  .flatMap(coordinates)
  .filter(isAsteroid)
  .map(multiply(accuracy));
exports.asteroidMap = asteroidMap;

const bestLocation = (map) => map
  .map(paths)
  .reduce(max)
  .pop()
  .shift();
exports.bestLocation = bestLocation;

const seeableAsteroids = (asteroid, map) => map
  .filter(notEqual(asteroid))
  .map(pathTo(asteroid))
  .filter(attainable)
  .map((path) => path.pop());
exports.seeableAsteroids = seeableAsteroids;

const sub = (vector1, vector2) => (
  { x: vector1.x - vector2.x, y: vector1.y - vector2.y }
);

const clockwise = (location) => (asteroid1, asteroid2) => {
  const coordinate1 = sub(asteroid1, location);
  const coordinate2 = sub(asteroid2, location);

  const angle1 = Math.atan2(coordinate1.x, coordinate1.y);
  const angle2 = Math.atan2(coordinate2.x, coordinate2.y);
  if (angle1 < angle2) {
    return 1;
  }
  if (angle1 > angle2) {
    return -1;
  }
  return 0;
};

const undestroyed = (asteroids) => (coordinate) => asteroids
  .find(equal(coordinate)) !== undefined;

const findVaporizedAsteroid = (number, location, _map) => {
  let index = number - 1; // index starts from 0
  let asteroids = [];
  let map = [..._map];

  do {
    index -= asteroids.length;
    asteroids = seeableAsteroids(location, map);
    map = map.filter(undestroyed(asteroids));
  } while (asteroids.length < index);

  asteroids.sort(clockwise(location));
  return asteroids[index];
};
exports.findVaporizedAsteroid = findVaporizedAsteroid;

exports.first = (d) => {
  const map = asteroidMap(d, 20);
  const location = bestLocation(map);
  console.log(seeableAsteroids(location, map).length);
};

exports.second = (d) => {
  const map = asteroidMap(d, 20);
  const location = bestLocation(map);
  const asteroid = findVaporizedAsteroid(200, location, map);
  console.log((asteroid.x / 20) * 100 + asteroid.y / 20);
};
