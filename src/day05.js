const counter = (index) => {
  let num = index;
  return () => {
    num += 1;
    return num;
  };
};

const value = (mode, memory, index) => (
  mode === 1 ? memory[index] : memory[memory[index]]
);

const add = (memory, index, mode) => {
  const next = counter(index);
  const values = [
    value(mode[0], memory, next()),
    value(mode[1], memory, next()),
  ];
  const output = memory[next()];
  const m = [...memory];
  m[output] = values[0] + values[1];
  return [m, next()];
};

const multiply = (memory, index, mode) => {
  const next = counter(index);
  const values = [
    value(mode[0], memory, next()),
    value(mode[1], memory, next()),
  ];
  const output = memory[next()];
  const m = [...memory];
  m[output] = values[0] * values[1];
  return [m, next()];
};

const jumpIfTrue = (memory, index, mode) => {
  const next = counter(index);
  const cond = value(mode[0], memory, next());
  const pointer = value(mode[1], memory, next());
  return [
    memory,
    cond !== 0 ? pointer : next(),
  ];
};

const jumpIfFalse = (memory, index, mode) => {
  const next = counter(index);
  const cond = value(mode[0], memory, next());
  const pointer = value(mode[1], memory, next());
  return [
    memory,
    cond === 0 ? pointer : next(),
  ];
};

const lessThan = (memory, index, mode) => {
  const next = counter(index);
  const params = [
    value(mode[0], memory, next()),
    value(mode[1], memory, next()),
  ];
  const output = memory[next()];
  const m = [...memory];
  m[output] = params[0] < params[1] ? 1 : 0;
  return [m, next()];
};

const equal = (memory, index, mode) => {
  const next = counter(index);
  const params = [
    value(mode[0], memory, next()),
    value(mode[1], memory, next()),
  ];
  const output = memory[next()];
  const m = [...memory];
  m[output] = params[0] === params[1] ? 1 : 0;
  return [m, next()];
};

const input = (memory, index, storage) => {
  const next = counter(index);
  const output = memory[next()];
  const m = [...memory];
  m[output] = storage;
  return [m, next(), storage];
};

const output = (memory, index, mode) => {
  const next = counter(index);
  const storage = value(mode[0], memory, next());
  return [memory, next(), storage];
};


/**
 * Execute instruction
 * @param {Array.<number>} memory
 * @param {number} storage Input value
 * @param {number} index Index of command
 * @returns { [number, number] | [null, number] } Tuple [ index, storage ]
 * - Program is finished and should immediately halt if first tuple element
 * is null
 */
const command = (memory, index, storage) => {
  const code = memory[index].toString().padStart(5, 0);
  const instruction = parseInt(code.slice(-2), 10);
  const mode = code.slice(0, -2).split('').reverse().map(Number);

  switch (instruction) {
    case 1:
      return [...add(memory, index, mode), storage];
    case 2:
      return [...multiply(memory, index, mode), storage];
    case 3:
      return input(memory, index, storage);
    case 4:
      return output(memory, index, mode);
    case 5:
      return [...jumpIfTrue(memory, index, mode), storage];
    case 6:
      return [...jumpIfFalse(memory, index, mode), storage];
    case 7:
      return [...lessThan(memory, index, mode), storage];
    case 8:
      return [...equal(memory, index, mode), storage];
    case 99:
    default:
      return [memory, null, storage];
  }
};


/**
 * Execute opcode
 * @param {Array.<number>} opcode
 * @param {number} storage - Input value
 * @param {number} index [index=0] - Index of command
 * @returns { {output: number, memory: Array.<number>} }
 */
const run = (opcode, storage, index = 0) => {
  const [_opcode, _index, _storage] = command(opcode, index, storage);
  return _index !== null
    ? run(_opcode, _storage, _index)
    : { output: _storage, memory: _opcode };
};
exports.run = run;


const parse = (d) => d.split(',').map(Number);

exports.first = (d) => {
  const opcode = parse(d);
  const id = 1;

  console.log(run(opcode, id).output);
};

exports.second = (d) => {
  const opcode = parse(d);
  const id = 5;

  console.log(run(opcode, id).output);
};
