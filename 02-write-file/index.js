const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const fileName = '02-write-file.txt';

const file = path.join(__dirname, fileName);
const writeStream = fs.createWriteStream(file);
writeStream.on('error', (err) => {
  console.error(
    `The following error occurred while writing to ${fileName}:`,
    err,
  );
});

stdout.write('Hello!:) Enter something:\n');

stdin.on('data', (chunk) => {
  if (chunk.toString().trim() === 'exit') {
    process.exit();
  } else {
    writeStream.write(chunk);
  }
});

process.on('exit', () =>
  stdout.write(
    `The writing process to the file ${fileName} was completed successfully.`,
  ),
);
process.on('SIGINT', () => process.exit());
