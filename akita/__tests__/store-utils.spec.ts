import { decrement, increment } from '../src/api/store-utils';

describe('Store utils', () => {
  describe('increment', () => {
    it('should increment', () => {
      let value = 0;
      let next;
      expect((next = increment(value))).toEqual(1);
      expect((next = increment(next))).toEqual(2);
      expect((next = increment(next))).toEqual(3);
    });

    it('should support max value', () => {
      let value = 0;
      let next;
      expect((next = increment(value, { maxValue: 5 }))).toEqual(1);
      expect((next = increment(next, { maxValue: 5 }))).toEqual(2);
      expect((next = increment(next, { maxValue: 5 }))).toEqual(3);
      expect((next = increment(next, { maxValue: 5 }))).toEqual(4);
      expect((next = increment(next, { maxValue: 5 }))).toEqual(5);
      expect((next = increment(next, { maxValue: 5 }))).toEqual(5);
      expect((next = increment(next, { maxValue: 5 }))).toEqual(5);
    });
  });

  describe('decrement', () => {
    it('should decrement', () => {
      let value = 10;
      let next;
      expect((next = decrement(value))).toEqual(9);
      expect((next = decrement(next))).toEqual(8);
      expect((next = decrement(next))).toEqual(7);
    });

    it('should not support negative by default', () => {
      let value = 5;
      let next;
      expect((next = decrement(value))).toEqual(4);
      expect((next = decrement(next))).toEqual(3);
      expect((next = decrement(next))).toEqual(2);
      expect((next = decrement(next))).toEqual(1);
      expect((next = decrement(next))).toEqual(0);
      expect((next = decrement(next))).toEqual(0);
      expect((next = decrement(next))).toEqual(0);
    });

    it('should support negative', () => {
      let value = 5;
      let next;
      expect((next = decrement(value, { allowNegative: true }))).toEqual(4);
      expect((next = decrement(next, { allowNegative: true }))).toEqual(3);
      expect((next = decrement(next, { allowNegative: true }))).toEqual(2);
      expect((next = decrement(next, { allowNegative: true }))).toEqual(1);
      expect((next = decrement(next, { allowNegative: true }))).toEqual(0);
      expect((next = decrement(next, { allowNegative: true }))).toEqual(-1);
      expect((next = decrement(next, { allowNegative: true }))).toEqual(-2);
    });
  });
});
