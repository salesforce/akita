import { getFunctionName, isObject, isPlainObject } from '../src/internal/utils';

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

  describe('getFunctionName', () => {
    it('should return empty string when the argument is null', () => {
      expect(getFunctionName(null)).toEqual('');
    });

    it('should return empty string when the argument is empty string', () => {
      expect(getFunctionName('')).toEqual('');
    });

    it('should return empty string when the argument is an object', () => {
      expect(getFunctionName({})).toEqual('');
    });

    it('should return the function when the argument is a named function', () => {
      expect(getFunctionName(function foo() {})).toEqual('foo');
    });

    it('should return an empty string when the argument is an anonymous function ', () => {
      expect(getFunctionName(function() {})).toEqual('');
    });

    it("should return the class's name when the argument is a class ", () => {
      expect(getFunctionName(TestClass)).toEqual('TestClass');
    });

    it('should return the function name', () => {
      const es5Func = function es5() {};
      delete (es5Func as any).name;
      expect(getFunctionName(es5Func)).toEqual('es5');
    });
  });
});
