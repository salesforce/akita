// @internal
export function sortByOptions(options, config) {
  options.sortBy = options.sortBy || (config && config.sortBy);
  options.sortByOrder = options.sortByOrder || (config && config.sortByOrder);
}
