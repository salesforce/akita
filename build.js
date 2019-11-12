const fs = require('fs-extra');
const chalk = require('chalk');
const process = require('child_process');
const projects = ['ng-entity-service', 'ng-forms-manager', 'ng-router-store', 'ng-devtools'];
const basePath = `angular/playground/projects`;
const packgerFile = `ng-package.json`;

const content = lib => ({
  dest: `../../dist/${lib}`,
  lib: {
    entryFile: 'src/public-api.ts'
  }
});

projects.forEach(project => {
  console.log(chalk.blueBright(`---------------- Remove ng-package of ${project} ----------------`));
  fs.removeSync(`${basePath}/${project}/${packgerFile}`);
});

process.execSync(`npm run build:lib`, { stdio: 'inherit' });

projects.forEach(project => {
  console.log(chalk.blueBright(`---------------- Adding ng-package of ${project} ---------------- `));
  fs.writeJsonSync(`${basePath}/${project}/${packgerFile}`, content(project), { spaces: 2 });
});
