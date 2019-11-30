import {
  AddEntitiesOptions,
  EntityService,
  EntityState,
  EntityStore,
  getEntityType,
  getIDType,
  isDefined
} from '@datorama/akita';
import { Observable, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { HttpConfig, Msg, NgEntityServiceParams } from './types';
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

export const mapResponse = (config: HttpConfig) =>
  map(res => ((config || {}).mapResponseFn ? config.mapResponseFn(res) : res));

export class NgEntityService<S extends EntityState = any> extends EntityService<S> {
  baseUrl: string;
  loader: NgEntityServiceLoader;

  private http: HttpClient;
  private notifier: NgEntityServiceNotifier;
  private globalConfig: NgEntityServiceGlobalConfig = {};
  private mergedConfig: NgEntityServiceParams & NgEntityServiceGlobalConfig;

  private dispatchSuccess: (action: Partial<EntityServiceAction>) => void;
  private dispatchError: (action: Partial<EntityServiceAction>) => void;

  constructor(protected store: EntityStore<S>, private config: NgEntityServiceParams = {}) {
    super();
    this.http = inject(HttpClient);
    this.loader = inject(NgEntityServiceLoader);
    this.notifier = inject(NgEntityServiceNotifier);
    this.globalConfig = inject(NG_ENTITY_SERVICE_CONFIG);

    this.mergedConfig = mergeDeep(defaultConfig, this.globalConfig, config);

    this.dispatchSuccess = successAction(this.store.storeName, this.notifier);
    this.dispatchError = errorAction(this.store.storeName, this.notifier);
  }

  get api() {
    return `${this.baseUrl || this.getConfigValue('baseUrl')}/${this.resourceName}`;
  }

  get resourceName() {
    return this.getConfigValue('resourceName') || this.store.storeName;
  }

  setBaseUrl(api: string) {
    this.baseUrl = api;
  }

  getHttp() {
    return this.http;
  }

  getConfig() {
    return this.mergedConfig;
  }

  /**
   *
   * Get all or one entity - Creates a GET request
   *
   * service.get().subscribe()
   * service.get({ headers, params, url })
   *
   * service.get(id)
   * service.get(id, { headers, params, url })
   *
   */
  get<T>(id?: getIDType<S>, config?: HttpConfig & { append?: boolean } & Msg): Observable<T>;
  get<T>(config?: HttpConfig & { append?: boolean } & Msg): Observable<T>;
  get<T>(
    idOrConfig?: getIDType<S> | HttpConfig,
    config?: HttpConfig & { append?: boolean; upsert?: boolean } & Msg
  ): Observable<T> {
    let url: string;
    const isSingle = isID(idOrConfig);
    const _config: HttpConfig & { append?: boolean; upsert?: boolean } & Msg = (isSingle ? config : idOrConfig) || {};
    const method = this.getHttpMethod(HttpMethod.GET);

    if (_config.url) {
      url = _config.url;
    } else {
      url = isSingle ? `${this.api}/${idOrConfig}` : this.api;
    }

    this.loader.dispatch({
      method,
      loading: true,
      entityId: isSingle ? idOrConfig : null,
      storeName: this.store.storeName
    });

    return this.http[method.toLowerCase()](url, _config).pipe(
      mapResponse(_config),
      tap((data: any) => {
        if (isSingle) {
          this.store.upsert(idOrConfig as getIDType<S>, data);
        } else {
          if (_config.append) {
            this.store.add(data);
          } else if (_config.upsert) {
            this.store.upsertMany(data);
          } else {
            this.store.set(data);
          }
        }

        this.dispatchSuccess({
          method,
          payload: data,
          successMsg: _config.successMsg
        });
      }),
      catchError(error => this.handleError(method, error, _config.errorMsg)),
      finalize(() => {
        this.loader.dispatch({
          method,
          loading: false,
          storeName: this.store.storeName
        });
      })
    ) as Observable<T>;
  }

  /**
   *
   * Add a new entity - Creates a POST request
   *
   * service.add(entity)
   * service.add(entity, config)
   *
   */
  add<T>(entity: getEntityType<S>, config?: HttpConfig & Pick<AddEntitiesOptions, 'prepend'> & Msg): Observable<T> {
    const method = this.getHttpMethod(HttpMethod.POST);

    this.loader.dispatch({
      method,
      loading: true,
      storeName: this.store.storeName
    });
    return this.http[method.toLowerCase()](this.resolveUrl(config), entity, config).pipe(
      mapResponse(config),
      tap((entity: any) => {
        this.store.add(entity, config);
        this.dispatchSuccess({
          method,
          payload: entity,
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
    ) as Observable<T>;
  }

  /**
   *
   * Update an entity - Creates a PUT/PATCH request
   *
   * service.update(id, entity)
   * service.update(id, entity, config)
   *
   */
  update<T>(
    id: getIDType<S>,
    entity: Partial<getEntityType<S>>,
    config?: HttpConfig & { method: HttpMethod.PUT | HttpMethod.PATCH } & Msg
  ): Observable<T> {
    const method = config && config.method ? config.method : this.getHttpMethod(HttpMethod.PUT);

    this.loader.dispatch({
      method,
      loading: true,
      entityId: id,
      storeName: this.store.storeName
    });

    return this.http[method.toLocaleLowerCase()](this.resolveUrl(config, id), entity, config).pipe(
      mapResponse(config),
      tap(entity => {
        this.store.update(id, entity as any);
        this.dispatchSuccess({
          method,
          payload: entity,
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
   *
   * Delete an entity - Creates a DELETE request
   *
   * service.delete(id)
   * service.delete(id, config)
   *
   */
  delete<T>(id: getIDType<S>, config?: HttpConfig & Msg): Observable<T> {
    const method = this.getHttpMethod(HttpMethod.DELETE);

    this.loader.dispatch({
      method,
      loading: true,
      entityId: id,
      storeName: this.store.storeName
    });

    return this.http[method.toLowerCase()](this.resolveUrl(config, id), config).pipe(
      mapResponse(config),
      tap(res => {
        this.store.remove(id);
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

  private getHttpMethod(type: HttpMethod) {
    return this.mergedConfig.httpMethods[type];
  }

  private getConfigValue(key: string) {
    return this.constructor[key] || this.mergedConfig[key];
  }

  private resolveUrl(config: HttpConfig, id?: any) {
    const customUrl = (config || {}).url;
    if (isDefined(id)) {
      return customUrl || `${this.api}/${id}`;
    }

    return customUrl || this.api;
  }

  private handleError(method: HttpMethod, error: any, errorMsg: string) {
    this.dispatchError({
      method,
      errorMsg,
      payload: error
    });

    return throwError(error);
  }
}
