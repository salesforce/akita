import { Actions, currentAction, setSkipAction } from './actions';
import { isDefined } from './isDefined';
import { rootDispatcher } from './rootDispatcher';
import { __stores__ } from './stores';
import { capitalize } from './captialize';

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
let rootDispatcherSub, devtoolsSub;

export type NgZoneLike = { run: any };

export function akitaDevtools(ngZone: NgZoneLike, options?: Partial<DevtoolsOptions>);
export function akitaDevtools(options?: Partial<DevtoolsOptions>);
export function akitaDevtools(ngZoneOrOptions?: NgZoneLike | Partial<DevtoolsOptions>, options: Partial<DevtoolsOptions> = {}) {
  if (!(window as any).__REDUX_DEVTOOLS_EXTENSION__) {
    return;
  }

  rootDispatcherSub && rootDispatcherSub.unsubscribe();
  devtoolsSub && devtoolsSub();

  const isAngular = ngZoneOrOptions && ngZoneOrOptions['run'];

  if (!isAngular) {
    ngZoneOrOptions = ngZoneOrOptions || {};
    (ngZoneOrOptions as any).run = cb => cb();
    options = ngZoneOrOptions as Partial<DevtoolsOptions>;
  }

  const defaultOptions: Partial<DevtoolsOptions> & { name: string } = { name: 'Akita' };
  const merged = Object.assign({}, defaultOptions, options);

  const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect(merged);
  let appState = {};

  rootDispatcherSub = rootDispatcher.subscribe(action => {
    if (action.type === Actions.DELETE_STORE) {
      const storeName = action.payload.storeName;
      delete appState[storeName];
      devTools.send({ type: `[${storeName}] - Delete Store` }, appState);
      return;
    }

    if (action.type === Actions.NEW_STATE) {
      const { type, entityIds, skip } = currentAction;

      if (skip) {
        setSkipAction(false);
        return;
      }

      const store = __stores__[action.payload.name];
      if (!store) {
        return;
      }
      appState = {
        ...appState,
        [action.payload.name]: store._value()
      };

      const storeName = capitalize(action.payload.name);
      let msg = isDefined(entityIds) ? `[${storeName}] - ${type} (ids: ${entityIds})` : `[${storeName}] - ${type}`;

      if (options.logTrace) {
        console.group(msg);
        console.trace();
        console.groupEnd();
      }

      devTools.send({ type: msg }, appState);
    }
  });

  devtoolsSub = devTools.subscribe(message => {
    if (message.type === 'ACTION') {
      const [storeName] = message.payload.split('.');

      if (__stores__[storeName]) {
        (ngZoneOrOptions as NgZoneLike).run(() => {
          const funcCall = message.payload.replace(storeName, `this['${storeName}']`);
          try {
            new Function(`${funcCall}`).call(__stores__);
          } catch (e) {
            console.warn('Unknown Method ☹️');
          }
        });
      }
    }

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
            (ngZoneOrOptions as NgZoneLike).run(() => {
              __stores__[storeName]._setState(() => rootState[storeName], false);
            });
          }
        }
      }
    }
  });
}
