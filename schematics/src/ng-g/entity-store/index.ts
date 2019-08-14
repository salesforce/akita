import { Rule, apply, branchAndMerge, chain, filter, mergeWith, move, noop, template, url, Tree, SchematicContext } from '@angular-devkit/schematics';

import { getProjectPath, stringUtils, parseName } from '../utils';

function getExtensionState({ idType, name, withActive }: any) {
  const isID = idType === 'string' || idType === 'number';
  const entityType = stringUtils.singular(stringUtils.classify(name));
  const generics = [entityType];
  if (isID) {
    generics.push(idType);
  }
  const extentions = [`EntityState<${generics.join(', ')}>`];
  if (withActive) {
    const activeState = isID ? `ActiveState<${idType}>` : `ActiveState`;
    extentions.push(activeState);
  }
  return extentions.join(', ');
}

export default function(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    options.path = getProjectPath(host, options);

    // Build state based on options
    const extensionState = getExtensionState(options);

    const parsedPath = parseName(options);
    options.name = parsedPath.name;
    options.path = parsedPath.path;
    const templateSource = apply(url('./files'), [
      options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
      template({
        ...stringUtils,
        ...(options as object),
        extensionState
      } as any),
      move(parsedPath.path)
    ]);

    return chain([branchAndMerge(chain([mergeWith(templateSource)]))])(host, context);
  };
}
