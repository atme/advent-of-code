const parse = data => data.toString().trim().split("\n");

exports.first = d => {
  const [ wire1, wire2 ] = parse(d);
  console.log( closestDistance(wire1, wire2) );
};


exports.second = d => {
  const [ wire1, wire2 ] = parse(d);
  console.log( minSteps(wire1, wire2) );
};


// Part One
const closestDistance = (wire1, wire2) => {
  const path1 = path(wire1);
  const path2 = path(wire2);
  return cross(path1, path2).map(distance).reduce(min);
}
exports.closestDistance = closestDistance;


// Part Two
const minSteps = (wire1, wire2) => {
  const path1 = path(wire1);
  const path2 = path(wire2);
  const crossPoints = cross(path1, path2);
  const steps1 = crossPoints.map(point => steps(point, path1));
  const steps2 = crossPoints.map(point => steps(point, path2));
  return steps1.map((step, index) => step + steps2[index]).reduce(min);
};
exports.minSteps = minSteps;


// Helpers
const min = (acc, value) => acc < value ? acc : value;
const distance = point => Math.abs(point.x) + Math.abs(point.y);
const equal = (p1, p2) => p1.x === p2.x && p1.y === p2.y
const steps = (point, path) => path.findIndex(p => equal(p, point)) + 1;
const range = steps => Array.from(Array(steps));
const point = (x = 0, y = 0) => ({x, y});
const add = (p1, p2) => point(p1.x + p2.x, p1.y + p2.y);


const path = wire => {
  let current = point();

  const generate = route => {
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
        direction.x = 1;
        break;
    }

    const steps = parseInt(route.slice(1));
    return range(steps).map(_ => {
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
  for (const [x, elements] of map1) {
    if (map2.has(x)) {
      elements
        .filter(y => map2.get(x).indexOf(y) !== -1)
        .forEach(y => {
          result.push( point(x, y) );
        });
    }
  }
  return result;
};


// Optimization
const fold = path => {
  const map = new Map();
  for (const {x, y} of path) {
    if (!map.has(x)) {
      map.set(x, []);
    }
    map.get(x).push(y);
  }
  return map;
};
