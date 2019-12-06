const parse = d => d.trim().split('-').map(e => +e);

exports.first = d => {
  const [ begin, end ] = parse(d);
  console.log( countOne(begin, end) );
}


exports.second = d => {
  const [ begin, end ] = parse(d);
  console.log( countTwo(begin, end) );
}


// Part One
const countOne = (begin, end) => {
  let result = 0;
  for (let password = begin; password <= end; password++) {
    const p = password.toString();
    if (twoSameDigits(p) && neverDecrease(p)) {
      result++;
    }
  }
  return result;
};


//Part Two
const countTwo = (begin, end) => {
  let result = 0;
  for (let password = begin; password <= end; password++) {
    const p = password.toString();
    if (onlyTwoSameDigits(p) && neverDecrease(p)) {
      result++;
    }
  }
  return result;
};

// Helpers
const twoSameDigits = password => {
  for (let i = 1; i < password.length; i++) {
    if (password[i] === password[i - 1]) {
      return true;
    }
  }
  return false;
}

const neverDecrease = password => {
  for (let i = 1; i < password.length; i++) {
    if (password[i] < password[i - 1]) {
      return false;
    }
  }
  return true;
}


const onlyTwoSameDigits = password => groups(password).reduce(hasTwo, false);
const hasTwo = (acc, val) => acc || val.length === 2;
const groups = password => {
  let groups = [ [password[0]] ];
  for (let i = 1; i < password.length; i++) {
    if (password[i] === password[i - 1]) {
      groups[groups.length - 1].push(password[i])
    } else {
      groups.push([password[i]]);
    }
  }
  return groups;
};