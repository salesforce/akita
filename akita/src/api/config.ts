export interface AkitaConfig {
  /**
   * Whether to allowed the reset() stores functionality
   */
  resettable?: boolean;
}

let CONFIG: AkitaConfig = {
  resettable: false
};

export function akitaConfig( config: AkitaConfig ) {
  CONFIG = { ...CONFIG, ...config };
}

export function getAkitaConfig() {
  return CONFIG;
}