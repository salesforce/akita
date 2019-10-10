"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
function default_1(options) {
    const plain = options.plain;
    const withModule = options.withModule;
    const entityService = plain ? 'default' : options.entityService;
    const serviceSchematic = entityService === "Http" /* http */ ? 'http-entity-service' : entityService === "Firebase" /* firebase */ ? 'firebase-entity-service' : 'akita-service';
    let files = [
        schematics_1.schematic(plain ? 'store' : 'entity-store', {
            flat: options.flat,
            name: options.name,
            path: options.path,
            project: options.project,
            dirName: options.dirName,
            feature: true,
            spec: options.spec,
            withActive: entityService === "Firebase" /* firebase */ ? true : options.withActive,
            idType: entityService === "Firebase" /* firebase */ ? 'string' : options.idType
        }),
        schematics_1.schematic(plain ? 'query' : 'entity-query', {
            flat: options.flat,
            name: options.name,
            path: options.path,
            project: options.project,
            spec: options.spec,
            dirName: options.dirName,
            feature: true
        }),
        schematics_1.schematic(serviceSchematic, {
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
            schematics_1.schematic('model', {
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
            schematics_1.schematic('withModule', {
                flat: options.flat,
                module: options.module,
                name: options.name,
                path: options.path,
                project: options.project,
                spec: options.spec,
                dirName: options.dirName,
                feature: true
            }),
            schematics_1.schematic('withComponent', {
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
    return (host, context) => {
        return schematics_1.chain(files)(host, context);
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map