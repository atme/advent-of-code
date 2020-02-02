// pattern :: number -> number -> number
const pattern = (element, position) => {
  const base = [0, 1, 0, -1];
  const index = Math.floor((position + 1) / (element + 1));
  return base[index % base.length];
};

// sum :: number -> number -> number
const sum = (a, b) => a + b;
// lastDigit :: number -> number
const lastDigit = (number) => Math.abs(number % 10);

// memoize :: Function -> a -> Function a
const memoize = (f) => {
  const cache = {};
  return (...values) => {
    const key = values.toString();
    if (cache[key] === undefined) {
      cache[key] = f(...values);
    }
    return cache[key];
  };
};

// memoizedPattern :: number -> number -> number
const memoizedPattern = memoize(pattern);

// cals :: Array number -> Array number
const calc = (_, element, signal) => signal.map(
  (number, position) => number * memoizedPattern(element, position),
).reduce(sum);

// phase :: Array number -> Array number
const phase = (signal) => signal.map(calc).map(lastDigit);
exports.phase = phase;

// phase :: Array number -> Array number
const halfPhase = (signal) => {
  const array = [...signal];
  for (let i = array.length - 2; i >= 0; i -= 1) {
    array[i] = lastDigit(array[i] + array[i + 1]);
  }
  return array;
};
exports.halfPhase = halfPhase;

// repeat :: number -> Function -> Array number -> number
const repeat = (count) => (p) => (signal) => {
  let answer = signal;
  for (let i = 0; i < count; i += 1) {
    answer = p(answer);
  }
  return answer;
};

// repeatHundredTimes :: Function -> Array number -> number
const repeatHundredTimes = repeat(100);

// repeatPhaseHundredTimes :: Array number -> number
const repeatPhaseHundredTimes = repeatHundredTimes(phase);
exports.repeatPhaseHundredTimes = repeatPhaseHundredTimes;

// repeatHalfPhaseHundredTimes :: Array number -> number
const repeatHalfPhaseHundredTimes = repeatHundredTimes(halfPhase);
exports.repeatHalfPhaseHundredTimes = repeatHalfPhaseHundredTimes;

// repeatArray :: number -> Array number -> Array number
const repeatArray = (count, input) => {
  const output = [];
  for (let i = 0; i < count; i += 1) {
    output.push(...input);
  }
  return output;
};
exports.repeatArray = repeatArray;

// parse :: String -> Array number
const parse = (d) => Array.from(d.trim()).map(Number);

exports.first = (d) => {
  const input = parse(d);
  console.log(repeatPhaseHundredTimes(input).slice(0, 8).join(''));
};

exports.second = (d) => {
  const input = parse(d);
  const offset = +input.slice(0, 7).join('');
  const signal = repeatArray(10000, input).slice(offset);
  console.log(repeatHalfPhaseHundredTimes(signal).slice(0, 8).join(''));
};
