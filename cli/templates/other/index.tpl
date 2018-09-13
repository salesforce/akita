export * from './{{dashCase name}}.query';
export * from './{{dashCase name}}.store';
export * from './{{dashCase name}}.service';
{{#switch storeType}}
{{#case "Entity Store"}}
export * from './{{singular (dashCase name)}}.model';
{{/case}}
{{/switch}}