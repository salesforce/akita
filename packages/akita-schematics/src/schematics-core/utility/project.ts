import { getWorkspace } from '../../ng-g/utils/config';
import { Tree } from '@angular-devkit/schematics';

export interface WorkspaceProject {
  root: string;
  projectType: string;
}

export function getProject(host: Tree, options: { project?: string | undefined; path?: string | undefined }): WorkspaceProject {
  const workspace = getWorkspace(host);

  if (!options.project) {
    options.project = workspace.defaultProject !== undefined ? workspace.defaultProject : Object.keys(workspace.projects)[0];
  }

  return workspace.projects[options.project];
}

export function getProjectPath(host: Tree, options: { project?: string | undefined; path?: string | undefined }) {
  const project = getProject(host, options);

  if (project.root.slice(-1) === '/') {
    project.root = project.root.slice(0, -1);
  }

  if (options.path === undefined) {
    const projectDirName = project.projectType === 'application' ? 'app' : 'lib';

    return `${project.root ? `/${project.root}` : ''}/src/${projectDirName}`;
  }

  return options.path;
}

export function isLib(host: Tree, options: { project?: string | undefined; path?: string | undefined }) {
  const project = getProject(host, options);

  return project.projectType === 'library';
}
