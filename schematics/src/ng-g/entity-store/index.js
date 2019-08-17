"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const utils_1 = require("../utils");
function getExtensionState({ idType, name, withActive }) {
    const isID = idType === 'string' || idType === 'number';
    const entityName = name.split('/').pop();
    const entityType = utils_1.stringUtils.singular(utils_1.stringUtils.classify(entityName));
    const generics = [entityType];
    if (isID) {
        generics.push(idType);
    }
    const extensions = [`EntityState<${generics.join(', ')}>`];
    if (withActive) {
        const activeState = isID ? `ActiveState<${idType}>` : `ActiveState`;
        extensions.push(activeState);
    }
    return extensions.join(', ');
}
function default_1(options) {
    return (host, context) => {
        options.path = utils_1.getProjectPath(host, options);
        // Build state based on options
        const extensionState = getExtensionState(options);
        const parsedPath = utils_1.parseName(options);
        options.name = parsedPath.name;
        options.path = parsedPath.path;
        const templateSource = schematics_1.apply(schematics_1.url('./files'), [
            options.spec ? schematics_1.noop() : schematics_1.filter(path => !path.endsWith('.spec.ts')),
            schematics_1.template(Object.assign({}, utils_1.stringUtils, options, { extensionState })),
            schematics_1.move(parsedPath.path)
        ]);
        return schematics_1.chain([schematics_1.branchAndMerge(schematics_1.chain([schematics_1.mergeWith(templateSource)]))])(host, context);
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map