export interface AkitaConfig {
  /**
   * Whether to allowed the reset() stores functionality
   */
  resettable?: boolean;
  ttl?: number;
  producerFn?: (state: any, fn: any) => any;
}

let CONFIG: AkitaConfig = {
  resettable: false,
  ttl: null,
  producerFn: undefined
};

export function akitaConfig(config: AkitaConfig) {
  CONFIG = { ...CONFIG, ...config };
}

// @internal
export function getAkitaConfig() {
  return CONFIG;
}

export function getGlobalProducerFn() {
  return CONFIG.producerFn;
}
