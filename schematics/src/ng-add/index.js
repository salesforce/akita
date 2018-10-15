"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const schematics_utilities_1 = require("schematics-utilities");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const ts = require("typescript");
function addPackageJsonDependencies(options) {
    return (host, context) => {
        const dependencies = [
            {
                type: schematics_utilities_1.NodeDependencyType.Default,
                version: '~1.10.0',
                name: '@datorama/akita'
            },
            {
                type: schematics_utilities_1.NodeDependencyType.Default,
                version: '~1.0.2',
                name: '@datorama/akita-ngdevtools'
            },
            {
                type: schematics_utilities_1.NodeDependencyType.Default,
                version: '~1.0.0',
                name: 'akita-schematics'
            }
        ];
        if (options.withRouter) {
            dependencies.push({
                type: schematics_utilities_1.NodeDependencyType.Default,
                version: '~1.0.0',
                name: '@datorama/akita-ng-router-store'
            });
        }
        dependencies.forEach(dependency => {
            schematics_utilities_1.addPackageJsonDependency(host, dependency);
            context.logger.log('info', `✅️ Added "${dependency.name}" into ${dependency.type}`);
        });
        return host;
    };
}
function installPackageJsonDependencies() {
    return (host, context) => {
        context.addTask(new tasks_1.NodePackageInstallTask());
        context.logger.log('info', `🔍 Installing packages...`);
        return host;
    };
}
function getTsSourceFile(host, path) {
    const buffer = host.read(path);
    if (!buffer) {
        throw new schematics_1.SchematicsException(`Could not read file (${path}).`);
    }
    const content = buffer.toString();
    const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);
    return source;
}
function injectImports(options) {
    return (host, context) => {
        const workspace = schematics_utilities_1.getWorkspace(host);
        const project = schematics_utilities_1.getProjectFromWorkspace(workspace, 
        // Takes the first project in case it's not provided by CLI
        options.project ? options.project : Object.keys(workspace['projects'])[0]);
        const modulePath = schematics_utilities_1.getAppModulePath(host, project.architect.build.options.main);
        let moduleSource = getTsSourceFile(host, modulePath);
        let importModule = 'environment';
        let importPath = '../environments/environment';
        if (!schematics_utilities_1.isImported(moduleSource, importModule, importPath)) {
            const change = schematics_utilities_1.insertImport(moduleSource, modulePath, importModule, importPath);
            if (change) {
                const recorder = host.beginUpdate(modulePath);
                recorder.insertLeft(change.pos, change.toAdd);
                host.commitUpdate(recorder);
            }
        }
        const routerChange = schematics_utilities_1.insertImport(moduleSource, modulePath, 'AkitaNgRouterStoreModule', '@datorama/akita-ng-router-store');
        if (routerChange) {
            const recorder = host.beginUpdate(modulePath);
            recorder.insertLeft(routerChange.pos, routerChange.toAdd);
            host.commitUpdate(recorder);
        }
        const devtoolsChange = schematics_utilities_1.insertImport(moduleSource, modulePath, 'AkitaNgDevtools', '@datorama/akita-ngdevtools');
        if (devtoolsChange) {
            const recorder = host.beginUpdate(modulePath);
            recorder.insertLeft(devtoolsChange.pos, devtoolsChange.toAdd);
            host.commitUpdate(recorder);
        }
        return host;
    };
}
function setSchematicsAsDefault() {
    return (host, context) => {
        const exec = require('child_process').exec;
        exec('ng config cli.defaultCollection akita-schematics', () => {
            context.logger.log('info', `✅️ Setting Akita schematics as default`);
        });
        return host;
    };
}
function addModuleToImports(options) {
    return (host, context) => {
        const workspace = schematics_utilities_1.getWorkspace(host);
        const project = schematics_utilities_1.getProjectFromWorkspace(workspace, 
        // Takes the first project in case it's not provided by CLI
        options.project ? options.project : Object.keys(workspace['projects'])[0]);
        let importm;
        if (options.withRouter) {
            importm = `environment.production ?
        [] :
        [ AkitaNgDevtools.forRoot(), AkitaNgRouterStoreModule.forRoot() ]
      `;
        }
        else {
            importm = `environment.production ? [] : AkitaNgRouterStoreModule.forRoot()`;
        }
        schematics_utilities_1.addModuleImportToRootModule(host, importm, null, project);
        context.logger.log('info', `✅️ AkitaNgDevtools is imported`);
        if (options.withRouter) {
            context.logger.log('info', `✅️ AkitaNgRouterStoreModule is imported`);
        }
        return host;
    };
}
function log() {
    return (host, context) => {
        context.logger.log('info', `👏 Create your first entity store by running: ng g af todos/todos`);
        return host;
    };
}
function akitaNgAdd(options) {
    return schematics_1.chain([
        options && options.skipPackageJson ? schematics_1.noop() : addPackageJsonDependencies(options),
        options && options.skipPackageJson
            ? schematics_1.noop()
            : installPackageJsonDependencies(),
        addModuleToImports(options),
        injectImports(options),
        setSchematicsAsDefault(),
        log()
    ]);
}
exports.akitaNgAdd = akitaNgAdd;
//# sourceMappingURL=index.js.map