const fs = require('fs');
const path = require('path');

let file = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(file, 'utf-8');
let data = '';
readStream.on('data', (chunk) => (data = data + chunk));
readStream.on('error', (error) => {
  console.log('Error', error.message);
});
readStream.on('end', () => console.log(data));
