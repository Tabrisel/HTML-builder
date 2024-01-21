const path = require('path');
const fs = require('fs/promises');

const targetPath = path.join(__dirname, 'secret-folder');

fs.readdir(targetPath, { withFileTypes: true })
  .then((data) => {
    data.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.join(targetPath, file.name);

        fs.stat(filePath)
          .then((stats) => {
            let nameFile = path.basename(file.name, path.extname(file.name));
            let extensionFile = path.extname(file.name).slice(1);
            let sizeFile = (stats.size / 1000).toFixed(3);
            console.log(`${nameFile} - ${extensionFile} - ${sizeFile}kb`);
          })
          .catch((error) => {
            console.error(
              `Error with getting information about ${file.name}:`,
              error,
            );
          });
      }
    });
  })
  .catch((error) =>
    console.error(`Error with reading folder: ${targetPath}`, error),
  );
