const parse = d => d.split(",").map(Number);

exports.first = d => {
  const opcode = parse(d);

  console.log ( Math.max(...signals(opcode)) );
};

exports.second = d => {
  const opcode = parse(d);

  console.log ( Math.max(...signals_loop(opcode)) );
};

// Part One
const signals = opcode =>
  sequences([0, 1, 2, 3, 4]).map(phases => ampfliers(opcode, phases));
exports.signals = signals;

// Part Two
const signals_loop = opcode =>
  sequences([5, 6, 7, 8, 9]).map(phases => ampfliers(opcode, phases));
exports.signals_loop = signals_loop;



// Helpers

const ampfliers = (opcode, phases) => {
  const ampfliers = phases.map(phase => ampflier(phase, opcode));
  let output = 0;
  while (ampfliers.indexOf(null) === -1) {
    for (let i = 0; i < ampfliers.length; i++) {
      [ output, ampfliers[i] ] = ampfliers[i](output);
    }
  }
  return output;
}
exports.ampfliers = ampfliers

const ampflier = (phase, opcode) => intcode(opcode)(phase);
exports.ampflier = ampflier;

const sequences = sequence => {
  if (sequence.length < 2) {
    return sequence;
  } else if (sequence.length == 2) {
    return [ sequence, [ sequence[1], sequence[0] ] ];
  }
  return sequence.flatMap(generate);
};

const generate = (element, index, sequence) => {
  const rest = sequence.slice(0, index).concat( sequence.slice(index + 1) );
  return sequences(rest).map(seq => [ element ].concat(seq));
};



// -- Intcode computer

/**
 * Execute opcode
 * @param {Array.<number>} opcode
 * @returns {function}
 */
const intcode = opcode => command([...opcode], 0);


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
  const instruction = parseInt( code.slice(-2) );
  const mode = code.slice(0, -2).split('').reverse().map(m => +m);

  switch (instruction) {
    case 99:
      return end();
    case 1:
      return add(memory, index, mode);
    case 2:
      return multiply(memory, index, mode);
    case 3:
      return input(memory, index);
    case 4:
      return output(memory, index, mode);
    case 5:
      return jump_if_true(memory, index, mode);
    case 6:
      return jump_if_false(memory, index, mode);
    case 7:
      return less_than(memory, index, mode);
    case 8:
      return equal(memory, index, mode);
  }
};


const end = () => null;

const value = (mode, memory, index) => mode === 1
  ? memory[index]
  : memory[ memory[index] ];

const add = (memory, index, mode) => {
  const values = [
    value(mode[0], memory, ++index),
    value(mode[1], memory, ++index)
  ];
  const output = memory[++index];
  memory[output] = values[0] + values[1];
  return command(memory, ++index);
};

const multiply = (memory, index, mode) => {
  const values = [
    value(mode[0], memory, ++index),
    value(mode[1], memory, ++index)
  ];
  const output = memory[++index];
  memory[output] = values[0] * values[1];
  return command(memory, ++index);
};

const input = (memory, index) => input => {
  const output = memory[++index];
  memory[output] = input;
  return command(memory, ++index);
}; 

const output = (memory, index, mode) => [
  value(mode[0], memory, ++index),
  command(memory, ++index)
];

const jump_if_true = (memory, index, mode) => {
  const cond = value(mode[0], memory, ++index);
  const pointer = value(mode[1], memory, ++index);
  return command(memory, cond !== 0 ? pointer : ++index);
};

const jump_if_false = (memory, index, mode) => {
  const cond = value(mode[0], memory, ++index);
  const pointer = value(mode[1], memory, ++index);
  return command(memory, cond === 0 ? pointer : ++index);
};

const less_than = (memory, index, mode) => {
  const params = [
    value(mode[0], memory, ++index),
    value(mode[1], memory, ++index)
  ];
  const output = memory[++index];
  memory[output] = params[0] < params[1] ? 1 : 0;
  return command(memory, ++index);
}

const equal = (memory, index, mode) => {
  const params = [
    value(mode[0], memory, ++index),
    value(mode[1], memory, ++index)
  ];
  const output = memory[++index];
  memory[output] = params[0] === params[1] ? 1 : 0;
  return command(memory, ++index);
}
