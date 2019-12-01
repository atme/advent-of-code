const fs = require("fs");
const https = require('https');

const cookie = 'session=' + fs.readFileSync(__dirname + '/../cookie');

https.get('https://adventofcode.com/2019/day/1/input', {
  headers: { cookie }
}, res => {
  res.on('data', d => {
    const sum = d
      .toString()
      .trim()
      .split("\n")
      .map(e => Math.floor(e / 3) - 2)
      .reduce((a, b) => a + b);
    process.stdout.write(sum.toString() + "\n");
  });
});
