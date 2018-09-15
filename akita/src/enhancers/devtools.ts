import { __stores__, Actions, rootDispatcher } from '../api/store';
import { __globalState } from '../internal/global-state';
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

export type NgZoneLike = { run: any };

export function akitaDevtools(ngZone: NgZoneLike, options?: Partial<DevtoolsOptions>);
export function akitaDevtools(options?: Partial<DevtoolsOptions>);
export function akitaDevtools(ngZoneOrOptions?: NgZoneLike | Partial<DevtoolsOptions>, options: Partial<DevtoolsOptions> = {}) {
  if (!(window as any).__REDUX_DEVTOOLS_EXTENSION__) {
    return;
  }

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

  rootDispatcher.subscribe(action => {
    if (action.type === Actions.NEW_STATE) {
      if (__globalState.skipAction) {
        __globalState.setSkipAction(false);
        return;
      }

      appState = {
        ...appState,
        [action.payload.name]: __stores__[action.payload.name]._value()
      };

      const { type, entityId } = __globalState.currentAction;
      const storeName = capitalize(action.payload.name);
      let msg = isDefined(entityId) ? `[${storeName}] - ${type} (ids: ${entityId})` : `[${storeName}] - ${type}`;

      if (options.logTrace) {
        console.group(msg);
        console.trace();
        console.groupEnd();
      }

      devTools.send({ type: msg, transaction: __globalState.currentT.map(t => t.type) }, appState);
    }
  });

  devTools.subscribe(message => {
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
              __stores__[storeName].setState(() => rootState[storeName], false);
            });
          }
        }
      }
    }
  });
}

function capitalize(string) {
  return string && string.charAt(0).toUpperCase() + string.slice(1);
}
