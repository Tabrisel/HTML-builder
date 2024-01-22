const path = require('path');
const fs = require('fs/promises');

const folderCurrent = 'files';
const folderDest = 'files-copy';

async function copyDir() {
  const currentPath = path.join(__dirname, folderCurrent);
  const targetPath = path.join(__dirname, folderDest);

  try {
    await fs.mkdir(targetPath, { recursive: true });
    console.log(`Folder "${folderDest}" created successfully!`);

    const data = await fs.readdir(currentPath, { withFileTypes: true });
    const targetData = await fs.readdir(targetPath, { withFileTypes: true });

    for (const targetFile of targetData) {
      const targetFilePath = path.join(targetPath, targetFile.name);
      if (!data.map((file) => file.name).includes(targetFile.name)) {
        await fs.unlink(targetFilePath);
      }
    }

    for (const eachFile of data) {
      const srcPath = path.join(currentPath, eachFile.name);
      const destPath = path.join(targetPath, eachFile.name);
      await fs.copyFile(srcPath, destPath);
    }

    console.log(
      `The directory ${currentPath} was successfully copied to ${targetPath}!`,
    );
  } catch (err) {
    console.error(`Error with copying: ${err}`);
  }
}

copyDir();
