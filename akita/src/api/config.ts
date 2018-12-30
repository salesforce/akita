import { PreUpdate, AkitaEnhancerManager } from '../enhancers/enhancers.manager';

export interface AkitaConfig {
  /**
   * Whether to allowed the reset() stores functionality
   */
  resettable?: boolean;
  enhancers?: Array<PreUpdate<any, any>>;
}

let CONFIG: AkitaConfig = {
  resettable: false,
  enhancers: []
};

let __ENHANCER_MANAGER__: AkitaEnhancerManager = null;

export function akitaConfig(config: AkitaConfig) {
  CONFIG = { ...CONFIG, ...config };
  __ENHANCER_MANAGER__ = new AkitaEnhancerManager();
}

export function getAkitaConfig() {
  return CONFIG;
}

export function getEnhancerManager() {
  return __ENHANCER_MANAGER__;
}
