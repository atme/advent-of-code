const parse = d => d.split(",").map(e => parseInt(e));

exports.first = d => {
  const opcode = parse(d);
  const id = 1;

  console.log ( run(opcode, id).output );
};

exports.second = d => {
  const opcode = parse(d);
  const id = 5;

  console.log ( run(opcode, id).output );
};

/**
 * Execute opcode
 * @param {Array.<number>} opcode 
 * @param {number} storage - Input value
 * @param {number} index [index=0] - Index of command
 * @returns { {output: number, memory: Array.<number>} }
 */
const run = (opcode, storage, index = 0) => {
  const memory = [...opcode]
  const [ _index, _storage ] = command(memory, storage, index);
  return _index !== null
    ? run (memory, _storage, _index)
    : { output: _storage, memory };
};
exports.run = run;

/**
 * Execute instruction
 * @param {Array.<number>} memory 
 * @param {number} storage Input value
 * @param {number} index Index of command
 * @returns { [number, number] | [null, number] } Tuple [ index, storage ]
 * - Program is finished and should immediately halt if first tuple element
 * is null
 */
const command = (memory, storage, index) => {
  const code = memory[index].toString().padStart(5, 0);
  const instruction = parseInt( code.slice(-2) );
  const mode = code.slice(0, -2).split('').reverse().map(m => +m);

  switch (instruction) {
    case 99:
      return end(storage);
    case 1:
      return add(memory, index, storage, mode);
    case 2:
      return multiply(memory, index, storage, mode);
    case 3:
      return input(memory, index, storage);
    case 4:
      return output(memory, index, mode);
    case 5:
      return jump_if_true(memory, index, storage, mode);
    case 6:
      return jump_if_false(memory, index, storage, mode);
    case 7:
      return less_than(memory, index, storage, mode);
    case 8:
      return equal(memory, index, storage, mode);
  }
};

const end = storage => [ null, storage ];

const value = (mode, memory, index) => mode === 1
  ? memory[index]
  : memory[ memory[index] ];

const add = (memory, index, storage, mode) => {
  const values = [
    value(mode[0], memory, ++index),
    value(mode[1], memory, ++index)
  ];
  const output = memory[++index];
  memory[output] = values[0] + values[1];
  return [ ++index, storage ];
};

const multiply = (memory, index, storage, mode) => {
  const values = [
    value(mode[0], memory, ++index),
    value(mode[1], memory, ++index)
  ];
  const output = memory[++index];
  memory[output] = values[0] * values[1];
  return [ ++index, storage ];
};

const input = (memory, index, storage) => {
  const output = memory[++index];
  memory[output] = storage;
  return [ ++index, storage ];
}; 

const output = (memory, index, mode) => {
  const storage = value(mode[0], memory, ++index);
  return [ ++index, storage ];
}; 

const jump_if_true = (memory, index, storage, mode) => {
  const cond = value(mode[0], memory, ++index);
  const pointer = value(mode[1], memory, ++index);
  return cond !== 0 ? [ pointer, storage ] : [ ++index, storage ];
};

const jump_if_false = (memory, index, storage, mode) => {
  const cond = value(mode[0], memory, ++index);
  const pointer = value(mode[1], memory, ++index);
  return cond === 0 ? [ pointer, storage ] : [ ++index, storage ];
};

const less_than = (memory, index, storage, mode) => {
  const params = [
    value(mode[0], memory, ++index),
    value(mode[1], memory, ++index)
  ];
  const output = memory[++index];
  memory[output] = params[0] < params[1] ? 1 : 0;
  return [ ++index, storage ];
}

const equal = (memory, index, storage, mode) => {
  const params = [
    value(mode[0], memory, ++index),
    value(mode[1], memory, ++index)
  ];
  const output = memory[++index];
  memory[output] = params[0] === params[1] ? 1 : 0;
  return [ ++index, storage ];
}
