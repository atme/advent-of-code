const counter = (index) => {
  let num = index;
  return () => {
    num += 1;
    return num;
  };
};

// -- Intcode computer

const end = () => null;

const value = (mode, memory, index) => (
  mode === 1
    ? memory[index]
    : memory[memory[index]]
);

const add = (memory, index, mode) => {
  const next = counter(index);
  const values = [
    value(mode[0], memory, next()),
    value(mode[1], memory, next()),
  ];
  const output = memory[next()];
  const mem = [...memory];
  mem[output] = values[0] + values[1];
  return [mem, next()];
};

const multiply = (memory, index, mode) => {
  const next = counter(index);
  const values = [
    value(mode[0], memory, next()),
    value(mode[1], memory, next()),
  ];
  const output = memory[next()];
  const mem = [...memory];
  mem[output] = values[0] * values[1];
  return [mem, next()];
};

const jumpIfTrue = (memory, index, mode) => {
  const next = counter(index);
  const cond = value(mode[0], memory, next());
  const pointer = value(mode[1], memory, next());
  return [memory, cond !== 0 ? pointer : next()];
};

const jumpIfFalse = (memory, index, mode) => {
  const next = counter(index);
  const cond = value(mode[0], memory, next());
  const pointer = value(mode[1], memory, next());
  return [memory, cond === 0 ? pointer : next()];
};

const lessThan = (memory, index, mode) => {
  const next = counter(index);
  const params = [
    value(mode[0], memory, next()),
    value(mode[1], memory, next()),
  ];
  const output = memory[next()];
  const mem = [...memory];
  mem[output] = params[0] < params[1] ? 1 : 0;
  return [mem, next()];
};

const equal = (memory, index, mode) => {
  const next = counter(index);
  const params = [
    value(mode[0], memory, next()),
    value(mode[1], memory, next()),
  ];
  const output = memory[next()];
  const mem = [...memory];
  mem[output] = params[0] === params[1] ? 1 : 0;
  return [mem, next()];
};

const input = (memory, index, command) => (_input) => {
  const next = counter(index);
  const output = memory[next()];
  const mem = [...memory];
  mem[output] = _input;
  return command(mem, next());
};

const output = (memory, index, mode) => [
  value(mode[0], memory, index + 1),
  memory,
  index + 2,
];

/**
 * Execute instruction
 * @param {Array.<number>} memory
 * @param {number} index Index of command
 * @returns {function|[number, function]|[number, null]}
 * - Program is finished and should immediately halt if second argument of
 * result is null
 */
const command = (memory, index) => {
  const code = memory[index].toString().padStart(5, 0);
  const instruction = parseInt(code.slice(-2), 10);
  const mode = code.slice(0, -2).split('').reverse().map(Number);

  switch (instruction) {
    case 1:
      return command(...add(memory, index, mode));
    case 2:
      return command(...multiply(memory, index, mode));
    case 3:
      return input(memory, index, command);
    case 4: {
      const [result, ...params] = output(memory, index, mode);
      return [result, command(...params)];
    }
    case 5:
      return command(...jumpIfTrue(memory, index, mode));
    case 6:
      return command(...jumpIfFalse(memory, index, mode));
    case 7:
      return command(...lessThan(memory, index, mode));
    case 8:
      return command(...equal(memory, index, mode));
    case 99:
    default:
      return end();
  }
};


/**
 * Execute opcode
 * @param {Array.<number>} opcode
 * @returns {function}
 */
const intcode = (opcode) => command([...opcode], 0);


const ampflier = (phase, opcode) => intcode(opcode)(phase);
exports.ampflier = ampflier;


const runAmpfliers = (opcode, phases) => {
  const ampfliers = phases.map((phase) => ampflier(phase, opcode));
  let result = 0;
  while (ampfliers.indexOf(null) === -1) {
    for (let i = 0; i < ampfliers.length; i += 1) {
      [result, ampfliers[i]] = ampfliers[i](result);
    }
  }
  return result;
};
exports.runAmpfliers = runAmpfliers;


const sequences = (sequence) => {
  if (sequence.length < 2) {
    return sequence;
  }
  if (sequence.length === 2) {
    return [sequence, [sequence[1], sequence[0]]];
  }
  return sequence.flatMap((element, index) => {
    const rest = sequence.slice(0, index).concat(sequence.slice(index + 1));
    return sequences(rest).map((seq) => [element].concat(seq));
  });
};


// Part One
const signals = (opcode) => sequences([0, 1, 2, 3, 4]).map(
  (phases) => runAmpfliers(opcode, phases),
);
exports.signals = signals;

// Part Two
const signalsLoop = (opcode) => sequences([5, 6, 7, 8, 9]).map(
  (phases) => runAmpfliers(opcode, phases),
);
exports.signalsLoop = signalsLoop;


const parse = (d) => d.split(',').map(Number);

exports.first = (d) => {
  const opcode = parse(d);
  console.log(Math.max(...signals(opcode)));
};

exports.second = (d) => {
  const opcode = parse(d);
  console.log(Math.max(...signalsLoop(opcode)));
};
