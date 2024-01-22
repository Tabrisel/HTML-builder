const path = require('path');
const fs = require('fs/promises');

async function build() {
  const targetFolder = path.join(__dirname, 'project-dist');
  const indexPath = path.join(targetFolder, 'index.html');
  const templatePath = path.join(__dirname, 'template.html');
  const componentsPath = path.join(__dirname, 'components');

  try {
    await fs.rm(targetFolder, { recursive: true, force: true });
    await fs.mkdir(targetFolder, { recursive: true });

    let template;

    try {
      template = await fs.readFile(indexPath, 'utf8');
    } catch (err) {
      template = await fs.readFile(templatePath, 'utf8');
    }

    const tagsArray = await getTagsArray(componentsPath);

    for (const { tag, file } of tagsArray) {
      const content = await fs.readFile(path.join(componentsPath, file), 'utf8');
      template = template.replace(tag, content);
    }

    await fs.writeFile(indexPath, template, 'utf8');
    console.log('index.html was successfully created or updated.');

    // Create style.css file
    const stylesPath = path.join(__dirname, 'styles');
    const resultPath = path.join(__dirname, 'project-dist', 'style.css');
    const dataResult = [];

    try {
      const data = await fs.readdir(stylesPath, { withFileTypes: true });

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

      await fs.writeFile(resultPath, dataResult.join('\n'), 'utf-8');
      console.log('Successfully merging styles to file: style.css');
    } catch (error) {
      console.log(`Error merging styles: ${error}`);
    }

    // Copy assets folder
    const folderCurrent = 'assets';
    const folderDest = 'project-dist';

    const currentPath = path.join(__dirname, folderCurrent);
    const targetPath = path.join(__dirname, folderDest, folderCurrent);

    await fs.mkdir(targetPath, { recursive: true });
    console.log(`Folder "${folderDest}" created successfully.`);

    await copyRecursive(currentPath, targetPath);

    console.log(
      `The directory ${currentPath} was successfully copied to ${targetPath}.`
    );

    console.log('Build process completed successfully.');
  } catch (error) {
    console.error(`Error building page: ${error.message}`);
  }
}

async function getTagsArray(componentsPath) {
  try {
    const files = await fs.readdir(componentsPath, { withFileTypes: true });

    const tagsArray = files
      .filter(file => file.isFile() && path.extname(file.name) === '.html')
      .map(file => ({
        tag: `{{${path.basename(file.name, '.html')}}}`,
        file: file.name
      }));

    return tagsArray;
  } catch (err) {
    console.error('Error reading components:', err);
    return [];
  }
}

async function copyRecursive(src, dest) {
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await fs.mkdir(destPath, { recursive: true });
      await copyRecursive(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

build();
