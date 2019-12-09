const min = (acc, value) => (acc < value ? acc : value);
const distance = (point) => Math.abs(point.x) + Math.abs(point.y);
const equal = (p1, p2) => p1.x === p2.x && p1.y === p2.y;
const steps = (path) => (point) => path.findIndex((p) => equal(p, point)) + 1;
const range = (r) => Array.from(Array(r));
const point = (x = 0, y = 0) => ({ x, y });
const add = (p1, p2) => point(p1.x + p2.x, p1.y + p2.y);


// Optimization
const fold = (path) => {
  const map = new Map();
  path.forEach(({ x, y }) => {
    if (!map.has(x)) {
      map.set(x, []);
    }
    map.get(x).push(y);
  });
  return map;
};


const path = (wire) => {
  let current = point();

  const generate = (route) => {
    const direction = point();
    switch (route.slice(0, 1)) {
      case 'U':
        direction.y = 1;
        break;
      case 'D':
        direction.y = -1;
        break;
      case 'L':
        direction.x = -1;
        break;
      case 'R':
      default:
        direction.x = 1;
        break;
    }

    const r = parseInt(route.slice(1), 10);
    return range(r).map(() => {
      current = add(current, direction);
      return current;
    });
  };

  return wire.split(',').flatMap(generate);
};


const cross = (path1, path2) => {
  const map1 = fold(path1);
  const map2 = fold(path2);
  const result = [];
  map1.forEach((elements, x) => {
    if (map2.has(x)) {
      elements
        .filter((y) => map2.get(x).indexOf(y) !== -1)
        .forEach((y) => {
          result.push(point(x, y));
        });
    }
  });
  return result;
};


// Part One
const closestDistance = (wire1, wire2) => {
  const path1 = path(wire1);
  const path2 = path(wire2);
  return cross(path1, path2).map(distance).reduce(min);
};
exports.closestDistance = closestDistance;


// Part Two
const minSteps = (wire1, wire2) => {
  const path1 = path(wire1);
  const path2 = path(wire2);
  const crossPoints = cross(path1, path2);
  const steps1 = crossPoints.map(steps(path1));
  const steps2 = crossPoints.map(steps(path2));
  return steps1.map((step, index) => step + steps2[index]).reduce(min);
};
exports.minSteps = minSteps;


const parse = (data) => data.trim().split('\n');

exports.first = (d) => {
  const [wire1, wire2] = parse(d);
  console.log(closestDistance(wire1, wire2));
};


exports.second = (d) => {
  const [wire1, wire2] = parse(d);
  console.log(minSteps(wire1, wire2));
};
