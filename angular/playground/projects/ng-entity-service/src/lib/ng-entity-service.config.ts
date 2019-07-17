import { InjectionToken } from '@angular/core';
import { NgEntityServiceParams } from './types';

export const NG_ENTITY_SERVICE_CONFIG = new InjectionToken('NG_ENTITY_SERVICE_CONFIG', {
  providedIn: 'root',
  factory: function() {
    return {};
  }
});

export function NgEntityServiceConfig(config: NgEntityServiceParams = {}) {
  return function(constructor) {
    if (config.baseUrl) {
      constructor['baseUrl'] = config.baseUrl;
    }

    if (config.resourceName) {
      constructor['resourceName'] = config.resourceName;
    }
  };
}
