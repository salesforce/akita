import { dasherize, decamelize, camelize, classify, underscore, group, capitalize, featurePath, singular, plural } from './string';
export * from './parse-name';
export * from './project';
export * from './workspace';
export declare const stringUtils: {
    dasherize: typeof dasherize;
    decamelize: typeof decamelize;
    camelize: typeof camelize;
    classify: typeof classify;
    underscore: typeof underscore;
    group: typeof group;
    capitalize: typeof capitalize;
    featurePath: typeof featurePath;
    singular: typeof singular;
    plural: typeof plural;
};
