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
