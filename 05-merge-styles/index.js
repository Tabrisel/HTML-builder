const path = require('path');
const fs = require('fs/promises');
let dataResult = [];

const stylesPath = path.join(__dirname, 'styles');
const resultPath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(stylesPath, { withFileTypes: true })
  .then(async (data) => {
    for (const file of data) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(stylesPath, file.name);
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          dataResult.push(content);
        } catch (error) {
          console.log(`Error with reading file ${file.name}: ${error}`);
        }
      }
    }
  })
  .then(() => {
    return fs.writeFile(resultPath, dataResult.join('\n'), 'utf-8');
  })
  .then(() => {
    console.log('Successfully mergin styles to file: bundle.css');
  })
  .catch((error) => {
    console.log(`Error merging styles: ${error}`);
  });
