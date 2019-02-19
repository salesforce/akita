declare var WorkerGlobalScope: any;

const __window = typeof window !== 'undefined' && window;
const __self = typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope && self;
const __global = typeof global !== 'undefined' && global;
const _root: any = __window || __global || __self;

export { _root as root };
