import { isObject, isPlainObject } from '../src/internal/utils';

class TestClass {}

describe('Utils', () => {
  describe('isPlainObject', () => {
    it('should return true', () => {
      expect(isPlainObject({})).toBeTruthy();
    });

    it('should return false', () => {
      expect(isPlainObject(class User {})).toBeFalsy();
    });

    it('should return false when passing function', () => {
      expect(isPlainObject(function() {})).toBeFalsy();
    });
  });

  describe('isObject', () => {
    it('should return true', () => {
      expect(isObject({})).toBeTruthy();
    });

    it('should return false', () => {
      expect(isObject(class User {})).toBeFalsy();
    });

    it('should return false when passing function', () => {
      expect(isObject(function() {})).toBeFalsy();
    });
  });
});
