"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
function parseName(options) {
    const { name, path, dirName, feature } = options;
    const nameWithoutPath = core_1.basename(name);
    const namePath = core_1.dirname((path + '/' + name));
    const normalizedPath = feature ? core_1.normalize('/' + namePath + '/' + dirName) : core_1.normalize('/' + namePath);
    return {
        name: nameWithoutPath,
        path: normalizedPath
    };
}
exports.parseName = parseName;
//# sourceMappingURL=parse-name.js.map