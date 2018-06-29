const promptDirectory = require('inquirer-directory');
const path = require('path');
const pluralize = require('pluralize');
const finder = require('find-package-json');
const pjson = finder(process.cwd()).next().value;
let userPath;

module.exports = function( plop ) {
  userPath = pjson.akitaCli && pjson.akitaCli.basePath || '';
  const userConfig = path.resolve(process.cwd(), userPath);

  const basePath = userConfig || process.cwd();

  plop.setPrompt('directory', promptDirectory);

  const chooseDirAction = {
    type    : 'directory',
    name    : 'directory',
    message : 'Choose a directory..',
    basePath: basePath
  };

  plop.setGenerator('Akita', {
    description: 'Create new stack',
    prompts    : [
      {
        type   : 'input',
        name   : 'name',
        message: 'Give me a name, please 😀'
      },
      {
        type   : 'list',
        name   : 'storeType',
        choices: ['Entity Store', 'Store'],
        message: 'Which store do you need? 😊'
      },
      {
        type   : 'confirm',
        default: false,
        name   : 'UIStore',
        message: 'Is it UIStore?'
      }
    ].concat(chooseDirAction),
    actions    : function( data ) {
      const { storeType, directory } = data;

      data.isStore = storeType === 'Store';
      data.isEntityStore = storeType === 'Entity Store';
      const dataService = {
        type        : 'add',
        skipIfExists: true,
        path        : buildPath('{{\'dashCase\' name}}-data.service.ts', directory),
        templateFile: './templates/data-service.tpl'
      };

      const index = {
        type        : 'add',
        skipIfExists: true,
        path        : buildPath('index.ts', directory),
        templateFile: './templates/index.tpl'
      };

      const model = {
        type        : 'add',
        skipIfExists: true,
        path        : buildPath('{{ \'singular\' (\'dashCase\' name) name}}.model.ts', directory),
        templateFile: './templates/model.tpl'
      };

      const query = {
        type        : 'add',
        skipIfExists: true,
        path        : buildPath('{{\'dashCase\' name}}.query.ts', directory),
        templateFile: './templates/query.tpl'
      };

      const service = {
        type        : 'add',
        skipIfExists: true,
        path        : buildPath('{{\'dashCase\' name}}.service.ts', directory),
        templateFile: './templates/service.tpl'
      };

      const store = {
        type        : 'add',
        skipIfExists: true,
        path        : buildPath('{{\'dashCase\' name}}.store.ts', directory),
        templateFile: './templates/store.tpl'
      };

      const WholeShebang = [dataService, model, query, service, store, index];

      return WholeShebang;
    }
  });

  plop.setHelper('storeClassPostfix', function( type, options ) {
    switch( type ) {
      case 'Store':
        return `Store`;
      case 'Entity Store':
        return `EntityStore`;
      default:
        return `Store`;
    }
  });

  plop.setHelper('queryClassPostfix', function( type, options ) {
    switch( type ) {
      case 'Store':
        return `Query`;
      case 'Entity Store':
        return `QueryEntity`;
      default:
        return `Query`;
    }
  });

  plop.setHelper('switch', function( value, options ) {
    this._switch_value_ = value;
    var html = options.fn(this);
    delete this._switch_value_;
    return html;
  });

  plop.setHelper('case', function( value, options ) {
    if( value == this._switch_value_ ) {
      return options.fn(this);
    }
  });

  plop.setHelper('singular', function( value ) {
    return pluralize.singular(value);
  });

  function buildPath( name, chosenDir ) {
    if(userPath) {
      return `${userConfig}/${chosenDir}/state/${name}`;
    }
     return `${process.cwd()}/${chosenDir}/state/${name}`;
  }

};
