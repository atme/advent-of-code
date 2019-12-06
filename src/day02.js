const parse = d => d.split(",").map(Number);

exports.first = d => {
  const opcode = parse(d);

  opcode[1] = 12;
  opcode[2] = 2;

  console.log( run(opcode) );
};

exports.second = d => {
  const result = 19690720;
  const opcode = parse(d);

  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      let memory = [...opcode];
      memory[1] = noun;
      memory[2] = verb;

      const output = run(memory);
      if (output === result) {
        console.log(100 * noun + verb);
        return;
      }
    }
  }
};

const run = (array, index = 0) => {
  if (array[index] === 99) {
    return array[0];
  }

  const input = [ array[index + 1], array[index + 2] ];
  const output = array[index + 3];

  switch (array[index]) {
    case 1:
      array[output] = array[ input[0] ] + array[ input[1] ];
      break;
    case 2:
      array[output] = array[ input[0] ] * array[ input[1] ];
      break;
  }

  return run(array, index + 4);
};