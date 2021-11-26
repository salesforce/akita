import { InjectionToken } from '@angular/core';
import { isObject } from '@datorama/akita';
import { HttpMethod } from './ng-entity-service-notifier';
import { NgEntityServiceParams } from './types';

export interface NgEntityServiceGlobalConfig {
  baseUrl?: string;
  httpMethods?: Partial<{
    GET: HttpMethod;
    POST: HttpMethod;
    PATCH: HttpMethod;
    PUT: HttpMethod;
    DELETE: HttpMethod;
  }>;
}

export const NG_ENTITY_SERVICE_CONFIG = new InjectionToken<NgEntityServiceGlobalConfig>('NgEntityServiceGlobalConfig');

export const defaultConfig: NgEntityServiceGlobalConfig = {
  httpMethods: {
    GET: HttpMethod.GET,
    POST: HttpMethod.POST,
    PATCH: HttpMethod.PATCH,
    PUT: HttpMethod.PUT,
    DELETE: HttpMethod.DELETE,
  },
};

export function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

export function NgEntityServiceConfig(config: NgEntityServiceParams = {}) {
  return function (constructor) {
    if (config.baseUrl) {
      constructor['baseUrl'] = config.baseUrl;
    }

    if (config.resourceName) {
      constructor['resourceName'] = config.resourceName;
    }
  };
}
