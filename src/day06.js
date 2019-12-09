const samePointOn = (path) => (point) => path.indexOf(point) !== -1;
const cross = (path1, path2) => path1.find(samePointOn(path2));

class OrbitMap {
  constructor(orbits) {
    this.orbits = {};
    orbits.forEach((orbit) => {
      [this.orbits[orbit[1]]] = orbit;
    });
  }

  parents() {
    return Object.keys(this.orbits).map((key) => this.path(key).length);
  }

  path(i) {
    if (Object.prototype.hasOwnProperty.call(this.orbits, i)) {
      const path = this.path(this.orbits[i]);
      path.push(i);
      return path;
    }
    return [];
  }

  distance(from, to) {
    const fromPath = this.path(from).reverse();
    const toPath = this.path(to).reverse();
    const crossPoint = cross(fromPath, toPath);

    // remove 'YOU' and 'SAN'
    fromPath.shift();
    toPath.shift();

    return fromPath.indexOf(crossPoint) + toPath.indexOf(crossPoint);
  }
}

const split = (char) => (string) => string.split(char);
const map = (orbits) => new OrbitMap(orbits.map(split(')')));
const sum = (acc, val) => acc + val;


// Part One
const count = (orbits) => map(orbits).parents().reduce(sum);
exports.count = count;


// Part Two
const transfers = (orbits) => {
  const you = 'YOU';
  const santa = 'SAN';
  return map(orbits).distance(you, santa);
};
exports.transfers = transfers;


const parse = (d) => d.trim().split('\n');

exports.first = (d) => {
  const orbits = parse(d);
  console.log(count(orbits));
};

exports.second = (d) => {
  const orbits = parse(d);
  console.log(transfers(orbits));
};
