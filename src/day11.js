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

// Day 11

function* robot(opcode) {
  const bot = intcode(opcode);
  let shutdown = false;

  while (!shutdown) {
    const com = bot.next();
    if (!com.done) {
      yield (_input) => {
        com.value(_input);
        return [bot.next().value, bot.next().value];
      };
    }
    shutdown = com.done;
  }
}

const rotate = (direction, right) => {
  const sign = (right && direction.y === 0) || (!right && direction.x === 0)
    ? -1
    : 1;
  const y = direction.x * sign;
  const x = direction.y * sign;
  return { x, y };
};

const black = '[40m [49m';
const white = '[47m [49m';
const draw = (image) => image.map(
  (line) => line.map(
    (pixel) => (pixel === 0 ? black : white),
  ).join(''),
).join('\n');

const range = (r) => Array.from(Array(r));

const image = (canvas) => {
  let minY = 0;
  let minX = 0;
  let maxY = 0;
  let maxX = 0;
  Array.from(canvas.keys()).forEach((key) => {
    const [x, y] = key.split(',').map(Number);
    if (x < minX) {
      minX = x;
    }
    if (x > maxX) {
      maxX = x;
    }
    if (y < minY) {
      minY = y;
    }
    if (y > maxY) {
      maxY = y;
    }
  });
  maxY -= minY - 1; // including zero index
  maxX -= minX - 1; // including zero index
  return range(maxY).map(
    (line, y) => range(maxX).map(
      (pixel, x) => (
        canvas.has(`${x + minX},${y + minY}`)
          ? canvas.get(`${x + minX},${y + minY}`)
          : 0
      ),
    ),
  ).reverse();
};

const parse = (d) => d.split(',').map(Number);

exports.first = (d) => {
  const opcode = parse(d);

  const canvas = new Map();
  let x = 0;
  let y = 0;
  let dir = { x: 0, y: 1 };

  for (const step of robot(opcode)) {
    const oldColor = canvas.has(`${x},${y}`) ? canvas.get(`${x},${y}`) : 0;
    const [color, right] = step(oldColor);
    canvas.set(`${x},${y}`, color);
    dir = rotate(dir, right);
    x += dir.x;
    y += dir.y;
  }
  console.log(Array.from(canvas.keys()).length);
};

exports.second = (d) => {
  const opcode = parse(d);

  const canvas = new Map();
  let x = 0;
  let y = 0;
  let dir = { x: 0, y: 1 };
  canvas.set(`${x},${y}`, 1);

  for (const step of robot(opcode)) {
    const oldColor = canvas.has(`${x},${y}`) ? canvas.get(`${x},${y}`) : 0;
    const [color, right] = step(oldColor);
    canvas.set(`${x},${y}`, color);
    dir = rotate(dir, right);
    x += dir.x;
    y += dir.y;
  }

  console.log(draw(image(canvas)));
};
