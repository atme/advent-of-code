// ----[ Intcode computer ]-----------------------------------------------------
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
// ----[ Intcode computer ]-----------------------------------------------------


// Day 15
const createDroid = (opcode) => {
  const program = intcode(opcode);
  return {
    move: (direction) => {
      program.next().value(direction);
      return program.next().value;
    },
  };
};

const Tuple = {
  pair: (a, b) => `${a},${b}`,
  first: (tuple) => +tuple.split(',').slice(0, 1),
  second: (tuple) => +tuple.split(',').slice(1),
  mapFirst: (f, tuple) => Tuple.pair(
    f(Tuple.first(tuple)), Tuple.second(tuple),
  ),
  mapSecond: (f, tuple) => Tuple.pair(
    Tuple.first(tuple), f(Tuple.second(tuple)),
  ),
  mapBoth: (f1, f2, tuple) => Tuple.pair(
    f1(Tuple.first(tuple)), f2(Tuple.second(tuple)),
  ),
};

const Graph = {
  create: (point) => {
    const graph = {};
    graph[point] = [];
    return graph;
  },
  add: (graph, point1, point2) => {
    if (graph[point1] !== undefined) {
      return graph[point1].concat([point2]);
    }
    return [point2];
  },
};

const addOne = (x) => x + 1;
const subOne = (x) => x - 1;

const Grid = {
  create: (point) => ({
    graph: Graph.create(point),
    unvisited: Grid.neighbors(point),
    walls: [],
  }),
  neighbors: (point) => [
    Tuple.mapFirst(addOne, point),
    Tuple.mapFirst(subOne, point),
    Tuple.mapSecond(addOne, point),
    Tuple.mapSecond(subOne, point),
  ],
  unvisited: ({ graph, walls, unvisited }, point) => {
    const list = Object.keys(graph).concat(walls).concat(unvisited);
    return Grid.neighbors(point).filter((tuple) => list.indexOf(tuple) === -1);
  },
};

// ----[ Search Algorithm ]-----------------------------------------------------
const breadthFirstSearch = (graph, start, goal) => {
  const frontier = [start];
  const cameFrom = {};
  cameFrom[start] = null;
  while (frontier.length > 0) {
    const current = frontier.pop();
    if (current === goal) {
      break;
    }
    graph[current]
      .filter((neighbor) => cameFrom[neighbor] === undefined)
      .forEach((neighbor) => {
        frontier.push(neighbor);
        cameFrom[neighbor] = current;
      });
  }
  return cameFrom;
};

const searchPath = ({ graph }, start, goal) => {
  const path = breadthFirstSearch(graph, start, goal);
  const result = [goal];
  let current = Grid.neighbors(goal).find(
    (point) => Object.keys(path).indexOf(point) !== -1,
  );
  do {
    result.push(current);
    current = path[current];
  } while (current !== null);
  return result.reverse().slice(1);
};
// ----[ Search Algorithm ]-----------------------------------------------------


const getDirection = (point1, point2) => {
  if (Tuple.first(point2) > Tuple.first(point1)) {
    return 1;
  }
  if (Tuple.first(point2) < Tuple.first(point1)) {
    return 2;
  }
  if (Tuple.second(point2) < Tuple.second(point1)) {
    return 3;
  }
  return 4;
};

const getCoordinate = (direction, point) => {
  switch (direction) {
    case 1:
      return Tuple.mapFirst(addOne, point);
    case 2:
      return Tuple.mapFirst(subOne, point);
    case 3:
      return Tuple.mapSecond(subOne, point);
    default:
      return Tuple.mapSecond(addOne, point);
  }
};

const reverseDirection = ({
  1: 2,
  2: 1,
  3: 4,
  4: 3,
});

const drawMap = (opcode) => {
  const droid = createDroid(opcode);
  let point = Tuple.pair(0, 0);
  let oxygen = point;
  const map = Grid.create(point);
  const history = {};

  const changePointByDirection = (direction) => {
    point = getCoordinate(direction, point);
  };

  while (map.unvisited.length > 0) {
    const unvisited = map.unvisited.pop();

    if (history[unvisited] !== undefined) {
      const path = history[unvisited].reverse();
      path.forEach(changePointByDirection);
      path.forEach(droid.move);
      delete history[unvisited];
    }

    const direction = getDirection(point, unvisited);
    const status = droid.move(direction);

    const nextUnvisited = map.unvisited[map.unvisited.length - 1];
    switch (status) {
      case 0:
        map.walls.push(unvisited);
        break;
      case 2:
        oxygen = unvisited;
        // falls through
      case 1:
      default:
        (history[nextUnvisited] = history[nextUnvisited] || []).push(
          reverseDirection[direction],
        );
        Grid.neighbors(unvisited)
          .filter((neighbor) => map.graph[neighbor] !== undefined)
          .forEach((neighbor) => {
            map.graph[neighbor] = Graph.add(map.graph, neighbor, unvisited);
            map.graph[unvisited] = Graph.add(map.graph, unvisited, neighbor);
          });
        Grid.unvisited(map, unvisited).forEach(
          (tuple) => map.unvisited.push(tuple),
        );
        point = unvisited;
    }
  }
  return [oxygen, map];
};

const longestPath = (path) => Object.keys(path).map((step) => {
  const result = [];
  let current = step;
  while (current !== null) {
    result.push(current);
    current = path[current];
  }
  return result;
}).reduce((acc, val) => (acc.length > val.length ? acc : val));


const parse = (d) => d.split(',').map(Number);

exports.first = (d) => {
  const opcode = parse(d);
  const [oxygen, map] = drawMap(opcode);
  const path = searchPath(map, Tuple.pair(0, 0), oxygen);
  console.log(path.length);
};

exports.second = (d) => {
  const opcode = parse(d);
  const [oxygen, map] = drawMap(opcode);
  const oxygenPath = breadthFirstSearch(map.graph, oxygen);
  console.log(longestPath(oxygenPath).length - 1);
};
