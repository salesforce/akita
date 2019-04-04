// @internal
export function not(pred: Function, thisArg?: any): Function {
  function notPred() {
    return !(notPred as any).pred.apply((notPred as any).thisArg, arguments);
  }

  (notPred as any).pred = pred;
  (notPred as any).thisArg = thisArg || undefined;
  return notPred;
}
