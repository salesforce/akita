import { Rule, SchematicContext, Tree, chain, schematic } from '@angular-devkit/schematics';

const enum EntityServiceType {
  http = 'Http',
  firebase = 'Firebase',
  default = 'Default'
}

export default function(options: any): Rule {
  const plain = options.plain;
  const withModule = options.withModule;
  const entityService = plain ? 'default' : options.entityService;

  const serviceSchematic = entityService === EntityServiceType.http ? 'http-entity-service' : entityService === EntityServiceType.firebase ? 'firebase-entity-service' : 'akita-service';

  let files = [
    schematic(plain ? 'store' : 'entity-store', {
      flat: options.flat,
      name: options.name,
      path: options.path,
      project: options.project,
      dirName: options.dirName,
      feature: true,
      spec: options.spec,
      withActive: entityService === EntityServiceType.firebase ? true : options.withActive,
      idType: entityService === EntityServiceType.firebase ? 'string' : options.idType
    }),
    schematic(plain ? 'query' : 'entity-query', {
      flat: options.flat,
      name: options.name,
      path: options.path,
      project: options.project,
      spec: options.spec,
      dirName: options.dirName,
      feature: true
    }),
    schematic(serviceSchematic, {
      flat: options.flat,
      module: options.module,
      name: options.name,
      path: options.path,
      project: options.project,
      spec: options.spec,
      plain,
      dirName: options.dirName,
      feature: true
    })
  ];

  if (!plain) {
    files = files.concat([
      schematic('model', {
        flat: options.flat,
        module: options.module,
        name: options.name,
        path: options.path,
        project: options.project,
        spec: options.spec,
        dirName: options.dirName,
        feature: true
      })
    ]);
  }

  if (withModule) {
    files = files.concat([
      schematic('withModule', {
        flat: options.flat,
        module: options.module,
        name: options.name,
        path: options.path,
        project: options.project,
        spec: options.spec,
        dirName: options.dirName,
        feature: true
      }),

      schematic('withComponent', {
        flat: options.flat,
        module: options.module,
        name: options.name,
        path: options.path,
        project: options.project,
        spec: options.spec,
        dirName: options.dirName,
        styleext: options.styleext,
        entity: !options.plain,
        feature: true
      })
    ]);
  }
  return (host: Tree, context: SchematicContext) => {
    return chain(files)(host, context);
  };
}
