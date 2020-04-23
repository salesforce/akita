import { apply, branchAndMerge, chain, mergeWith, move, Rule, SchematicContext, template, Tree, url } from '@angular-devkit/schematics';
import { getProject, getProjectPath, parseName, stringUtils } from '../utils';
import { dasherize } from '../utils/string';

function buildSelector(options: any, projectPrefix: string): string {
  let selector = dasherize(options.name);
  if (options.prefix) {
    selector = `${options.prefix}-${selector}`;
  } else if (options.prefix === undefined && projectPrefix) {
    selector = `${projectPrefix}-${selector}`;
  }

  return selector;
}

export default function (options: any): Rule {
  const optionsCopy = { ...options };
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return (host: Tree, context: SchematicContext) => {
    const project = getProject(host, optionsCopy.project);

    optionsCopy.path = getProjectPath(host, optionsCopy);

    const parsedPath = parseName(optionsCopy);

    (parsedPath as any).path = parsedPath.path.replace(`${optionsCopy.dirName}`, `${parsedPath.name}/`);

    optionsCopy.name = parsedPath.name;
    optionsCopy.path = parsedPath.path;
    optionsCopy.selector = optionsCopy.selector || buildSelector(optionsCopy, project.prefix);

    const templateSource = apply(url('./files'), [
      template({
        ...stringUtils,
        ...(optionsCopy as object),
      } as any),
      move(parsedPath.path),
    ]);

    return chain([branchAndMerge(chain([mergeWith(templateSource)]))])(host, context);
  };
}
