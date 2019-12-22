const not = (index1) => (_, index2) => index1 !== index2;

const gravity = (planet, otherPlanets) => {
  const { position, velocity } = { ...planet };
  otherPlanets.forEach((p) => {
    velocity.x += Math.sign(p.position.x - position.x);
    velocity.y += Math.sign(p.position.y - position.y);
    velocity.z += Math.sign(p.position.z - position.z);
  });
  return { position, velocity };
};

const applyVelocity = (planet) => {
  const { position, velocity } = { ...planet };
  position.x += velocity.x;
  position.y += velocity.y;
  position.z += velocity.z;
  return { position, velocity };
};

const applyGravity = (planet, index, planets) => gravity(
  planet,
  planets.filter(not(index)),
);

const step = (planets) => planets.map(applyGravity).map(applyVelocity);
exports.step = step;

const steps = (planets, amount) => {
  let space = [...planets];
  for (let i = 0; i < amount; i += 1) {
    space = step(space);
  }
  return space;
};
exports.steps = steps;

const sum = ({ x, y, z }) => Math.abs(x) + Math.abs(y) + Math.abs(z);

const totalEnergy = (planets) => planets.map(
  ({ position, velocity }) => sum(position) * sum(velocity),
).reduce((a, b) => a + b);
exports.totalEnergy = totalEnergy;

const sameCoordinate = (planet1, planet2, axis) => (
  planet1.position[axis] === planet2.position[axis]
  && planet1.velocity[axis] === planet2.velocity[axis]
);

const same = (space1, space2, axis) => space1.reduce(
  (acc, value, index) => acc && sameCoordinate(value, space2[index], axis),
  true,
);

const period = (planets, axis) => {
  let space = JSON.parse(JSON.stringify(planets));
  let counter = 0;
  do {
    space = step(space);
    counter += 1;
  } while (!same(planets, space, axis));
  return counter;
};

const repeated = (planets) => {
  let result;
  const xPeriod = period(planets, 'x');
  const yPeriod = period(planets, 'y');
  const zPeriod = period(planets, 'z');
  const isWrong = (p) => result % p !== 0;
  for (let i = 1; isWrong(yPeriod) || isWrong(zPeriod); i += 1) {
    result = i * xPeriod;
  }
  return result;
};
exports.repeated = repeated;

const parse = (d) => d.trim().split('\n').map((line) => {
  const position = { x: 0, y: 0, z: 0 };
  const velocity = { x: 0, y: 0, z: 0 };
  line.match(/<(.*?)>/).pop().split(/,\s/).forEach((coordinate) => {
    const [axis, value] = coordinate.split('=');
    position[axis] = parseInt(value, 10);
  });
  return { position, velocity };
});

exports.first = (d) => {
  const planets = parse(d);
  const space = steps(planets, 1000);
  console.log(totalEnergy(space));
};

exports.second = (d) => {
  const planets = parse(d);
  console.log(repeated(planets));
};
