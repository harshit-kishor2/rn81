#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const getAllFilesRecursively = (dir, extensions) => {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllFilesRecursively(fullPath, extensions));
    } else if (
      entry.isFile() &&
      extensions.includes(path.extname(entry.name).toLowerCase().substring(1))
    ) {
      results.push(fullPath);
    }
  }

  return results;
};

const sanitizeKey = filePath =>
  path
    .basename(filePath, path.extname(filePath))
    .replace(/[^a-zA-Z0-9]/g, '_')
    .toUpperCase();

const ensureUniqueKeys = files => {
  const seen = new Map();
  files.forEach(f => {
    const key = sanitizeKey(f);
    if (seen.has(key)) {
      throw new Error(
        `Duplicate key "${key}" for:\n  ${seen.get(key)}\n  ${f}`,
      );
    }
    seen.set(key, f);
  });
};

const generateImageOrAnimationIndex = (files, folderPath, constName) => {
  ensureUniqueKeys(files);

  const entries = files
    .map(file => {
      const relativePath =
        './' + path.relative(folderPath, file).replace(/\\/g, '/');
      const key = sanitizeKey(file);
      return `  ${key}: require('${relativePath}'),`;
    })
    .join('\n');

  const content = `const ${constName} = Object.freeze({\n${entries}\n});\n\nexport default ${constName};\n`;

  fs.writeFileSync(path.join(folderPath, 'index.ts'), content, 'utf8');
  console.log(
    `✅ ${constName} written to ${path.join(folderPath, 'index.ts')}`,
  );
};

const generateSVGIndex = (files, folderPath) => {
  ensureUniqueKeys(files);

  const imports = [];
  const enums = [];
  const mapEntries = [];

  files.forEach(file => {
    const key = sanitizeKey(file);
    const varName = `${key}_ICON`;
    const relativePath =
      './' + path.relative(folderPath, file).replace(/\\/g, '/');

    imports.push(`import ${varName} from '${relativePath}';`);
    enums.push(`  ${key} = '${key}',`);
    mapEntries.push(`  [_SVG_ICONS.${key}]: ${varName},`);
  });

  const content = `import {SvgProps} from 'react-native-svg';\n${imports.join(
    '\n',
  )}\n\nexport enum _SVG_ICONS {\n${enums.join(
    '\n',
  )}\n}\n\nexport const _SVG_ICONS_MAP: Record<_SVG_ICONS, React.FC<SvgProps>> = {\n${mapEntries.join(
    '\n',
  )}\n};\n`;

  fs.writeFileSync(path.join(folderPath, 'index.ts'), content, 'utf8');
  console.log(
    `✅ _SVG_ICONS index written to ${path.join(folderPath, 'index.ts')}`,
  );
};

const runGenerator = async () => {
  const { assetType } = await inquirer.createPromptModule()([
    {
      type: 'list',
      name: 'assetType',
      message: 'Select the asset type you want to generate:',
      choices: ['Image', 'Animation', 'SVG', 'All'],
    },
  ]);

  const assetFolder = {
    Image: path.join(__dirname, '../assets/images'),
    Animation: path.join(__dirname, '../assets/animations'),
    SVG: path.join(__dirname, '../assets/svgs'),
  };

  const extensions = {
    Image: ['png', 'jpeg', 'jpg', 'webp'],
    Animation: ['json', 'gif'],
    SVG: ['svg'],
  };

  const generateFor = type => {
    const folderPath = assetFolder[type];
    const files = getAllFilesRecursively(folderPath, extensions[type]);

    if (type === 'SVG') {
      generateSVGIndex(files, folderPath);
    } else if (type === 'Image') {
      generateImageOrAnimationIndex(files, folderPath, '_IMAGES_CONST');
    } else if (type === 'Animation') {
      generateImageOrAnimationIndex(files, folderPath, '_ANIMATIONS_CONST');
    }
  };

  if (assetType === 'All') {
    Object.keys(assetFolder).forEach(generateFor);
  } else {
    generateFor(assetType);
  }
};

runGenerator();
