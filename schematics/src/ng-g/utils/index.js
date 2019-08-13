"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const string_1 = require("./string");
__export(require("./parse-name"));
__export(require("./project"));
__export(require("./workspace"));
exports.stringUtils = {
    dasherize: string_1.dasherize,
    decamelize: string_1.decamelize,
    camelize: string_1.camelize,
    classify: string_1.classify,
    underscore: string_1.underscore,
    group: string_1.group,
    capitalize: string_1.capitalize,
    featurePath: string_1.featurePath,
    singular: string_1.singular,
    plural: string_1.plural
};
//# sourceMappingURL=index.js.map