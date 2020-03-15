import { Path, basename, dirname, normalize } from '@angular-devkit/core';

export interface Location {
  name: string;
  path: Path;
}

export function parseName(options: any): Location {
  const { name, path, dirName, feature } = options;
  const nameWithoutPath = basename(name as Path);
  const namePath = dirname((path + '/' + name) as Path);
  const normalizedPath = feature ? normalize('/' + namePath + '/' + dirName) : normalize('/' + namePath);

  return {
    name: nameWithoutPath,
    path: normalizedPath
  };
}
