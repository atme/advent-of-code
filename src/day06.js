const parse = d => d.trim().split("\n");

exports.first = d => {
  const orbits = parse(d);
  console.log ( count(orbits) );
};

exports.second = d => {
  const orbits = parse(d);
  console.log ( transfers(orbits) );
};

// Part One
const count = orbits => map(orbits).parents().reduce(sum);
exports.count = count;

// Part Two
const transfers = orbits => {
  const you = 'YOU';
  const santa = 'SAN';
  return map(orbits).distance(you, santa);
};
exports.transfers = transfers;

const map = orbits => new OrbitMap( orbits.map(o => o.split(')')) );
const sum = (acc, val) => acc + val;

class OrbitMap {
  constructor(orbits) {
    this.orbits = {};
    for (const orbit of orbits) {
      this.orbits[orbit[1]] = orbit[0];
    }
  }

  parents() {
    const result = []; 
    for (const i in this.orbits) {
      result.push( this.path(i).length );
    }
    return result;
  }

  path(i) {
    if (this.orbits.hasOwnProperty(i)) {
      const path = this.path(this.orbits[i]);
      path.push(i);
      return path;
    }
    return [];
  }

  distance(from, to) {
    const from_path = this.path(from).reverse();
    const to_path = this.path(to).reverse();
    const cross = this.cross(from_path, to_path);

    // remove 'YOU' and 'SAN'
    from_path.shift()
    to_path.shift();

    return from_path.indexOf(cross) + to_path.indexOf(cross);
  }

  cross(path1, path2) {
    for (const point of path1) {
      if (path2.indexOf(point) !== -1) {
        return point;
      }
    }
  }
}
