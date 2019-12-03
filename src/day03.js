const parse = data => data.toString().trim().split("\n");

exports.first = d => {
  const [ wire1, wire2 ] = parse(d);
  console.log( closestDistance(wire1, wire2) );
};


exports.second = d => {
  const [ wire1, wire2 ] = parse(d);
  console.log( minSteps(wire1, wire2) );
};


const closestDistance = (wire1, wire2) => {
  const path1 = path(wire1);
  const path2 = path(wire2);
  return cross(path1, path2).map(distance).reduce(min);
}
exports.closestDistance = closestDistance;


const minSteps = (wire1, wire2) => {
  const path1 = path(wire1);
  const path2 = path(wire2);
  const crossPoints = cross(path1, path2);
  const steps1 = crossPoints.map(point => steps(point, path1));
  const steps2 = crossPoints.map(point => steps(point, path2));
  return steps1.map((step, index) => step + steps2[index]).reduce(min);
};
exports.minSteps = minSteps;


const min = (acc, value) => acc < value ? acc : value;
const distance = point => Math.abs(point.x) + Math.abs(point.y);
const cross = (path1, path2) => {
  path1 = index(path1);
  path2 = index(path2);
  const path = path1.map((elements, x) => {
    if (path2[x] === undefined) {
      return [];
    }
    return elements.filter(y => path2[x].indexOf(y) !== -1)
  });
  return deindex(path);
};


const path = wire => {
  let current = {x: 0, y: 0};

  const generate = route => {
    const direction = {x: 0, y: 0};
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
    return Array.from(Array(steps), _ => {
      current = add(current, direction);
      return current;
    });
  };

  return wire.split(',').flatMap(generate);
};


const add = (p1, p2) => ({
  x: p1.x + p2.x,
  y: p1.y + p2.y
});


const equal = (p1, p2) => p1.x === p2.x && p1.y === p2.y
const steps = (point, path) => path.findIndex(p => equal(p, point)) + 1;


const salt = 10000;

const index = path => {
  const result = [];
  path.forEach(element => {
    if (result[element.x + salt] !== undefined) {
      result[element.x + salt].push(element.y)
    } else {
      result[element.x + salt] = [element.y];
    }
  });
  return result;
};

const deindex = path => path.flatMap((elements, x) =>
  elements.map(y => ( {x: x - salt, y} ))
);
