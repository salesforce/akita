import { HttpHeaders, HttpParams } from '@angular/common/http';
import { AddEntitiesOptions } from '@datorama/akita';
import { Observable } from 'rxjs';
import { HttpMethod } from './ng-entity-service-notifier';

export interface NgEntityServiceParams {
  baseUrl?: string;
  resourceName?: string;
}

type _HttpHeaders =
  | HttpHeaders
  | {
      [header: string]: string | string[];
    };

type _HttpParams =
  | HttpParams
  | {
      [param: string]: string | string[];
    };

export type Msg = {
  successMsg?: string;
  errorMsg?: string;
};

export type HttpConfig<Entity = any> = {
  params?: _HttpParams;
  headers?: _HttpHeaders;
  url?: string;
  urlPostfix?: string;
  mapResponseFn?: (res: any) => Entity | Entity[] | Observable<Entity | Entity[]>;
};

interface StoreWrite {
  /**
   * Disables writing to the store
   *
   * You then have to manually write to the store.
   * This is useful when pairing the NgEntityService with the PaginatorPlugin
   */
  skipWrite?: boolean;
}

export type HttpGetConfig<Entity = any> = HttpConfig<Entity> & {
  append?: boolean; // TODO fix type these are mutually exclusive
  upsert?: boolean;
} & StoreWrite &
  Msg;

export type HttpAddConfig<Entity = any> = HttpConfig<Entity> & Pick<AddEntitiesOptions, 'prepend'> & StoreWrite & Msg;

export type HttpUpdateConfig<Entity = any> = HttpConfig<Entity> & {
  method?: HttpMethod.PUT | HttpMethod.PATCH;
} & StoreWrite &
  Msg;

export type HttpDeleteConfig<Entity = any> = HttpConfig<Entity> & StoreWrite & Msg;
