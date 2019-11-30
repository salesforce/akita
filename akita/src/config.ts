export interface AkitaConfig {
  /**
   * Whether to allowed the reset() stores functionality
   */
  resettable?: boolean;
  ttl?: number;
}

let CONFIG: AkitaConfig = {
  resettable: false,
  ttl: null
};

export function akitaConfig(config: AkitaConfig) {
  CONFIG = { ...CONFIG, ...config };
}

// @internal
export function getAkitaConfig() {
  return CONFIG;
}
