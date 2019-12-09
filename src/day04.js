const twoSameDigits = (password) => {
  for (let i = 1; i < password.length; i += 1) {
    if (password[i] === password[i - 1]) {
      return true;
    }
  }
  return false;
};

const neverDecrease = (password) => {
  for (let i = 1; i < password.length; i += 1) {
    if (password[i] < password[i - 1]) {
      return false;
    }
  }
  return true;
};


const groups = (password) => {
  const result = [
    [password[0]],
  ];
  for (let i = 1; i < password.length; i += 1) {
    if (password[i] === password[i - 1]) {
      result[result.length - 1].push(password[i]);
    } else {
      result.push([password[i]]);
    }
  }
  return result;
};

const hasTwo = (acc, val) => acc || val.length === 2;
const onlyTwoSameDigits = (password) => groups(password).reduce(hasTwo, false);


// Part One
const countOne = (begin, end) => {
  let result = 0;
  for (let password = begin; password <= end; password += 1) {
    const p = password.toString();
    if (twoSameDigits(p) && neverDecrease(p)) {
      result += 1;
    }
  }
  return result;
};


// Part Two
const countTwo = (begin, end) => {
  let result = 0;
  for (let password = begin; password <= end; password += 1) {
    const p = password.toString();
    if (onlyTwoSameDigits(p) && neverDecrease(p)) {
      result += 1;
    }
  }
  return result;
};


const parse = (d) => d.trim().split('-').map(Number);

exports.first = (d) => {
  const [begin, end] = parse(d);
  console.log(countOne(begin, end));
};


exports.second = (d) => {
  const [begin, end] = parse(d);
  console.log(countTwo(begin, end));
};
