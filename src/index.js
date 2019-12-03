const fs = require('fs');
const https = require('https');

const cookie = 'session=' + fs.readFileSync(__dirname + '/../cookie');

const day = parseInt(process.argv[2]);
if (isNaN(day) || day < 1 || day > 25) {
  console.error('You have to choose a day between 1 and 25');
  console.error('For example: node src/index.js 1');
  process.exit(1);
}
const type = process.argv[2].slice(-1) === '+' ? 'second' : 'first';
const callback = require('./day0' + day + '.js')[type];

https.get('https://adventofcode.com/2019/day/'+day+'/input', {
  headers: { cookie }
}, res => {
  res.on('data', callback);
});
