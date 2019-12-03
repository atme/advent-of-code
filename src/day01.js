exports.first = d => {
  const sum = d
    .toString()
    .trim()
    .split("\n")
    .map(requireFuel)
    .reduce((a, b) => a + b);
  process.stdout.write(sum.toString() + "\n");
}

exports.second = d => {
  const sum = d
    .toString()
    .trim()
    .split("\n")
    .map(mass => requireFullFuel(mass))
    .reduce((a, b) => a + b);
  process.stdout.write(sum.toString() + "\n");
}

const requireFuel = mass => Math.floor(mass / 3) - 2;

const requireFullFuel = (mass, sum = 0) => {
  const fuel = requireFuel(mass);
  return fuel > 0 ? requireFullFuel(fuel, sum + fuel) : sum;
};
