import { EntityServiceAction, NgEntityServiceNotifier } from './ng-entity-service-notifier';

export function successAction(
  storeName: string,
  notifier: NgEntityServiceNotifier
): (params: Partial<EntityServiceAction>) => void {
  return function({ payload, method, successMsg }) {
    notifier.dispatch({
      type: 'success',
      storeName,
      payload,
      method,
      successMsg
    });
  };
}

export function errorAction(
  storeName: string,
  notifier: NgEntityServiceNotifier
): (params: Partial<EntityServiceAction>) => void {
  return function({ payload, method, errorMsg }) {
    notifier.dispatch({
      type: 'error',
      storeName,
      payload,
      method,
      errorMsg
    });
  };
}
