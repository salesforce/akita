import { Tree } from '@angular-devkit/schematics';
import { getWorkspace } from 'schematics-utilities-fix';

export function getProjectPath(host: Tree, options: { project?: string | undefined; path?: string | undefined }) {
  const workspace = getWorkspace(host);

  if (!options.project) {
    options.project = Object.keys(workspace.projects)[0];
  }

  const project = workspace.projects[options.project];

  if (project.root.slice(-1) === '/') {
    project.root = project.root.slice(0, -1);
  }

  if (options.path === undefined) {
    const projectDirName = project.projectType === 'application' ? 'app' : 'lib';
    const root = project.sourceRoot ? `/${project.sourceRoot}/` : `/${project.root}/src/`;
    return `${root}${projectDirName}`;
  }

  return options.path;
}

export function getProject(workspaceOrHost: any, projectName: string) {
  const workspace = isWorkspaceSchema(workspaceOrHost) ? workspaceOrHost : getWorkspace(workspaceOrHost);

  return workspace.projects[projectName];
}

export function isWorkspaceSchema(workspace: any) {
  return !!(workspace && (workspace as any).projects);
}
