exports.first = d => {
  const [ wire1, wire2 ] = d.toString().trim().split("\n");
  console.log(1);
  console.log( closestDistance(wire1, wire2) );
  console.log(2);
};


const closestDistance = (wire1, wire2) => {
  const path1 = path(wire1);
  const path2 = path(wire2);
  return cross(path1, path2).map(distance).reduce(min);
}
exports.closestDistance = closestDistance;


const min = (acc, value) => acc < value ? acc : value;
const distance = point => Math.abs(point.x) + Math.abs(point.y);
const cross = (path1, path2) => path1.filter(point => path2.has(point));


const path = wire => {
  let current = new Point(0, 0);

  const generate = route => {
    const direction = new Point(0, 0);
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
      current = current.add(direction);
      return current;
    });
  };

  return Path.from( wire.split(',') ).flatMap(generate);
};


class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  equal(point) {
    return this.x === point.x && this.y === point.y
  }

  add (point) {
    return new Point(this.x + point.x, this.y + point.y)
  }
}


class Path extends Array {
  has (point) {
    console.log(point);
    return this.find(p => point.equal(p));
  }
}
