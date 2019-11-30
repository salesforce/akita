import { HttpHeaders, HttpParams } from '@angular/common/http';

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
  mapResponseFn?: (res: any) => Entity | Entity[];
};
