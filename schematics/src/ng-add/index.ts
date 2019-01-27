import { Rule, SchematicContext, Tree, noop, chain, SchematicsException } from '@angular-devkit/schematics';
import { NodeDependency, addPackageJsonDependency, NodeDependencyType, getWorkspace, getProjectFromWorkspace, addModuleImportToRootModule, getAppModulePath, InsertChange } from 'schematics-utilities';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { Schema } from './schema';
import * as ts from 'typescript';
import { isImported, insertImport } from './utils';

function addPackageJsonDependencies(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [
      {
        type: NodeDependencyType.Default,
        version: '^2.0.0',
        name: '@datorama/akita'
      },
      {
        type: NodeDependencyType.Dev,
        version: '^2.0.0',
        name: 'akita-schematics'
      }
    ];

    if (options.withRouter || options.router) {
      dependencies.push({
        type: NodeDependencyType.Dev,
        version: '^1.0.0',
        name: '@datorama/akita-ng-router-store'
      });
    }

    if (options.devtools) {
      dependencies.push({
        type: NodeDependencyType.Dev,
        version: '^1.0.2',
        name: '@datorama/akita-ngdevtools'
      });
    }

    dependencies.forEach(dependency => {
      addPackageJsonDependency(host, dependency);
      context.logger.log('info', `✅️ Added "${dependency.name}" into ${dependency.type}`);
    });

    return host;
  };
}

function installPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.logger.log('info', `🔍 Installing packages...`);

    return host;
  };
}

function getTsSourceFile(host: Tree, path: string): ts.SourceFile {
  const buffer = host.read(path);
  if (!buffer) {
    throw new SchematicsException(`Could not read file (${path}).`);
  }
  const content = buffer.toString();
  const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);

  return source;
}

function injectImports(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    if (!options.router && !options.devtools) {
      return;
    }
    const workspace = getWorkspace(host);
    const project = getProjectFromWorkspace(
      workspace,
      // Takes the first project in case it's not provided by CLI
      options.project ? options.project : Object.keys(workspace['projects'])[0]
    );
    const modulePath = getAppModulePath(host, (project as any).architect.build.options.main);

    let moduleSource = getTsSourceFile(host, modulePath);
    let importModule = 'environment';
    let importPath = '../environments/environment';

    if (!isImported(moduleSource, importModule, importPath)) {
      const change = insertImport(moduleSource, modulePath, importModule, importPath);

      if (change) {
        const recorder = host.beginUpdate(modulePath);
        recorder.insertLeft((change as InsertChange).pos, (change as InsertChange).toAdd);
        host.commitUpdate(recorder);
      }
    }

    if (options.withRouter || options.router) {
      const routerChange = insertImport(moduleSource, modulePath, 'AkitaNgRouterStoreModule', '@datorama/akita-ng-router-store');
      if (routerChange) {
        const recorder = host.beginUpdate(modulePath);
        recorder.insertLeft((routerChange as InsertChange).pos, (routerChange as InsertChange).toAdd);
        host.commitUpdate(recorder);
      }
    }

    if (options.devtools) {
      const devtoolsChange = insertImport(moduleSource, modulePath, 'AkitaNgDevtools', '@datorama/akita-ngdevtools');
      if (devtoolsChange) {
        const recorder = host.beginUpdate(modulePath);
        recorder.insertLeft((devtoolsChange as InsertChange).pos, (devtoolsChange as InsertChange).toAdd);
        host.commitUpdate(recorder);
      }
    }

    return host;
  };
}

function setSchematicsAsDefault(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const exec = require('child_process').exec;

    exec('ng config cli.defaultCollection akita-schematics', () => {
      context.logger.log('info', `✅️ Setting Akita schematics as default`);
    });
    return host;
  };
}

function addModuleToImports(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(host);
    const project = getProjectFromWorkspace(
      workspace,
      // Takes the first project in case it's not provided by CLI
      options.project ? options.project : Object.keys(workspace['projects'])[0]
    );

    let importm = '';

    if ((options.withRouter || options.router) && options.devtools) {
      importm = `environment.production ?
        [] :
        [ AkitaNgDevtools.forRoot(), AkitaNgRouterStoreModule.forRoot() ]`;
    } else if (options.devtools) {
      importm = `environment.production ? [] : AkitaNgDevtools.forRoot()`;
    }

    if (importm) {
      addModuleImportToRootModule(host, importm, null as any, project);
    }

    if (options.devtools) {
      context.logger.log('info', `✅️ AkitaNgDevtools is imported`);
    }

    if (options.withRouter || options.router) {
      context.logger.log('info', `✅️ AkitaNgRouterStoreModule is imported`);
    }

    return host;
  };
}

function log(): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.logger.log('info', `👏 Create your first entity store by running: ng g af todos/todos`);

    return host;
  };
}

export function akitaNgAdd(options: Schema): Rule {
  return chain([
    options && options.skipPackageJson ? noop() : addPackageJsonDependencies(options),
    options && options.skipPackageJson ? noop() : installPackageJsonDependencies(),
    addModuleToImports(options),
    injectImports(options),
    setSchematicsAsDefault(),
    log()
  ]);
}
