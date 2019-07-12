"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const workspace_1 = require("./workspace");
function getProjectPath(host, options) {
    const workspace = workspace_1.getWorkspace(host);
    if (!options.project) {
        options.project = Object.keys(workspace.projects)[0];
    }
    const project = workspace.projects[options.project];
    if (project.root.substr(-1) === '/') {
        project.root = project.root.substr(0, project.root.length - 1);
    }
    if (options.path === undefined) {
        const projectDirName = project.projectType === 'application' ? 'app' : 'lib';
        const root = project.sourceRoot ? `/${project.sourceRoot}/` : `/${project.root}/src/`;
        return `${root}${projectDirName}`;
    }
    return options.path;
}
exports.getProjectPath = getProjectPath;
function getProject(workspaceOrHost, projectName) {
    const workspace = isWorkspaceSchema(workspaceOrHost) ? workspaceOrHost : workspace_1.getWorkspace(workspaceOrHost);
    return workspace.projects[projectName];
}
exports.getProject = getProject;
function isWorkspaceSchema(workspace) {
    return !!(workspace && workspace.projects);
}
exports.isWorkspaceSchema = isWorkspaceSchema;
//# sourceMappingURL=project.js.map