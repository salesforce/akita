{{#switch storeType}}
{{#case "Entity Store"}}
export * from './{{singular (dashCase name)}}.model';
{{/case}}
{{/switch}}
export * from './{{dashCase name}}.query';
export * from './{{dashCase name}}.service';
export { {{ pascalCase name }}State, {{pascalCase name}}Store } from './{{dashCase name}}.store';
