// -- Intcode computer

const end = (mode, memory, index, base) => [memory, null, base];

const getIndex = (mode, memory, index, base) => {
  switch (mode) {
    case 1:
      return index;
    case 2:
      return base + memory[index];
    case 0:
    default:
      return memory[index];
  }
};

const getValue = (mode, memory, index, base) => {
  const v = getIndex(mode, memory, index, base);
  return typeof memory[v] === 'undefined' ? 0 : memory[v];
};


const add = (mode, memory, index, base) => {
  const values = [
    getValue(mode[0], memory, index + 1, base),
    getValue(mode[1], memory, index + 2, base),
  ];
  const outputIndex = getIndex(mode[2], memory, index + 3, base);
  const mem = [...memory];
  mem[outputIndex] = values[0] + values[1];
  return [mem, index + 4, base];
};

const multiply = (mode, memory, index, base) => {
  const values = [
    getValue(mode[0], memory, index + 1, base),
    getValue(mode[1], memory, index + 2, base),
  ];
  const outputIndex = getIndex(mode[2], memory, index + 3, base);
  const mem = [...memory];
  mem[outputIndex] = values[0] * values[1];
  return [mem, index + 4, base];
};

const jumpIfTrue = (mode, memory, index, base) => {
  const cond = getValue(mode[0], memory, index + 1, base);
  const pointer = getValue(mode[1], memory, index + 2, base);
  const newIndex = cond !== 0 ? pointer : index + 3;
  return [memory, newIndex, base];
};

const jumpIfFalse = (mode, memory, index, base) => {
  const cond = getValue(mode[0], memory, index + 1, base);
  const pointer = getValue(mode[1], memory, index + 2, base);
  const newIndex = cond === 0 ? pointer : index + 3;
  return [memory, newIndex, base];
};

const lessThan = (mode, memory, index, base) => {
  const values = [
    getValue(mode[0], memory, index + 1, base),
    getValue(mode[1], memory, index + 2, base),
  ];
  const outputIndex = getIndex(mode[2], memory, index + 3, base);
  const mem = [...memory];
  mem[outputIndex] = values[0] < values[1] ? 1 : 0;
  return [mem, index + 4, base];
};

const equal = (mode, memory, index, base) => {
  const values = [
    getValue(mode[0], memory, index + 1, base),
    getValue(mode[1], memory, index + 2, base),
  ];
  const outputIndex = getIndex(mode[2], memory, index + 3, base);
  const mem = [...memory];
  mem[outputIndex] = values[0] === values[1] ? 1 : 0;
  return [mem, index + 4, base];
};

const input = (mode, memory, index, base) => (_input) => {
  const outputIndex = getIndex(mode[0], memory, index + 1, base);
  const mem = [...memory];
  mem[outputIndex] = _input;
  return [mem, index + 2, base];
};

const output = (mode, memory, index, base) => {
  const data = getValue(mode[0], memory, index + 1, base);
  return [memory, index + 2, base, data];
};

const adjustRelativeBase = (mode, memory, index, base) => {
  const offset = getValue(mode[0], memory, index + 1, base);
  return [memory, index + 2, base + offset];
};


/**
 * Execute instruction
 * @param {Array.<number>} memory
 * @param {number} index Index of command
 * @param {number} base Relative base offset
 * @returns {[Array.<number>, number, number]} [memory, index, base]
 * - Program is finished and should immediately halt if second argument of
 * result is null
 */
const command = (memory, index, base) => {
  const code = memory[index].toString().padStart(5, 0);
  const instruction = parseInt(code.slice(-2), 10);
  const mode = code.slice(0, -2).split('').reverse().map(Number);

  switch (instruction) {
    case 1:
      return add(mode, memory, index, base);
    case 2:
      return multiply(mode, memory, index, base);
    case 3:
      return input(mode, memory, index, base);
    case 4:
      return output(mode, memory, index, base);
    case 5:
      return jumpIfTrue(mode, memory, index, base);
    case 6:
      return jumpIfFalse(mode, memory, index, base);
    case 7:
      return lessThan(mode, memory, index, base);
    case 8:
      return equal(mode, memory, index, base);
    case 9:
      return adjustRelativeBase(mode, memory, index, base);
    case 99:
    default:
      return end(mode, memory, index, base);
  }
};


function* intcode(opcode) {
  let index = 0;
  let base = 0;
  let program = [...opcode];

  do {
    let result = command(program, index, base);

    if (typeof result === 'function') {
      yield (_input) => {
        result = result(_input);
      };
    }

    [program, index, base] = result;
    if (result.length === 4) {
      yield result[3];
    }
  } while (index !== null);
}
exports.intcode = intcode;

// Day 13

function* game(opcode) {
  const program = intcode(opcode);
  let image = [];

  const tile = (x, y, _tile) => {
    if (image[y] === undefined) {
      image[y] = [];
    }
    image[y][x] = _tile;
  };

  let play = program.next();
  while (!play.done) {
    if (typeof play.value === 'function') {
      yield [image, play.value];
      image = [];
    } else {
      tile(play.value, program.next().value, program.next().value);
    }
    play = program.next();
  }
  return image;
}

const findX = (image, id) => {
  let result;
  image.forEach((line) => {
    const x = line.indexOf(id);
    if (x > -1) {
      result = x;
    }
  });
  return result;
};

const parse = (d) => d.split(',').map(Number);

exports.first = (d) => {
  const image = game(parse(d)).next().value;
  const twos = image.flat().reduce(
    (acc, value) => acc + (value === 2 ? 1 : 0),
    0,
  );
  console.log(twos);
};

exports.second = (d) => {
  const opcode = parse(d);
  opcode[0] = 2;
  const image = [];

  const diff = (_image) => _image.forEach((line, y) => {
    line.forEach((tile, x) => {
      if (image[y] === undefined) {
        image[y] = [];
      }
      image[y][x] = tile;
    });
  });

  const iter = game(opcode);
  let play = iter.next();
  while (!play.done) {
    const [_image, _input] = play.value;
    diff(_image);

    const paddle = findX(image, 3);
    const ball = findX(image, 4);
    if (paddle > ball) {
      _input(-1);
    } else if (paddle < ball) {
      _input(1);
    } else {
      _input(0);
    }
    play = iter.next();
  }
  console.log(play.value[0][-1]);
};
