## [2.1.1](https://github.com/datorama/akita/compare/v2.1.0...v2.1.1) (2019-01-29)


### Bug Fixes

* **history-plugin:** fix the condition ([50e6979](https://github.com/datorama/akita/commit/50e6979))

# [2.1.0](https://github.com/datorama/akita/compare/v2.0.3...v2.1.0) (2019-01-29)


### Features

* **history-plugin:** allow custom comparator ([7ff2682](https://github.com/datorama/akita/commit/7ff2682))

## [2.0.3](https://github.com/datorama/akita/compare/v2.0.2...v2.0.3) (2019-01-29)


### Bug Fixes

* **store:** check that config exist ([5ed262f](https://github.com/datorama/akita/commit/5ed262f)), closes [#162](https://github.com/datorama/akita/issues/162)

## [2.0.2](https://github.com/datorama/akita/compare/v2.0.1...v2.0.2) (2019-01-28)


### Bug Fixes

* **query-entity:** selectMulti now accept projection fn ([6566aca](https://github.com/datorama/akita/commit/6566aca))

## [2.0.1](https://github.com/datorama/akita/compare/v2.0.0...v2.0.1) (2019-01-28)


### Bug Fixes

* **query-entity:** hasActive should accept id for multi ([c2604a0](https://github.com/datorama/akita/commit/c2604a0))

# [2.0.0](https://github.com/datorama/akita/compare/v1.24.3...v2.0.0) (2019-01-27)


### Code Refactoring

* **entity-dirty-check:** remove deprecated isSomeDirty ([03de8d6](https://github.com/datorama/akita/commit/03de8d6))
* **store:** remove getInitialActiveState method ([df8e2bb](https://github.com/datorama/akita/commit/df8e2bb))


### Features

* **entity-store:** add support for multi active ([12b56ea](https://github.com/datorama/akita/commit/12b56ea))
* **filternil:** strongly typed ([642993a](https://github.com/datorama/akita/commit/642993a))
* **query-entity:** add selectFirst and selectLast selectors ([a8bf3a4](https://github.com/datorama/akita/commit/a8bf3a4))
* **schematics:** update to akita v2 ([eae35a1](https://github.com/datorama/akita/commit/eae35a1))
* **typscript:** upgrade to v3.2 ([ba2bb55](https://github.com/datorama/akita/commit/ba2bb55))


### BREAKING CHANGES

* **entity-dirty-check:** remove deprecated isSomeDirty and isSomeDirty$ methods. Use someDirty and
someDirty$ instead
* **store:** The getInitialActiveState doesnt exist anymore. Add the active property when needed

## [1.24.3](https://github.com/datorama/akita/compare/v1.24.2...v1.24.3) (2019-01-23)


### Bug Fixes

* **dirty-check-plugin:** fix watch property reset and dirty state ([8388420](https://github.com/datorama/akita/commit/8388420))

## [1.24.2](https://github.com/datorama/akita/compare/v1.24.1...v1.24.2) (2019-01-18)


### Bug Fixes

* **paginator-plugin:** total should support zero ([295c0c9](https://github.com/datorama/akita/commit/295c0c9))

## [1.24.1](https://github.com/datorama/akita/compare/v1.24.0...v1.24.1) (2019-01-12)


### Bug Fixes

* **persist-state:** store keys for persistence have to match exactly ([1610394](https://github.com/datorama/akita/commit/1610394))

# [1.24.0](https://github.com/datorama/akita/compare/v1.23.4...v1.24.0) (2019-01-08)


### Features

* **store:** allow reset per store and not only global ([ede538f](https://github.com/datorama/akita/commit/ede538f))

## [1.23.4](https://github.com/datorama/akita/compare/v1.23.3...v1.23.4) (2019-01-08)


### Bug Fixes

* **entity-store:** add strict null type for set active ([fb5908f](https://github.com/datorama/akita/commit/fb5908f)), closes [#146](https://github.com/datorama/akita/issues/146)

## [1.23.3](https://github.com/datorama/akita/compare/v1.23.2...v1.23.3) (2018-12-22)


### Bug Fixes

* **query-entity:** get all should support sorting ([b9efeb7](https://github.com/datorama/akita/commit/b9efeb7))

## [1.23.2](https://github.com/datorama/akita/compare/v1.23.1...v1.23.2) (2018-12-19)


### Bug Fixes

* **persist-form-plugin:** should support form array with groups ([68d8e9a](https://github.com/datorama/akita/commit/68d8e9a))

## [1.23.1](https://github.com/datorama/akita/compare/v1.23.0...v1.23.1) (2018-12-07)


### Bug Fixes

* **devtools:** deleted stores should be reflected in devtools ([c0382f2](https://github.com/datorama/akita/commit/c0382f2)), closes [#136](https://github.com/datorama/akita/issues/136)

# [1.23.0](https://github.com/datorama/akita/compare/v1.22.1...v1.23.0) (2018-12-04)


### Features

* **store:** allow dynamic store name ([57a5577](https://github.com/datorama/akita/commit/57a5577))

## [1.22.1](https://github.com/datorama/akita/compare/v1.22.0...v1.22.1) (2018-11-26)


### Bug Fixes

* **store:** support ssr ([f871066](https://github.com/datorama/akita/commit/f871066)), closes [#131](https://github.com/datorama/akita/issues/131)

# [1.22.0](https://github.com/datorama/akita/compare/v1.21.0...v1.22.0) (2018-11-24)


### Bug Fixes

* **entity-store:** add method should not add if all entities exist ([cfebaac](https://github.com/datorama/akita/commit/cfebaac)), closes [#127](https://github.com/datorama/akita/issues/127)
* **reset-stores:** pagination and state history should clean the state ([0a6c1b3](https://github.com/datorama/akita/commit/0a6c1b3)), closes [#129](https://github.com/datorama/akita/issues/129)


### Features

* **active-entity:** add support to set the next and prev entity ([d102ef6](https://github.com/datorama/akita/commit/d102ef6))
* **query-entity:** filterby support array of functions ([4f8f9cd](https://github.com/datorama/akita/commit/4f8f9cd))

# [1.21.0](https://github.com/datorama/akita/compare/v1.20.0...v1.21.0) (2018-11-18)


### Features

* **query-entity:** provide index in filter function ([#118](https://github.com/datorama/akita/issues/118)) ([b12f451](https://github.com/datorama/akita/commit/b12f451))

# [1.20.0](https://github.com/datorama/akita/compare/v1.19.1...v1.20.0) (2018-11-17)


### Features

* **entity-store:** add upsert method ([659b4d1](https://github.com/datorama/akita/commit/659b4d1))

## [1.19.1](https://github.com/datorama/akita/compare/v1.19.0...v1.19.1) (2018-11-14)


### Bug Fixes

* **hmr:** add support for hmr ([180c8c3](https://github.com/datorama/akita/commit/180c8c3)), closes [#108](https://github.com/datorama/akita/issues/108)
* **store:** make ngOnDestroy method public ([de24ad3](https://github.com/datorama/akita/commit/de24ad3))

# [1.19.0](https://github.com/datorama/akita/compare/v1.18.0...v1.19.0) (2018-11-11)


### Features

* **active-entity:** add the ability to explicitly set the active type ([1a6365d](https://github.com/datorama/akita/commit/1a6365d)), closes [#112](https://github.com/datorama/akita/issues/112)

# [1.18.0](https://github.com/datorama/akita/compare/v1.17.0...v1.18.0) (2018-11-10)


### Features

* **schematics:** add prompts ([99be7ab](https://github.com/datorama/akita/commit/99be7ab))

# [1.17.0](https://github.com/datorama/akita/compare/v1.16.0...v1.17.0) (2018-11-04)


### Features

* **akita:** fixed global action name, removed unused imports ([8a11ed1](https://github.com/datorama/akita/commit/8a11ed1))
* **akita:** reset single store, resetStore reset all stores ([0175cef](https://github.com/datorama/akita/commit/0175cef))
* **akita:** resetStores func ([43601af](https://github.com/datorama/akita/commit/43601af))
* **akita:** resetStores func ([cec89c9](https://github.com/datorama/akita/commit/cec89c9))
* **akita:** resetStores func ([df5e39d](https://github.com/datorama/akita/commit/df5e39d))

# [1.16.0](https://github.com/datorama/akita/compare/v1.15.1...v1.16.0) (2018-11-04)


### Bug Fixes

* **dirty-check:** remove type ([ca9e3d3](https://github.com/datorama/akita/commit/ca9e3d3))


### Features

* **dirty-check:** add the ability to subscribe to reset event ([9266b0e](https://github.com/datorama/akita/commit/9266b0e))

## [1.15.1](https://github.com/datorama/akita/compare/v1.15.0...v1.15.1) (2018-11-03)


### Bug Fixes

* **schematics:** upgrade libs version ([70468b0](https://github.com/datorama/akita/commit/70468b0))

# [1.15.0](https://github.com/datorama/akita/compare/v1.14.0...v1.15.0) (2018-11-03)


### Features

* **akita:** upgrade to ng7 and ts3 ([17a7a95](https://github.com/datorama/akita/commit/17a7a95))

# [1.14.0](https://github.com/datorama/akita/compare/v1.13.1...v1.14.0) (2018-10-31)


### Bug Fixes

* **entity store:** change type and update test for add option ([5ef1776](https://github.com/datorama/akita/commit/5ef1776))
* **entity store:** change type of AddParams and add default value ([1b2eeba](https://github.com/datorama/akita/commit/1b2eeba))
* **entity store:** fix test issue ([736a53f](https://github.com/datorama/akita/commit/736a53f))
* **entity store:** update test and default case for prepend add ([4d9d91f](https://github.com/datorama/akita/commit/4d9d91f))
* **entity store:** update test for prepend add ([07822ae](https://github.com/datorama/akita/commit/07822ae))


### Features

* **entity store:** allow prepend option when adding ([2c4708d](https://github.com/datorama/akita/commit/2c4708d))
* **entity store:** rename prepend params to options ([6da7837](https://github.com/datorama/akita/commit/6da7837))

## [1.13.1](https://github.com/datorama/akita/compare/v1.13.0...v1.13.1) (2018-10-31)


### Bug Fixes

* **query-entity:** sortby should work with getall ([75ed1b7](https://github.com/datorama/akita/commit/75ed1b7)), closes [#102](https://github.com/datorama/akita/issues/102)

# [1.13.0](https://github.com/datorama/akita/compare/v1.12.5...v1.13.0) (2018-10-30)


### Features

* **entity-query:** hasEntity can take an array of ids ([7404dc5](https://github.com/datorama/akita/commit/7404dc5))

## [1.12.5](https://github.com/datorama/akita/compare/v1.12.4...v1.12.5) (2018-10-29)


### Bug Fixes

* **crud-update:** use new state constructor instead of the old state ([f8ae5a1](https://github.com/datorama/akita/commit/f8ae5a1))

## [1.12.4](https://github.com/datorama/akita/compare/v1.12.3...v1.12.4) (2018-10-29)


### Bug Fixes

* **crud-update:** use new state constructor instead of the old state ([0bc3104](https://github.com/datorama/akita/commit/0bc3104))
* **crud-update:** use new state constructor instead of the old state ([e177ed6](https://github.com/datorama/akita/commit/e177ed6))

## [1.12.3](https://github.com/datorama/akita/compare/v1.12.2...v1.12.3) (2018-10-24)


### Bug Fixes

* **store:** use IE11 strict mode compatible deep-freeze ([8a63065](https://github.com/datorama/akita/commit/8a63065)), closes [#94](https://github.com/datorama/akita/issues/94)

## [1.12.2](https://github.com/datorama/akita/compare/v1.12.1...v1.12.2) (2018-10-16)


### Bug Fixes

* **query-entity:** has active should return false when value is undefined ([ba56933](https://github.com/datorama/akita/commit/ba56933)), closes [#92](https://github.com/datorama/akita/issues/92)

## [1.12.1](https://github.com/datorama/akita/compare/v1.12.0...v1.12.1) (2018-10-15)


### Bug Fixes

* **ng-add:** fix router imports ([5975689](https://github.com/datorama/akita/commit/5975689))

# [1.12.0](https://github.com/datorama/akita/compare/v1.11.0...v1.12.0) (2018-10-15)


### Features

* **schematics:** add ng add command ([2703a00](https://github.com/datorama/akita/commit/2703a00))

# [1.11.0](https://github.com/datorama/akita/compare/v1.10.0...v1.11.0) (2018-10-08)


### Features

* **history plugin:** add public api for ignoreNext ([f221bb9](https://github.com/datorama/akita/commit/f221bb9))

# [1.10.0](https://github.com/datorama/akita/compare/v1.9.6...v1.10.0) (2018-10-07)


### Bug Fixes

* **active:** enable unset of active entity in strict null check envs ([79a9c69](https://github.com/datorama/akita/commit/79a9c69))


### Features

* **active:** add hasActive method for EntityQuery ([d333aac](https://github.com/datorama/akita/commit/d333aac))

## [1.9.6](https://github.com/datorama/akita/compare/v1.9.5...v1.9.6) (2018-09-25)


### Bug Fixes

* **store:** add destroy method for non-angular apps ([9f96fb0](https://github.com/datorama/akita/commit/9f96fb0))

## [1.9.5](https://github.com/datorama/akita/compare/v1.9.4...v1.9.5) (2018-09-24)


### Bug Fixes

* **store:** change overloading order in update method ([c6d98a1](https://github.com/datorama/akita/commit/c6d98a1))

## [1.9.4](https://github.com/datorama/akita/compare/v1.9.3...v1.9.4) (2018-09-22)


### Bug Fixes

* **persist-form:** should support root keys and root array value ([4103d2c](https://github.com/datorama/akita/commit/4103d2c))

## [1.9.3](https://github.com/datorama/akita/compare/v1.9.2...v1.9.3) (2018-09-20)


### Bug Fixes

* **dirty-check-entity:** fix typo deprecate issomedirty and use somedirty ([16f1a67](https://github.com/datorama/akita/commit/16f1a67))

## [1.9.2](https://github.com/datorama/akita/compare/v1.9.1...v1.9.2) (2018-09-19)


### Bug Fixes

* **query:** select method signature missing Observable return type ([3b038b3](https://github.com/datorama/akita/commit/3b038b3))

## [1.9.1](https://github.com/datorama/akita/compare/v1.9.0...v1.9.1) (2018-09-15)


### Bug Fixes

* **devtools:** remove angular coupling ([df73a83](https://github.com/datorama/akita/commit/df73a83))

# [1.9.0](https://github.com/datorama/akita/compare/v1.8.4...v1.9.0) (2018-09-14)


### Bug Fixes

* **select:** call select without a callback ([b6bfbc2](https://github.com/datorama/akita/commit/b6bfbc2))
* **ts:** fix types in query ([aaddc95](https://github.com/datorama/akita/commit/aaddc95))


### Features

* **sort:** allow use of state in sort fn ([7ba1795](https://github.com/datorama/akita/commit/7ba1795))

## [1.8.4](https://github.com/datorama/akita/compare/v1.8.3...v1.8.4) (2018-09-12)


### Bug Fixes

* **persist-state:** persist state should mark the store as dirty ([0fb427b](https://github.com/datorama/akita/commit/0fb427b)), closes [#79](https://github.com/datorama/akita/issues/79)

## [1.8.3](https://github.com/datorama/akita/compare/v1.8.2...v1.8.3) (2018-09-08)


### Bug Fixes

* **store:** return support for non singletons providers ([d1b6810](https://github.com/datorama/akita/commit/d1b6810))

## [1.8.2](https://github.com/datorama/akita/compare/v1.8.1...v1.8.2) (2018-09-05)


### Bug Fixes

* **entity-state:** allow error generic in entity state ([8293f16](https://github.com/datorama/akita/commit/8293f16)), closes [#66](https://github.com/datorama/akita/issues/66)

## [1.8.1](https://github.com/datorama/akita/compare/v1.8.0...v1.8.1) (2018-09-04)


### Bug Fixes

* **devtools:** change console error to console warn ([55b4525](https://github.com/datorama/akita/commit/55b4525)), closes [#64](https://github.com/datorama/akita/issues/64)

# [1.8.0](https://github.com/datorama/akita/compare/v1.7.2...v1.8.0) (2018-09-02)


### Features

* **store:** support loading and error state in base store ([bd811e0](https://github.com/datorama/akita/commit/bd811e0)), closes [#61](https://github.com/datorama/akita/issues/61)

## [1.7.2](https://github.com/datorama/akita/compare/v1.7.1...v1.7.2) (2018-08-28)


### Bug Fixes

* **update:** the update() of basic store can take a function and return partial state ([50d2040](https://github.com/datorama/akita/commit/50d2040))

## [1.7.1](https://github.com/datorama/akita/compare/v1.7.0...v1.7.1) (2018-08-28)


### Bug Fixes

* **persist-state:** support ssr ([4d2e5a7](https://github.com/datorama/akita/commit/4d2e5a7))

# [1.7.0](https://github.com/datorama/akita/compare/v1.6.2...v1.7.0) (2018-08-27)


### Bug Fixes

* **state-history:** present should take the entity state on init ([1aa30d2](https://github.com/datorama/akita/commit/1aa30d2))


### Features

* **persist-form:** add the ability to sync a specific store key ([01dbfb8](https://github.com/datorama/akita/commit/01dbfb8))
* **persist-state:** check localstorage support for ssr ([5e02410](https://github.com/datorama/akita/commit/5e02410)), closes [#58](https://github.com/datorama/akita/issues/58)
* **persist-state:** include now can accept nested key ([d2dabb4](https://github.com/datorama/akita/commit/d2dabb4)), closes [#59](https://github.com/datorama/akita/issues/59)

## [1.6.2](https://github.com/datorama/akita/compare/v1.6.1...v1.6.2) (2018-08-22)


### Bug Fixes

* **store:** warn when storeconfig is missing ([68c00e9](https://github.com/datorama/akita/commit/68c00e9)), closes [#56](https://github.com/datorama/akita/issues/56)
* **update:** allow EntityStore updating entity id ([fbdb100](https://github.com/datorama/akita/commit/fbdb100)), closes [#52](https://github.com/datorama/akita/issues/52)
* **update:** assure order of ids is the same ([1a32b8b](https://github.com/datorama/akita/commit/1a32b8b))
* **update:** tighten up check for id field change ([f65e50a](https://github.com/datorama/akita/commit/f65e50a))

## [1.6.1](https://github.com/datorama/akita/compare/v1.6.0...v1.6.1) (2018-08-21)


### Bug Fixes

* **dirty-check:** types ([8174fe0](https://github.com/datorama/akita/commit/8174fe0))

# [1.6.0](https://github.com/datorama/akita/compare/v1.5.0...v1.6.0) (2018-08-21)


### Features

* **dirty-check:** add support for key based check ([ee52619](https://github.com/datorama/akita/commit/ee52619))

# [1.5.0](https://github.com/datorama/akita/compare/v1.4.1...v1.5.0) (2018-08-16)


### Features

* **store-utils:** add guid method ([706e141](https://github.com/datorama/akita/commit/706e141))
* **store-utils:** add increment and decrement helpers ([7741493](https://github.com/datorama/akita/commit/7741493))

## [1.4.1](https://github.com/datorama/akita/compare/v1.4.0...v1.4.1) (2018-08-14)


### Bug Fixes

* **entity-dirty-check:** Add boolean isSomeDirty ([f3c334e](https://github.com/datorama/akita/commit/f3c334e))

# [1.4.0](https://github.com/datorama/akita/compare/v1.3.8...v1.4.0) (2018-08-09)


### Features

* cache the entity lookup ([8b7e8c8](https://github.com/datorama/akita/commit/8b7e8c8))
* do not update store if no ids found ([c41ca5e](https://github.com/datorama/akita/commit/c41ca5e))
* EntityStore.update/remove should accept predicate for ids ([3beb560](https://github.com/datorama/akita/commit/3beb560))

## [1.3.8](https://github.com/datorama/akita/compare/v1.3.7...v1.3.8) (2018-08-06)


### Bug Fixes

* **query:** selectAll support combined options ([04f268f](https://github.com/datorama/akita/commit/04f268f)), closes [#25](https://github.com/datorama/akita/issues/25)

## [1.3.7](https://github.com/datorama/akita/compare/v1.3.6...v1.3.7) (2018-08-04)


### Bug Fixes

* **devtools:** improve devtools experience ([8293e72](https://github.com/datorama/akita/commit/8293e72))

## [1.3.6](https://github.com/datorama/akita/compare/v1.3.5...v1.3.6) (2018-08-01)


### Bug Fixes

* **active:** reset the active when the entity does not exist ([2e1b043](https://github.com/datorama/akita/commit/2e1b043))
* **arrays:** fix array type in update function ([611dcab](https://github.com/datorama/akita/commit/611dcab))

## [1.3.5](https://github.com/datorama/akita/compare/v1.3.4...v1.3.5) (2018-07-30)


### Bug Fixes

* **query:** avoid memoization when we have sort by option ([8e41ccc](https://github.com/datorama/akita/commit/8e41ccc))
* **query:** select all should not memoize when passing sort by ([0e83ed0](https://github.com/datorama/akita/commit/0e83ed0))

## [1.3.4](https://github.com/datorama/akita/compare/v1.3.3...v1.3.4) (2018-07-30)


### Bug Fixes

* **build:** add rxjs import ([0d77cd2](https://github.com/datorama/akita/commit/0d77cd2))
* **entity-dirty-check-plugin:** change signature of isDirty ([43e3050](https://github.com/datorama/akita/commit/43e3050))

## [1.3.3](https://github.com/datorama/akita/compare/v1.3.2...v1.3.3) (2018-07-29)


### Bug Fixes

* **dirty-check-plugin:** add public api for isDirty() and hasHead() ([2ce7084](https://github.com/datorama/akita/commit/2ce7084))

## [1.3.2](https://github.com/datorama/akita/compare/v1.3.1...v1.3.2) (2018-07-28)


### Bug Fixes

* **devtools:** custom action should override transaction action ([0ac3493](https://github.com/datorama/akita/commit/0ac3493)), closes [#22](https://github.com/datorama/akita/issues/22)
* **query:** selectAll should respect limitTo with filterBy ([4343464](https://github.com/datorama/akita/commit/4343464)), closes [#25](https://github.com/datorama/akita/issues/25)
* **sort:** export sorting enum ([36fe775](https://github.com/datorama/akita/commit/36fe775)), closes [#24](https://github.com/datorama/akita/issues/24)
* **typescript:** support ts v2.9 ([51e9b0d](https://github.com/datorama/akita/commit/51e9b0d)), closes [#26](https://github.com/datorama/akita/issues/26)

## [1.3.1](https://github.com/datorama/akita/compare/v1.3.0...v1.3.1) (2018-07-22)


### Bug Fixes

* **dirty-check-plugin:** add type remove unnecessary code ([5a8ec9b](https://github.com/datorama/akita/commit/5a8ec9b))
* **persist-state:** dont call lc on include and exclude ([5e38360](https://github.com/datorama/akita/commit/5e38360))

# [1.3.0](https://github.com/datorama/akita/compare/v1.2.4...v1.3.0) (2018-07-22)


### Bug Fixes

* **devtools:** set action only on dev mode ([0461d44](https://github.com/datorama/akita/commit/0461d44))


### Features

* **dirty-check-plugin:** add isSomeDirty to EntityDirtyCheckPlugin ([2afa7d6](https://github.com/datorama/akita/commit/2afa7d6))
* **state-history:** add ignore update functionality ([42d574d](https://github.com/datorama/akita/commit/42d574d))

## [1.2.4](https://github.com/datorama/akita/compare/v1.2.3...v1.2.4) (2018-07-19)


### Bug Fixes

* **build:** types should work with ts strict option ([a5a2d45](https://github.com/datorama/akita/commit/a5a2d45)), closes [#18](https://github.com/datorama/akita/issues/18)

## [1.2.3](https://github.com/datorama/akita/compare/v1.2.2...v1.2.3) (2018-07-18)


### Bug Fixes

* **persist-form:** doesn't set state properly for multiple forms ([52afde9](https://github.com/datorama/akita/commit/52afde9))

## [1.2.2](https://github.com/datorama/akita/compare/v1.2.1...v1.2.2) (2018-07-17)


### Bug Fixes

* **persist-state:** don't override the state on refresh ([c17db0f](https://github.com/datorama/akita/commit/c17db0f)), closes [#15](https://github.com/datorama/akita/issues/15)

## [1.2.1](https://github.com/datorama/akita/compare/v1.2.0...v1.2.1) (2018-07-17)


### Bug Fixes

* **entity-state-history:** fix type ([adcf43a](https://github.com/datorama/akita/commit/adcf43a)), closes [#12](https://github.com/datorama/akita/issues/12)

# [1.2.0](https://github.com/datorama/akita/compare/v1.1.3...v1.2.0) (2018-07-17)


### Features

* **devtools:** allow more options ([a1e4697](https://github.com/datorama/akita/commit/a1e4697))
* **devtools:** redux dev-tools integration ([72ae1e6](https://github.com/datorama/akita/commit/72ae1e6))
* **operators:** add skipNil operator ([1c127fe](https://github.com/datorama/akita/commit/1c127fe))
* **plugins:** add state history api ([df3778b](https://github.com/datorama/akita/commit/df3778b))
* **plugins:** persist form state ([355dc33](https://github.com/datorama/akita/commit/355dc33))
* **state-history:** add support for entity ([9a1cdec](https://github.com/datorama/akita/commit/9a1cdec))
* **state-history:** add support for entity based history ([c9e7cc9](https://github.com/datorama/akita/commit/c9e7cc9))
* **store:** set() supports for passing the complete object ([3675d20](https://github.com/datorama/akita/commit/3675d20))

## [1.1.3](https://github.com/datorama/akita/compare/v1.1.2...v1.1.3) (2018-07-09)


### Bug Fixes

* **entity-store:** allow passing empty array to add ([ef96296](https://github.com/datorama/akita/commit/ef96296))

## [1.1.2](https://github.com/datorama/akita/compare/v1.1.1...v1.1.2) (2018-07-09)


### Bug Fixes

* **crud:** set now can accept the complete state object ([a2c93c6](https://github.com/datorama/akita/commit/a2c93c6))

## [1.1.1](https://github.com/datorama/akita/compare/v1.1.0...v1.1.1) (2018-07-01)


### Bug Fixes

* **entity-store:** allow zero as id ([880f688](https://github.com/datorama/akita/commit/880f688))

# [1.1.0](https://github.com/datorama/akita/compare/v1.0.1...v1.1.0) (2018-06-26)


### Features

* **pagination:** add support for server side pagination ([8b1a8fa](https://github.com/datorama/akita/commit/8b1a8fa))
* **pagination:** add support for server side pagination ([549fce6](https://github.com/datorama/akita/commit/549fce6))
* **plugins:** add persist storage plugin ([c4b56d0](https://github.com/datorama/akita/commit/c4b56d0))
* **query:** add sort by option per query or per selectAll ([7eccf94](https://github.com/datorama/akita/commit/7eccf94))
* **snapshot:** add support for getting and setting the snapshot ([bd83a2b](https://github.com/datorama/akita/commit/bd83a2b))

## [1.0.1](https://github.com/datorama/akita/compare/v1.0.0...v1.0.1) (2018-06-18)


### Bug Fixes

* **query:** don't throw when active is null ([f66a15d](https://github.com/datorama/akita/commit/f66a15d))

# 1.0.0 (2018-06-12)


### Features

* **lib:** initial commit ([af4b409](https://github.com/datorama/akita/commit/af4b409))
