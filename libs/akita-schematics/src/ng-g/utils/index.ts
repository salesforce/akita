import { camelize, capitalize, classify, dasherize, decamelize, featurePath, group, plural, singular, underscore } from './string';

export * from './parse-name';
export * from './project';
export * from './workspace';

export const stringUtils = {
  dasherize,
  decamelize,
  camelize,
  classify,
  underscore,
  group,
  capitalize,
  featurePath,
  singular,
  plural,
};
