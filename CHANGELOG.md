# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.1.0](https://github.com/datorama/akita/compare/v0.0.1...v0.1.0) (2020-06-18)

### ⚠ BREAKING CHANGES

- **action:** Remove deprecated exclude option from persist state
- **action:** Remove deprecated array utils functions

### Features

- **action:** remove deprecated array utils functions ([44d99c9](https://github.com/datorama/akita/commit/44d99c9c8a1833cf46fa1fc79725d8cf37dba985))
- **action:** remove deprecated exclude option from persist state ([5ca933a](https://github.com/datorama/akita/commit/5ca933ae8db2b1b6f57dcba37609fc9fb365809f))
- **persist-state:** add ability to select store data to persist ([#437](https://github.com/datorama/akita/issues/437)) ([3f4e5ae](https://github.com/datorama/akita/commit/3f4e5ae87c9a9bca46b5b41f8db6cd57390e77bb))

### Bug Fixes

- fix peer deps ([7632dd6](https://github.com/datorama/akita/commit/7632dd6d64959c55ef593728ee013e683de85cd6))
- fix peer deps ([53d7db4](https://github.com/datorama/akita/commit/53d7db4c862490276efdbf920bfac79f5c33cbbe))
- remove peer deps ([b5b11f9](https://github.com/datorama/akita/commit/b5b11f94ed7ba506ff30e18da9f3778eb52dc14e))
- router store peer deps ([5e71c3c](https://github.com/datorama/akita/commit/5e71c3cc90792e5121a09322909d66a25f029d8a))
- **build:** update nx to 9.4.0 ([#447](https://github.com/datorama/akita/issues/447)) ([e75ef62](https://github.com/datorama/akita/commit/e75ef62844b1f84a69e2c8931590a12f188529cf))
- **devtools:** fix multiple logging of same actions ([#441](https://github.com/datorama/akita/issues/441)) ([7992435](https://github.com/datorama/akita/commit/7992435f294d27ec7ba3963485d6e3d15d1e6067))
- **entity-store:** change set cache location ([d318901](https://github.com/datorama/akita/commit/d318901bdc89c19eaba8ec1db3de438e4e6b4ec4))
- **entity-store:** improve type safety of entity store upsert operations ([#439](https://github.com/datorama/akita/issues/439)) ([08c4656](https://github.com/datorama/akita/commit/08c4656a8a3d9186156692e071790bbbf7f5a0ff))
- **query-entity:** selection of a single entity can be undefined ([#445](https://github.com/datorama/akita/issues/445)) ([888a825](https://github.com/datorama/akita/commit/888a8253ed03d8af77306d06e0ecbef3b1b78cec))
- **run-store-action:** add untyped store support ([#451](https://github.com/datorama/akita/issues/451)) ([f95ec5f](https://github.com/datorama/akita/commit/f95ec5f58a6cef3249341a3c5275519189194c9b))

### [0.0.1](https://github.com/datorama/akita/compare/v4.21.0...v0.0.1) (2020-05-20)

### Features

- **array-utils:** added index param on ItemPredicate ([#394](https://github.com/datorama/akita/issues/394)) ([7bb3e45](https://github.com/datorama/akita/commit/7bb3e458599d3df83aec5bccf016c9f6f3ab421a))
- **persist-state:** expose `persistState` return type ([#414](https://github.com/datorama/akita/issues/414)) ([111251f](https://github.com/datorama/akita/commit/111251fb14b887a3451fea0847dcd5feb24fc4f1))
- **router:** Fire navigation action on completion ([#406](https://github.com/datorama/akita/issues/406)) ([5052ccf](https://github.com/datorama/akita/commit/5052ccf40094a6ba1cae1684693306d21d44b4f4))

### Bug Fixes

- **build:** downgrade ts version ([9a454f6](https://github.com/datorama/akita/commit/9a454f618b340881a525709430a9f7b33bff4258))
- **dev:** delete stores and queries in prod mode ([ae2e754](https://github.com/datorama/akita/commit/ae2e754f17c98c0cdb32793160063e37b31d278e)), closes [#416](https://github.com/datorama/akita/issues/416)
- **env:** don't access window outside of browser ([#428](https://github.com/datorama/akita/issues/428)) ([6fdc251](https://github.com/datorama/akita/commit/6fdc25191f7037c67166a44384bcf740ff9be504))
- **ng-entity-service:** make methods protected to prevent error for e… ([#430](https://github.com/datorama/akita/issues/430)) ([aaef238](https://github.com/datorama/akita/commit/aaef23874048fde6db4045c4e80603b652552339))
