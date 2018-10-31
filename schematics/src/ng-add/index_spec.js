"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const testing_1 = require("@angular-devkit/schematics/testing");
const path = require("path");
const collectionPath = path.join(__dirname, '../collection.json');
describe('akita-ng-add', () => {
    it('works', () => {
        const runner = new testing_1.SchematicTestRunner('schematics', collectionPath);
        const tree = runner.runSchematic('akita-ng-add', {}, schematics_1.Tree.empty());
        expect(tree.files).toEqual([]);
    });
});
//# sourceMappingURL=index_spec.js.map