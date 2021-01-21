# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.1.1](https://github.com/datorama/akita/compare/v0.1.0...v0.1.1) (2020-11-28)

### Features

- 🎸 provide initial state to preStoreUpdate hook ([#567](https://github.com/datorama/akita/issues/567)) ([64278ef](https://github.com/datorama/akita/commit/64278ef51905fd9dbd8458dfd10b3c5781ade87f)), closes [#566](https://github.com/datorama/akita/issues/566)
- **entity-store:** track entity id updates ([#476](https://github.com/datorama/akita/issues/476)) ([bb59c14](https://github.com/datorama/akita/commit/bb59c1455d005b878340195f604ed03384ae1268))
- **helper:** add a utility function to toggle array values ([#467](https://github.com/datorama/akita/issues/467)) ([ecf5ca3](https://github.com/datorama/akita/commit/ecf5ca3d764517a62588ca6cd72af3ab6324d7cf))
- **schematics:** implement 'flat' flag for feature ([#470](https://github.com/datorama/akita/issues/470)) ([79cb3ea](https://github.com/datorama/akita/commit/79cb3ea1785caeae10b70ab35f215bafd9d98974))

### Bug Fixes

- 🐛 fix wrong types in router query ([8f1100f](https://github.com/datorama/akita/commit/8f1100f6569a6ddf57b100e08dd9dbe1c22973ff))
- **lib:** restored array state is not changed to an object literal ([#561](https://github.com/datorama/akita/issues/561)) ([b559a13](https://github.com/datorama/akita/commit/b559a133fa6d9d1bbaa6b6c88ed67fe274cd0d3e))
- add params to created object ([#544](https://github.com/datorama/akita/issues/544)) ([444cb4d](https://github.com/datorama/akita/commit/444cb4dbf255e13e5a1f97c79785cdbebf05197e))
- **akita:** added getStoreByName to index.ts ([#475](https://github.com/datorama/akita/issues/475)) ([a0afa3a](https://github.com/datorama/akita/commit/a0afa3a6f1592d588dda1d912a203de7259dff71))
- **build:** upgrade nx to 9.4.0 ([#478](https://github.com/datorama/akita/issues/478)) ([30bba8b](https://github.com/datorama/akita/commit/30bba8bd7b1351411e26c37c04887cc05a541ef5))
- **libs:** bump version ([99226bd](https://github.com/datorama/akita/commit/99226bda28f0502fa3b8a4ba1f9fff5bcee04799))
- **paginator:** update entities on store ([#530](https://github.com/datorama/akita/issues/530)) ([4c16def](https://github.com/datorama/akita/commit/4c16deffc87d66fb320b69903a187df62a409dff))
- **persist-state:** localStorage security errors ([#489](https://github.com/datorama/akita/issues/489)) ([50ff4e8](https://github.com/datorama/akita/commit/50ff4e853bb3e91df32faafaeee20ba615327119))
- **router-store:** serializeRoute 'state' undefined ([#529](https://github.com/datorama/akita/issues/529)) ([ed0e40b](https://github.com/datorama/akita/commit/ed0e40be2d9371d528e0197cc5f222714724ec17))
- **run-store-action:** add package exports for store actions ([#473](https://github.com/datorama/akita/issues/473)) ([ca3d3c0](https://github.com/datorama/akita/commit/ca3d3c09d188fa1f66374b43ae57183d0cc210a5)), closes [#472](https://github.com/datorama/akita/issues/472)
- **schematics:** bump versions ([1955267](https://github.com/datorama/akita/commit/1955267a53d94b7039d8b05525b2860520237d95))
- **schematics:** fix devtools ([6e539d1](https://github.com/datorama/akita/commit/6e539d15eece181f2d551e5885c0499f0c88924e))
- **schematics:** update schematics deps ([797bfa9](https://github.com/datorama/akita/commit/797bfa9efaca199889a820de15f81cdb34a88f12))
- **utils:** pass index to array update util ([2f2d345](https://github.com/datorama/akita/commit/2f2d34513942a56529cc35a5d5add0fcfe1e4afd))

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
