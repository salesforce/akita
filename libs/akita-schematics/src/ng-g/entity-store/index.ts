import { apply, branchAndMerge, chain, filter, mergeWith, move, noop, Rule, SchematicContext, template, Tree, url } from '@angular-devkit/schematics';
import { getProjectPath, parseName, stringUtils } from '../utils';

function getExtensionState({ idType, name, withActive }: any): string {
  const isID = idType === 'string' || idType === 'number';
  const entityName = name.split('/').pop();
  const entityType = stringUtils.singular(stringUtils.classify(entityName));
  const generics = [entityType];
  if (isID) {
    generics.push(idType);
  }
  const extensions = [`EntityState<${generics.join(', ')}>`];
  if (withActive) {
    const activeState = isID ? `ActiveState<${idType}>` : `ActiveState`;
    extensions.push(activeState);
  }
  return extensions.join(', ');
}

export default function (options: any): Rule {
  const optionsCopy = { ...options };
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return (host: Tree, context: SchematicContext) => {
    optionsCopy.path = getProjectPath(host, optionsCopy);

    // Build state based on options
    const extensionState = getExtensionState(optionsCopy);

    const parsedPath = parseName(optionsCopy);
    optionsCopy.name = parsedPath.name;
    optionsCopy.path = parsedPath.path;
    const templateSource = apply(url('./files'), [
      optionsCopy.spec ? noop() : filter((path) => !path.endsWith('.spec.ts')),
      template({
        ...stringUtils,
        ...(optionsCopy as object),
        extensionState,
      } as any),
      move(parsedPath.path),
    ]);

    return chain([branchAndMerge(chain([mergeWith(templateSource)]))])(host, context);
  };
}
