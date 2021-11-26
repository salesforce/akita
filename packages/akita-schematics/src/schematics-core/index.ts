import { dasherize, decamelize, camelize, classify, underscore, group, capitalize, featurePath, pluralize } from './utility/strings';


export {
  findNodes,
  getSourceNodes,
  getDecoratorMetadata,
  getContentOfKeyLiteral,
  insertAfterLastOccurrence,
  insertImport,
  addBootstrapToModule,
  addDeclarationToModule,
  addExportToModule,
  addImportToModule,
  addProviderToModule,
  replaceImport,
  containsProperty,
} from '../ng-g/utils/ast-utils';

export { Host, Change, NoopChange, InsertChange, RemoveChange, ReplaceChange, createReplaceChange, createChangeRecorder, commitChanges } from '../ng-g/utils/change';

export { AppConfig, getWorkspace, getWorkspacePath } from '../ng-g/utils/config';

export { findModule, findModuleFromOptions, buildRelativePath, ModuleOptions } from '../ng-g/utils/find-module';


export { getProjectPath, getProject, isLib } from './utility/project';

export const stringUtils = {
  dasherize,
  decamelize,
  camelize,
  classify,
  underscore,
  group,
  capitalize,
  featurePath,
  pluralize,
};

export { parseName } from './utility/parse-name';
