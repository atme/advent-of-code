const requireFuel = (mass) => Math.floor(mass / 3) - 2;

const requireFullFuel = (mass, sum = 0) => {
  const fuel = requireFuel(mass);
  return fuel > 0 ? requireFullFuel(fuel, sum + fuel) : sum;
};


exports.first = (d) => {
  const sum = d
    .trim()
    .split('\n')
    .map(requireFuel)
    .reduce((a, b) => a + b);
  console.log(sum.toString());
};

exports.second = (d) => {
  const sum = d
    .trim()
    .split('\n')
    .map((mass) => requireFullFuel(mass))
    .reduce((a, b) => a + b);
  console.log(sum.toString());
};
