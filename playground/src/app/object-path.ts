import { isNumber } from '../../../akita/src/isNumber';
import { isString } from '../../../akita/src/isString';

const _hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(value) {
  if (isNumber(value)) {
    return false;
  }
  if (!value) {
    return true;
  }
  if (Array.isArray(value) && value.length === 0) {
    return true;
  } else if (!isString(value)) {
    for (var i in value) {
      if (_hasOwnProperty.call(value, i)) {
        return false;
      }
    }
    return true;
  }
  return false;
}

function assignToObj(target, source) {
  for (var key in source) {
    if (_hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
  return target;
}

function getKey(key) {
  var intKey = parseInt(key);
  if (intKey.toString() === key) {
    return intKey;
  }
  return key;
}

function clone(obj, createIfEmpty, assumeArray) {
  if (obj == null) {
    if (createIfEmpty) {
      if (assumeArray) {
        return [];
      }

      return {};
    }

    return obj;
  } else if (Array.isArray(obj)) {
    return obj.slice();
  }

  return assignToObj({}, obj);
}

function changeImmutable(dest, src, path, changeCallback) {
  if (isNumber(path)) {
    path = [path];
  }
  if (isEmpty(path)) {
    return src;
  }
  if (isString(path)) {
    return changeImmutable(dest, src, path.split('.').map(getKey), changeCallback);
  }
  var currentPath = path[0];

  if (!dest || dest === src) {
    dest = clone(src, true, isNumber(currentPath));
  }

  if (path.length === 1) {
    return changeCallback(dest, currentPath);
  }

  if (src != null) {
    src = src[currentPath];
  }

  dest[currentPath] = changeImmutable(dest[currentPath], src, path.slice(1), changeCallback);

  return dest;
}

/** https://github.com/mariocasciaro/object-path-immutable */
export function immutableSetProp(src, path, value) {
  if (isEmpty(path)) {
    return value;
  }
  return changeImmutable(undefined, src, path, function(clonedObj, finalPath) {
    clonedObj[finalPath] = value;
    return clonedObj;
  });
}

export function getProperty<T extends object>(propertyName: string, object: T) {
  let parts = propertyName.split('.'),
    length = parts.length,
    i;

  for (i = 0; i < length; i++) {
    object = object[parts[i]];
  }

  return object;
}
