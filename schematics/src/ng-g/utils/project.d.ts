import { Tree } from '@angular-devkit/schematics';
export declare function getProjectPath(host: Tree, options: {
    project?: string | undefined;
    path?: string | undefined;
}): string;
export declare function getProject(workspaceOrHost: any, projectName: string): any;
export declare function isWorkspaceSchema(workspace: any): boolean;
