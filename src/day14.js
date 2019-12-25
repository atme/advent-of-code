class Rest {
  constructor() {
    this.rest = {};
  }

  set(element, amount) {
    this.rest[element] = this.rest[element]
      ? amount
      : this.rest[element] + amount;
  }

  get(element, requiredAmount) {
    const amount = this.rest[element] ? this.rest[element] : 0;
    if (amount > requiredAmount) {
      this.rest[element] = amount - requiredAmount;
      return requiredAmount;
    }
    this.rest[element] = 0;
    return amount;
  }
}

const ore = (formulae, maxFuel = 1) => {
  let produce = [['FUEL', maxFuel]];
  let ores = 0;
  const rest = new Rest();

  while (produce.length > 0) {
    produce = produce.flatMap(([element, requiredAmount]) => {
      const amount = requiredAmount - rest.get(element, requiredAmount);
      if (element === 'ORE' || amount === 0) {
        return [];
      }
      const mul = Math.ceil(amount / formulae[element].count);
      rest.set(element, formulae[element].count * mul - amount);
      return formulae[element].reagents.map(([el, am]) => [el, am * mul]);
    });
    ores += produce.reduce((acc, [element, amount]) => (
      element === 'ORE' ? amount + acc : acc
    ), 0);
  }
  return ores;
};
exports.ore = ore;

const fuel = (formulae, maxOre) => {
  let fuelCount = Math.floor(maxOre / ore(formulae));
  let increment = maxOre / 100;
  while (increment >= 1) {
    let oreCount = 0;
    do {
      fuelCount += increment;
      oreCount = ore(formulae, fuelCount);
    } while (oreCount < maxOre);
    fuelCount -= increment;
    increment /= 10;
  }
  return fuelCount;
};
exports.fuel = fuel;

const parse = (d) => {
  const formulae = {};
  d.trim().split('\n').map((line) => line.trim()).forEach((line) => {
    const [inputs, output] = line.split(' => ');
    const [count, name] = output.split(' ');
    const reagents = inputs
      .split(', ')
      .map((input) => input.split(' ').reverse());
    formulae[name] = { count, reagents };
  });
  return formulae;
};
exports.parse = parse;

exports.first = (d) => {
  const formulae = parse(d);
  console.log(ore(formulae));
};

exports.second = (d) => {
  const formulae = parse(d);
  console.log(fuel(formulae, 1000000000000));
};
