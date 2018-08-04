import { __stores__, Actions, rootDispatcher } from '../api/store';
import { globalState } from '../internal/global-state';
import { isDefined } from '../internal/utils';

export type DevtoolsOptions = {
  /**  maximum allowed actions to be stored in the history tree */
  maxAge: number;
  latency: number;
  actionsBlacklist: string[];
  actionsWhitelist: string[];
  shouldCatchErrors: boolean;
  logTrace: boolean;
  predicate: (state: any, action: any) => boolean;
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
  let appState = {};

  rootDispatcher.subscribe(action => {
    if (action.type === Actions.NEW_STATE) {
      if (globalState.skipAction) {
        globalState.setSkipAction(false);
        return;
      }

      appState = {
        ...appState,
        [action.payload.name]: __stores__[action.payload.name]._value()
      };

      const { type, entityId } = globalState.currentAction;
      const storeName = capitalize(action.payload.name);
      let msg = isDefined(entityId) ? `[${storeName}] - ${type} (ids: ${entityId})` : `[${storeName}] - ${type}`;

      if (options.logTrace) {
        console.group(msg);
        console.trace();
        console.groupEnd();
      }

      devTools.send({ type: msg, transaction: globalState.currentT.map(t => t.type) }, appState);
    }
  });

  devTools.subscribe(message => {
    if (message.type === 'DISPATCH') {
      const payloadType = message.payload.type;

      if (payloadType === 'COMMIT') {
        devTools.init(appState);
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
