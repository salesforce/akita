const path = require('path');
const pluralize = require('pluralize');
const finder = require('find-package-json');
const pjson = finder(process.cwd()).next().value;
let userPath,
  customFolderName,
  template = 'js';

module.exports = function(plop) {
  userPath = (pjson.akitaCli && pjson.akitaCli.basePath) || '';
  customFolderName = (pjson.akitaCli && pjson.akitaCli.customFolderName) || false;

  if (pjson.akitaCli && 'template' in pjson.akitaCli) {
    template = pjson.akitaCli.template;
  }

  const userConfig = path.resolve(process.cwd(), userPath);
  const basePath = userConfig || process.cwd();

  plop.setPrompt('fuzzypath', require('inquirer-fuzzy-path'));

  const chooseDirAction = {
    type: 'fuzzypath',
    name: 'directory',
    itemType: 'directory',
    excludePath: nodePath => nodePath.startsWith('node_modules'),
    message: 'Choose a directory..',
    rootPath: basePath
  };

  const customFolderNameAction = {
    type: 'input',
    name: 'folderName',
    message: 'Give me a folder name, please'
  };

  plop.setGenerator('Akita', {
    description: 'Create new stack',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Give me a name, please 😀'
      },
      {
        type: 'list',
        name: 'storeType',
        choices: ['Entity Store', 'Store'],
        message: 'Which store do you need? 😊'
      }
    ].concat(customFolderName ? customFolderNameAction : [], chooseDirAction),
    actions: function(data) {
      const { storeType, directory, folderName } = data;
      data.isStore = storeType === 'Store';
      data.isEntityStore = storeType === 'Entity Store';
      const templateBase = template;

      const extension = template === 'js' ? 'js' : 'ts';

      const files = [
        {
          type: 'add',
          skipIfExists: true,
          path: buildPath(`index.${extension}`, directory, folderName),
          templateFile: `./templates/${templateBase}/index.tpl`
        },
        {
          type: 'add',
          skipIfExists: true,
          path: buildPath(`{{'dashCase' name}}.query.${extension}`, directory, folderName),
          templateFile: `./templates/${templateBase}/${data.isEntityStore ? 'entity-query' : 'query'}.tpl`
        },
        {
          type: 'add',
          skipIfExists: true,
          path: buildPath(`{{'dashCase' name}}.${extension}`, directory, folderName),
          templateFile: `./templates/${templateBase}/${data.isEntityStore ? 'entity-store' : 'store'}.tpl`
        }
      ];

      if (template !== 'js') {
        files.push({
          type: 'add',
          skipIfExists: true,
          path: buildPath(`{{'dashCase' name}}.service.${extension}`, directory, folderName),
          templateFile: `./templates/${templateBase}/service.tpl`
        });

        if (data.isEntityStore) {
          files.push({
            type: 'add',
            skipIfExists: true,
            path: buildPath(`{{ 'singular' ('dashCase' name) name}}.${extension}`, directory, folderName),
            templateFile: `./templates/${templateBase}/model.tpl`
          });
        }
      }

      return files;
    }
  });

  plop.setHelper('switch', function(value, options) {
    this._switch_value_ = value;
    var html = options.fn(this);
    delete this._switch_value_;
    return html;
  });

  plop.setHelper('case', function(value, options) {
    if (value == this._switch_value_) {
      return options.fn(this);
    }
  });

  plop.setHelper('singular', function(value) {
    return pluralize.singular(value);
  });

  function buildPath(name, chosenDir, folderName = 'state') {
    return `${chosenDir}/${folderName}/${name}`;
    // if (userPath) {
    //   return `${userConfig}/${chosenDir}/${folderName}/${name}`;
    // }
    // return `${process.cwd()}/${chosenDir}/${folderName}/${name}`;
  }
};
