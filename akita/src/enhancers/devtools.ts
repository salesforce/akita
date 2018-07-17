import { __rootDispatcher__, __stores__, Store } from '../api/store';
import { globalState } from '../internal/global-state';
import { isDefined, isString } from '../internal/utils';

export type DevtoolsOptions = {
  /**  maximum allowed actions to be stored in the history tree */
  maxAge: number;
  latency: number;
  actionsBlacklist: string[];
  actionsWhitelist: string[];
  shouldCatchErrors: boolean;
  logTrace: boolean;
  predicate: (state, action) => boolean;
};

export function akitaDevtools(ngZone, options: Partial<DevtoolsOptions> = {}) {
  if (!(window as any).__REDUX_DEVTOOLS_EXTENSION__) {
    console.error(`Can't find the Redux dev-tools extension`);
    return;
  }

  const defaultOptions: Partial<DevtoolsOptions> & { name: string } = { name: 'Akita' };
  if (options.maxAge) defaultOptions.maxAge = options.maxAge;
  if (options.maxAge) defaultOptions.latency = options.latency;
  if (options.actionsBlacklist) defaultOptions.actionsBlacklist = options.actionsBlacklist;
  if (options.actionsWhitelist) defaultOptions.actionsWhitelist = options.actionsWhitelist;
  if (options.shouldCatchErrors) defaultOptions.shouldCatchErrors = options.shouldCatchErrors;
  if (options.predicate) defaultOptions.predicate = options.predicate;

  const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect(defaultOptions);

  __rootDispatcher__.subscribe(state => {
    if (globalState.skipAction()) {
      globalState.setSkipAction(false);
      return;
    }
    let acc = {};
    for (let i = 0, keys = Object.keys(__stores__); i < keys.length; i++) {
      const storeName = keys[i];
      acc[storeName] = __stores__[storeName]._value();
    }

    const { type, entityId } = globalState.getAction();

    const storeName = capitalize(isString(state) ? state : (state as Store<any>).storeName);
    let msg;
    msg = isDefined(entityId) ? `${storeName} - ${type} (ids: ${entityId})` : `${storeName} - ${type}`;

    if (options.logTrace) {
      console.group(msg);
      console.trace();
      console.groupEnd();
    }

    devTools.send({ type: msg }, acc);
  });

  devTools.subscribe(message => {
    if (message.type === 'DISPATCH') {
      const payloadType = message.payload.type;

      if (payloadType === 'COMMIT') {
        let acc = {};
        for (let i = 0, keys = Object.keys(__stores__); i < keys.length; i++) {
          const storeName = keys[i];
          acc[storeName] = __stores__[storeName]._value();
        }
        devTools.init(acc);
        return;
      }

      if (message.state) {
        const rootState = JSON.parse(message.state);
        for (let i = 0, keys = Object.keys(rootState); i < keys.length; i++) {
          const storeName = keys[i];
          if (__stores__[storeName]) {
            ngZone.run(() => {
              __stores__[storeName].setState(() => rootState[storeName], false);
            });
          }
        }
      }
    }
  });
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
