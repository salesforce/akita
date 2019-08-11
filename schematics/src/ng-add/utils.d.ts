import * as ts from 'typescript';
import { Tree } from '@angular-devkit/schematics';
export interface Host {
    write(path: string, content: string): Promise<void>;
    read(path: string): Promise<string>;
}
export interface Change {
    apply(host: Host): Promise<void>;
    readonly path: string | null;
    readonly order: number;
    readonly description: string;
}
/**
 * An operation that does nothing.
 */
export declare class NoopChange implements Change {
    description: string;
    order: number;
    path: any;
    apply(): Promise<void>;
}
/**
 * Will add text to the source code.
 */
export declare class InsertChange implements Change {
    path: string;
    pos: number;
    toAdd: string;
    order: number;
    description: string;
    constructor(path: string, pos: number, toAdd: string);
    /**
     * This method does not insert spaces if there is none in the original string.
     */
    apply(host: Host): Promise<void>;
}
/**
 * Will remove text from the source code.
 */
export declare class RemoveChange implements Change {
    path: string;
    private pos;
    private toRemove;
    order: number;
    description: string;
    constructor(path: string, pos: number, toRemove: string);
    apply(host: Host): Promise<void>;
}
/**
 * Will replace text from the source code.
 */
export declare class ReplaceChange implements Change {
    path: string;
    private pos;
    private oldText;
    private newText;
    order: number;
    description: string;
    constructor(path: string, pos: number, oldText: string, newText: string);
    apply(host: Host): Promise<void>;
}
export declare function insertImport(source: ts.SourceFile, fileToEdit: string, symbolName: string, fileName: string, isDefault?: boolean): Change | NoopChange;
/**
 * Find all nodes from the AST in the subtree of node of SyntaxKind kind.
 * @param node
 * @param kind
 * @param max The maximum number of items to return.
 * @return all nodes of kind, or [] if none is found
 */
export declare function findNodes(node: ts.Node, kind: ts.SyntaxKind, max?: number): ts.Node[];
/**
 * Get all the nodes from a source.
 * @param sourceFile The source file object.
 * @returns {Observable<ts.Node>} An observable of all the nodes in the source.
 */
export declare function getSourceNodes(sourceFile: ts.SourceFile): ts.Node[];
export declare function findNode(node: ts.Node, kind: ts.SyntaxKind, text: string): ts.Node | null;
/**
 * Insert `toInsert` after the last occurence of `ts.SyntaxKind[nodes[i].kind]`
 * or after the last of occurence of `syntaxKind` if the last occurence is a sub child
 * of ts.SyntaxKind[nodes[i].kind] and save the changes in file.
 *
 * @param nodes insert after the last occurence of nodes
 * @param toInsert string to insert
 * @param file file to insert changes into
 * @param fallbackPos position to insert if toInsert happens to be the first occurence
 * @param syntaxKind the ts.SyntaxKind of the subchildren to insert after
 * @return Change instance
 * @throw Error if toInsert is first occurence but fall back is not set
 */
export declare function insertAfterLastOccurrence(nodes: ts.Node[], toInsert: string, file: string, fallbackPos: number, syntaxKind?: ts.SyntaxKind): Change;
export declare function getContentOfKeyLiteral(_source: ts.SourceFile, node: ts.Node): string | null;
export declare function getDecoratorMetadata(source: ts.SourceFile, identifier: string, module: string): ts.Node[];
/**
 * Given a source file with @NgModule class(es), find the name of the first @NgModule class.
 *
 * @param source source file containing one or more @NgModule
 * @returns the name of the first @NgModule, or `undefined` if none is found
 */
export declare function getFirstNgModuleName(source: ts.SourceFile): string | undefined;
export declare function addSymbolToNgModuleMetadata(source: ts.SourceFile, ngModulePath: string, metadataField: string, symbolName: string, importPath?: string | null, skipImport?: boolean): Change[];
/**
 * Custom function to insert a declaration (component, pipe, directive)
 * into NgModule declarations. It also imports the component.
 */
export declare function addDeclarationToModule(source: ts.SourceFile, modulePath: string, classifiedName: string, importPath: string): Change[];
/**
 * Custom function to insert an NgModule into NgModule imports. It also imports the module.
 */
export declare function addImportToModule(source: ts.SourceFile, modulePath: string, classifiedName: string, importPath: string): Change[];
/**
 * Custom function to insert a provider into NgModule. It also imports it.
 */
export declare function addProviderToModule(source: ts.SourceFile, modulePath: string, classifiedName: string, importPath: string): Change[];
/**
 * Custom function to insert an export into NgModule. It also imports it.
 */
export declare function addExportToModule(source: ts.SourceFile, modulePath: string, classifiedName: string, importPath: string): Change[];
/**
 * Custom function to insert an export into NgModule. It also imports it.
 */
export declare function addBootstrapToModule(source: ts.SourceFile, modulePath: string, classifiedName: string, importPath: string): Change[];
/**
 * Custom function to insert an entryComponent into NgModule. It also imports it.
 */
export declare function addEntryComponentToModule(source: ts.SourceFile, modulePath: string, classifiedName: string, importPath: string): Change[];
/**
 * Determine if an import already exists.
 */
export declare function isImported(source: ts.SourceFile, classifiedName: string, importPath: string): boolean;
export declare function getModuleFile(host: Tree, modulePath: any): ts.SourceFile;
export declare function applyChanges(host: Tree, path: string, changes: InsertChange[]): Tree;
