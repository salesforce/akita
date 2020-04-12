import { ID, IDS } from './types';
import { isNil } from './isNil';
import { isObject } from './isObject';
import { isArray } from './isArray';

export type SetActiveOptions = { prev?: boolean; next?: boolean; wrap?: boolean };

// @internal
export function getActiveEntities(idOrOptions: IDS | SetActiveOptions | null, ids: ID[], currentActive: IDS | null) {
  let result;

  if (isArray(idOrOptions)) {
    result = idOrOptions;
  } else {
    if (isObject(idOrOptions)) {
      if (isNil(currentActive)) return;
      (idOrOptions as SetActiveOptions) = Object.assign({ wrap: true }, idOrOptions);
      const currentIdIndex = ids.indexOf(currentActive as ID);
      if ((idOrOptions as SetActiveOptions).prev) {
        const isFirst = currentIdIndex === 0;
        if (isFirst && !(idOrOptions as SetActiveOptions).wrap) return;
        result = isFirst ? ids[ids.length - 1] : (ids[currentIdIndex - 1] as any);
      } else if ((idOrOptions as SetActiveOptions).next) {
        const isLast = ids.length === currentIdIndex + 1;
        if (isLast && !(idOrOptions as SetActiveOptions).wrap) return;
        result = isLast ? ids[0] : (ids[currentIdIndex + 1] as any);
      }
    } else {
      if (idOrOptions === currentActive) return;
      result = idOrOptions as ID;
    }
  }

  return result;
}
