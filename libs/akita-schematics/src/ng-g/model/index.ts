import { apply, branchAndMerge, chain, mergeWith, move, Rule, SchematicContext, template, Tree, url } from '@angular-devkit/schematics';
import { getProjectPath, parseName, stringUtils } from '../utils';

export default function (options: any): Rule {
  const optionsCopy = { ...options };
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return (host: Tree, context: SchematicContext) => {
    optionsCopy.path = getProjectPath(host, optionsCopy);

    const parsedPath = parseName(optionsCopy);
    optionsCopy.name = parsedPath.name;
    optionsCopy.path = parsedPath.path;

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
