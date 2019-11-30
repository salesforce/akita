"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const utils_1 = require("../utils");
const string_1 = require("../utils/string");
function buildSelector(options, projectPrefix) {
    let selector = string_1.dasherize(options.name);
    if (options.prefix) {
        selector = `${options.prefix}-${selector}`;
    }
    else if (options.prefix === undefined && projectPrefix) {
        selector = `${projectPrefix}-${selector}`;
    }
    return selector;
}
function default_1(options) {
    return (host, context) => {
        const project = utils_1.getProject(host, options.project);
        options.path = utils_1.getProjectPath(host, options);
        const parsedPath = utils_1.parseName(options);
        parsedPath.path = parsedPath.path.replace(`${options.dirName}`, `${parsedPath.name}/`);
        options.name = parsedPath.name;
        options.path = parsedPath.path;
        options.selector = options.selector || buildSelector(options, project.prefix);
        const templateSource = schematics_1.apply(schematics_1.url('./files'), [
            schematics_1.template(Object.assign({}, utils_1.stringUtils, options)),
            schematics_1.move(parsedPath.path)
        ]);
        return schematics_1.chain([schematics_1.branchAndMerge(schematics_1.chain([schematics_1.mergeWith(templateSource)]))])(host, context);
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map