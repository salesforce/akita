const fs = require('fs-extra');
const chalk = require('chalk');
const childProcess = require('child_process');

const [_, __, lib] = process.argv;
const basePath = `projects`;

const paths = {
  '@datorama/akita': ['../../../../akita/public_api.ts']
};

const tsconfigPath = `${basePath}/${lib}/tsconfig.lib.json`;
const tsconfig = fs.readJsonSync(tsconfigPath);
tsconfig.compilerOptions.paths = {};
tsconfig.compilerOptions.baseUrl = '.';
console.log(chalk.blueBright(`---------------- Removing paths from ${lib} ---------------- `));
fs.writeJsonSync(tsconfigPath, tsconfig, { spaces: 2 });

console.log(chalk.blueBright(`---------------- Running Akita Build ---------------- `));
childProcess.execSync(`npm run build:akita`, { stdio: 'inherit' });

console.log(chalk.blueBright(`---------------- Coping Akita to node_modules ---------------- `));
fs.copySync('../../dist', './node_modules/@datorama/akita');

console.log(chalk.blueBright(`---------------- Building ${lib} ---------------- `));
childProcess.execSync(`ng build ${lib}`, { stdio: 'inherit' });

console.log(chalk.blueBright(`---------------- Adding paths to ${lib} ---------------- `));
tsconfig.compilerOptions.paths = paths;
fs.writeJsonSync(tsconfigPath, tsconfig, { spaces: 2 });

console.log(chalk.blueBright(`---------------- Removing Akita from node_modules ---------------- `));
fs.removeSync('./node_modules/@datorama');
