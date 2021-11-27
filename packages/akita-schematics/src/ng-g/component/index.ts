import { Rule, apply, branchAndMerge, chain, mergeWith, move, template, url, Tree, SchematicContext } from '@angular-devkit/schematics';

import { getProjectPath, stringUtils, parseName, getProject } from '../utils';
import { dasherize } from '../utils/string';

function buildSelector(options: any, projectPrefix: string) {
  let selector = dasherize(options.name);
  if (options.prefix) {
    selector = `${options.prefix}-${selector}`;
  } else if (options.prefix === undefined && projectPrefix) {
    selector = `${projectPrefix}-${selector}`;
  }

  return selector;
}

export default function(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    const project = getProject(host, options.project);

    options.path = getProjectPath(host, options);

    const parsedPath = parseName(options);

    (parsedPath as any).path = parsedPath.path.replace(`${options.dirName}`, `${parsedPath.name}/`);

    options.name = parsedPath.name;
    options.path = parsedPath.path;
    options.selector = options.selector || buildSelector(options, project.prefix);

    const templateSource = apply(url('./files'), [
      template({
        ...stringUtils,
        ...(options as object)
      } as any),
      move(parsedPath.path)
    ]);

    return chain([branchAndMerge(chain([mergeWith(templateSource)]))])(host, context);
  };
}
