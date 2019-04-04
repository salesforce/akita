import { isPlainObject } from '../src/isPlainObject';

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
});
