import { EntityService, EntityState, EntityStore, getEntityType, getIDType, isDefined } from '@datorama/akita';
import { Observable, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import {
  HttpConfig,
  HttpAddConfig,
  HttpGetConfig,
  HttpDeleteConfig,
  HttpUpdateConfig,
  NgEntityServiceParams
} from './types';
import { EntityServiceAction, HttpMethod, NgEntityServiceNotifier } from './ng-entity-service-notifier';
import { NgEntityServiceLoader } from './ng-entity-service.loader';
import {
  defaultConfig,
  mergeDeep,
  NG_ENTITY_SERVICE_CONFIG,
  NgEntityServiceGlobalConfig
} from './ng-entity-service.config';
import { isID } from './helpers';
import { errorAction, successAction } from './action-factory';

export const mapResponse = <T>(config?: HttpConfig<T>) =>
  map(res => (config && !!config.mapResponseFn ? config.mapResponseFn(res) : res));

export class NgEntityService<S extends EntityState = any> extends EntityService<S> {
  baseUrl: string | undefined;
  loader: NgEntityServiceLoader;

  private readonly http: HttpClient;
  private readonly notifier: NgEntityServiceNotifier;
  private readonly mergedConfig: NgEntityServiceParams & NgEntityServiceGlobalConfig;
  private readonly httpMethodMap:
    | Partial<{
        GET: HttpMethod;
        POST: HttpMethod;
        PATCH: HttpMethod;
        PUT: HttpMethod;
        DELETE: HttpMethod;
      }>
    | undefined;

  private readonly dispatchSuccess: (action: Partial<EntityServiceAction>) => void;
  private readonly dispatchError: (action: Partial<EntityServiceAction>) => void;

  constructor(protected readonly store: EntityStore<S>, readonly config: NgEntityServiceParams = {}) {
    super();
    this.http = inject(HttpClient);
    this.loader = inject(NgEntityServiceLoader);
    this.notifier = inject(NgEntityServiceNotifier);
    const globalConfig = inject(NG_ENTITY_SERVICE_CONFIG);
    this.mergedConfig = mergeDeep({}, defaultConfig, globalConfig, this.getDecoratorConfig(), config);
    this.baseUrl = this.mergedConfig.baseUrl;
    this.httpMethodMap = this.mergedConfig.httpMethods;

    this.dispatchSuccess = successAction(this.store.storeName, this.notifier);
    this.dispatchError = errorAction(this.store.storeName, this.notifier);
  }

  get api() {
    if (!this.baseUrl) {
      throw new Error(`baseUrl of ${this.constructor.name} is not defined.`);
    }

    return `${this.baseUrl}/${this.resourceName}`;
  }

  get resourceName() {
    return this.mergedConfig.resourceName || this.store.storeName;
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  getHttp() {
    return this.http;
  }

  getConfig() {
    return this.mergedConfig;
  }

  /**
   * Get one entity - Creates a GET request
   *
   * @example
   * service.get(id).subscribe()
   * service.get(id, { headers, params, url }).subscribe()
   */
  get<T>(id?: getIDType<S>, config?: HttpGetConfig<T>): Observable<T>;
  /**
   * Get all entities - Creates a GET request
   *
   * @example
   * service.get().subscribe()
   * service.get({ headers, params, url }).subscribe()
   */
  get<T>(config?: HttpGetConfig<T>): Observable<T>;
  get<T>(idOrConfig?: getIDType<S> | HttpGetConfig<T>, config?: HttpGetConfig<T>): Observable<T> {
    const method = this.getHttpMethod(HttpMethod.GET);
    const isSingle = isID(idOrConfig);
    const entityId = isSingle ? (idOrConfig as getIDType<S>) : undefined;
    const conf = (!isSingle ? (idOrConfig as HttpGetConfig<T>) : config) || {};
    const url = this.resolveUrl(conf, entityId);

    this.loader.dispatch({
      method,
      loading: true,
      entityId,
      storeName: this.store.storeName
    });

    return this.http.request(method, url, conf).pipe(
      mapResponse(conf),
      tap((data: any) => {
        if (!conf.skipWrite) {
          if (isSingle) {
            this.store.upsert(entityId, data);
          } else {
            if (conf.append) {
              this.store.add(data);
            } else if (conf.upsert) {
              this.store.upsertMany(data);
            } else {
              this.store.set(data);
            }
          }
        }

        this.dispatchSuccess({
          method,
          payload: data,
          successMsg: conf.successMsg
        });
      }),
      catchError(error => this.handleError(method, error, conf.errorMsg)),
      finalize(() => {
        this.loader.dispatch({
          method,
          loading: false,
          entityId,
          storeName: this.store.storeName
        });
      })
    );
  }

  /**
   * Add a new entity - Creates a POST request
   *
   * @example
   * service.add(entity).subscribe()
   * service.add(entity, config).subscribe()
   */
  add<T>(entity: getEntityType<S>, config?: HttpAddConfig<T>): Observable<T> {
    const url = this.resolveUrl(config);
    const method = this.getHttpMethod(HttpMethod.POST);

    this.loader.dispatch({
      method,
      loading: true,
      storeName: this.store.storeName
    });

    const configWithBody = { ...config, ...{ body: entity } };

    return this.http.request(method, url, configWithBody).pipe(
      mapResponse(config),
      tap((responseEntity: any) => {
        if (!config || (config && !config.skipWrite)) {
          this.store.add(responseEntity, config);
        }
        this.dispatchSuccess({
          method,
          payload: responseEntity,
          successMsg: config && config.successMsg
        });
      }),
      catchError(error => this.handleError(method, error, config && config.errorMsg)),
      finalize(() => {
        this.loader.dispatch({
          method,
          loading: false,
          storeName: this.store.storeName
        });
      })
    );
  }

  /**
   * Update an entity - Creates a PUT/PATCH request
   *
   * @example
   * service.update(id, entity).subscribe()
   * service.update(id, entity, config).subscribe()
   */
  update<T>(id: getIDType<S>, entity: Partial<getEntityType<S>>, config?: HttpUpdateConfig<T>): Observable<T> {
    const url = this.resolveUrl(config, id);
    const method = (config && config.method) || this.getHttpMethod(HttpMethod.PUT);

    this.loader.dispatch({
      method,
      loading: true,
      entityId: id,
      storeName: this.store.storeName
    });

    const configWithBody = { ...config, ...{ body: entity } };

    return this.http.request(method, url, configWithBody).pipe(
      mapResponse(config),
      tap(responseEntity => {
        if (!config || (config && !config.skipWrite)) {
          this.store.update(id, responseEntity);
        }
        this.dispatchSuccess({
          method,
          payload: responseEntity,
          successMsg: config && config.successMsg
        });
      }),
      catchError(error => this.handleError(method, error, config && config.errorMsg)),
      finalize(() => {
        this.loader.dispatch({
          method,
          loading: false,
          entityId: id,
          storeName: this.store.storeName
        });
      })
    ) as Observable<T>;
  }

  /**
   * Delete an entity - Creates a DELETE request
   *
   * @example
   * service.delete(id).subscribe()
   * service.delete(id, config).subscribe()
   */
  delete<T>(id: getIDType<S>, config?: HttpDeleteConfig<T>): Observable<T> {
    const url = this.resolveUrl(config, id);
    const method = this.getHttpMethod(HttpMethod.DELETE);

    this.loader.dispatch({
      method,
      loading: true,
      entityId: id,
      storeName: this.store.storeName
    });

    return this.http.request(method, url, config).pipe(
      mapResponse(config),
      tap(res => {
        if (!config || (config && !config.skipWrite)) {
          this.store.remove(id);
        }
        this.dispatchSuccess({
          method,
          payload: res,
          successMsg: config && config.successMsg
        });
      }),
      catchError(error => this.handleError(method, error, config && config.errorMsg)),
      finalize(() => {
        this.loader.dispatch({
          method,
          loading: false,
          entityId: id,
          storeName: this.store.storeName
        });
      })
    ) as Observable<T>;
  }

  /**
   * Gets the mapped HttpMethod.
   *
   * The default HttpMethod can be changed like so:
   * ```ts
   * {
   *   provide: NG_ENTITY_SERVICE_CONFIG,
   *   useValue: {
   *     httpMethods: {
   *       PUT: HttpMethod.PATCH,
   *     },
   *   } as NgEntityServiceGlobalConfig,
   * }
   * ```
   *
   * @param type HttpMethod to get the user configured HttpMethod for
   * @returns User configured HttpMethod for the method, else the default HttpMethod
   */
  private getHttpMethod(type: HttpMethod) {
    let httpMethod: HttpMethod;
    if (this.httpMethodMap) {
      httpMethod = this.httpMethodMap[type];
    }
    if (!httpMethod) {
      throw new Error('Unknown HttpMethod');
    }

    return httpMethod;
  }

  /**
   * Gets the value given via the NgEntityServiceConfig decorator
   *
   * ```ts
   * @NgEntityServiceConfig({
   *   baseUrl: 'foo',
   *   resourceName: 'bar',
   * })
   * ```
   *
   * @param key The property key
   * @returns The value of the given decorator key
   */
  private getDecoratorValue(key: keyof NgEntityServiceParams): string | undefined {
    return (this.constructor as any)[key];
  }

  private getDecoratorConfig() {
    const config: NgEntityServiceParams = {};

    const baseUrl = this.getDecoratorValue('baseUrl');
    if (baseUrl) {
      config.baseUrl = baseUrl;
    }

    const resourceName = this.getDecoratorValue('resourceName');
    if (resourceName) {
      config.resourceName = resourceName;
    }

    return config;
  }

  private resolveUrl(config?: HttpConfig, id?: any) {
    if (config && config.url) {
      return config.url;
    }

    return isDefined(id) ? `${this.api}/${id}` : this.api;
  }

  private handleError(method: HttpMethod, error: any, errorMsg?: string) {
    this.dispatchError({
      method,
      errorMsg,
      payload: error
    });

    return throwError(error);
  }
}
