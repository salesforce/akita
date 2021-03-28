# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [6.1.3](https://github.com/datorama/akita/compare/akita-v5.3.0...akita-v7.0.0) (2021-03-28)

### Features

- 🎸 add setLoadingAndError operator ([77ad1bd](https://github.com/datorama/akita/commit/77ad1bd94b999e2e1167fe6b97907915a31521e8))
- 🎸 upgrade typescript ([07a87b2](https://github.com/datorama/akita/commit/07a87b2511a7f4d0e70f92f79ea9571744992494))
- make DirtyCheck's getHead() public ([#610](https://github.com/datorama/akita/issues/610)) ([e6f0b5d](https://github.com/datorama/akita/commit/e6f0b5d83684e9ad84ddbf065c6c571912b2c50c)), closes [#593](https://github.com/datorama/akita/issues/593)

### Bug Fixes

- 🐛 add return types ([73fb584](https://github.com/datorama/akita/commit/73fb5840130cad6cbf07ad7eddc57e9c44f9134d))
- 🐛 change the update method in the StateHistoryPlugin ([#635](https://github.com/datorama/akita/issues/635)) ([ce117e1](https://github.com/datorama/akita/commit/ce117e19c8e0b8ffc8baab6537d621d2909ce5b6))
- 🐛 export the operator ([2c3cff9](https://github.com/datorama/akita/commit/2c3cff9198ebae7a7951d20a023f81dc17c54837))
- 🐛 log store name ([268f2a5](https://github.com/datorama/akita/commit/268f2a5e9b2950ae4db86b80b11f42e4c40e0cf4))
- 🐛 make config immutable in paginator ([66da4b4](https://github.com/datorama/akita/commit/66da4b4e87811ea2e3cc500d998087e6cea357a8)), closes [#648](https://github.com/datorama/akita/issues/648)
- filterNil removes undefined from resulting types in strict mode ([#638](https://github.com/datorama/akita/issues/638)) ([237e037](https://github.com/datorama/akita/commit/237e037a344a02b27a6a1b8296a4c2bb6a0bb003)), closes [#606](https://github.com/datorama/akita/issues/606)

## [5.3.0](https://github.com/datorama/akita/compare/akita-v5.2.6...akita-v5.3.0) (2020-11-28)

### Features

- 🎸 provide initial state to preStoreUpdate hook ([#567](https://github.com/datorama/akita/issues/567)) ([64278ef](https://github.com/datorama/akita/commit/64278ef51905fd9dbd8458dfd10b3c5781ade87f)), closes [#566](https://github.com/datorama/akita/issues/566)

### [5.2.6](https://github.com/datorama/akita/compare/akita-v5.2.5...akita-v5.2.6) (2020-11-23)

### Bug Fixes

- **lib:** restored array state is not changed to an object literal ([#561](https://github.com/datorama/akita/issues/561)) ([b559a13](https://github.com/datorama/akita/commit/b559a133fa6d9d1bbaa6b6c88ed67fe274cd0d3e))

### [5.2.5](https://github.com/datorama/akita/compare/akita-v5.2.4...akita-v5.2.5) (2020-10-07)

### [5.2.4](https://github.com/datorama/akita/compare/akita-v5.2.3...akita-v5.2.4) (2020-09-20)

### Bug Fixes

- **paginator:** update entities on store ([#530](https://github.com/datorama/akita/issues/530)) ([4c16def](https://github.com/datorama/akita/commit/4c16deffc87d66fb320b69903a187df62a409dff))

### [5.2.3](https://github.com/datorama/akita/compare/akita-v5.2.2...akita-v5.2.3) (2020-08-28)

### Bug Fixes

- **utils:** pass index to array update util ([2f2d345](https://github.com/datorama/akita/commit/2f2d34513942a56529cc35a5d5add0fcfe1e4afd))

### [5.2.2](https://github.com/datorama/akita/compare/akita-v5.2.1...akita-v5.2.2) (2020-08-07)

### [5.2.1](https://github.com/datorama/akita/compare/akita-v5.2.0...akita-v5.2.1) (2020-07-15)

### Bug Fixes

- **persist-state:** localStorage security errors ([#489](https://github.com/datorama/akita/issues/489)) ([50ff4e8](https://github.com/datorama/akita/commit/50ff4e853bb3e91df32faafaeee20ba615327119))

## [5.2.0](https://github.com/datorama/akita/compare/akita-v5.1.1...akita-v5.2.0) (2020-07-05)

### Features

- **entity-store:** track entity id updates ([#476](https://github.com/datorama/akita/issues/476)) ([bb59c14](https://github.com/datorama/akita/commit/bb59c1455d005b878340195f604ed03384ae1268))

### Bug Fixes

- **akita:** added getStoreByName to index.ts ([#475](https://github.com/datorama/akita/issues/475)) ([a0afa3a](https://github.com/datorama/akita/commit/a0afa3a6f1592d588dda1d912a203de7259dff71))

### [5.1.1](https://github.com/datorama/akita/compare/akita-v5.1.0...akita-v5.1.1) (2020-06-29)

### Bug Fixes

- **run-store-action:** add package exports for store actions ([#473](https://github.com/datorama/akita/issues/473)) ([ca3d3c0](https://github.com/datorama/akita/commit/ca3d3c09d188fa1f66374b43ae57183d0cc210a5)), closes [#472](https://github.com/datorama/akita/issues/472)

## [5.1.0](https://github.com/datorama/akita/compare/akita-v5.0.5...akita-v5.1.0) (2020-06-25)

### Features

- **helper:** add a utility function to toggle array values ([#467](https://github.com/datorama/akita/issues/467)) ([ecf5ca3](https://github.com/datorama/akita/commit/ecf5ca3d764517a62588ca6cd72af3ab6324d7cf))

### [5.0.5](https://github.com/datorama/akita/compare/akita-v5.0.4...akita-v5.0.5) (2020-06-19)

### [5.0.4](https://github.com/datorama/akita/compare/akita-v5.0.3...akita-v5.0.4) (2020-06-19)

### [5.0.3](https://github.com/datorama/akita/compare/akita-v5.0.2...akita-v5.0.3) (2020-06-19)

### [5.0.2](https://github.com/datorama/akita/compare/akita-v5.0.1...akita-v5.0.2) (2020-06-18)

### Bug Fixes

- **run-store-action:** add untyped store support ([#451](https://github.com/datorama/akita/issues/451)) ([f95ec5f](https://github.com/datorama/akita/commit/f95ec5f58a6cef3249341a3c5275519189194c9b))

### [5.0.1](https://github.com/datorama/akita/compare/akita-v5.0.0...akita-v5.0.1) (2020-06-16)

### Bug Fixes

- **entity-store:** change set cache location ([d318901](https://github.com/datorama/akita/commit/d318901bdc89c19eaba8ec1db3de438e4e6b4ec4))

## [5.0.0](https://github.com/datorama/akita/compare/akita-v4.23.2...akita-v5.0.0) (2020-06-15)

### ⚠ BREAKING CHANGES

- **action:** Remove deprecated exclude option from persist state
- **action:** Remove deprecated array utils functions

### Features

- **action:** remove deprecated array utils functions ([44d99c9](https://github.com/datorama/akita/commit/44d99c9c8a1833cf46fa1fc79725d8cf37dba985))
- **action:** remove deprecated exclude option from persist state ([5ca933a](https://github.com/datorama/akita/commit/5ca933ae8db2b1b6f57dcba37609fc9fb365809f))
- **persist-state:** add ability to select store data to persist ([#437](https://github.com/datorama/akita/issues/437)) ([3f4e5ae](https://github.com/datorama/akita/commit/3f4e5ae87c9a9bca46b5b41f8db6cd57390e77bb))

### Bug Fixes

- **devtools:** fix multiple logging of same actions ([#441](https://github.com/datorama/akita/issues/441)) ([7992435](https://github.com/datorama/akita/commit/7992435f294d27ec7ba3963485d6e3d15d1e6067))
- **entity-store:** improve type safety of entity store upsert operations ([#439](https://github.com/datorama/akita/issues/439)) ([08c4656](https://github.com/datorama/akita/commit/08c4656a8a3d9186156692e071790bbbf7f5a0ff))
- **query-entity:** selection of a single entity can be undefined ([#445](https://github.com/datorama/akita/issues/445)) ([888a825](https://github.com/datorama/akita/commit/888a8253ed03d8af77306d06e0ecbef3b1b78cec))

### [4.23.2](https://github.com/datorama/akita/compare/akita-v4.23.1...akita-v4.23.2) (2020-05-15)

### Bug Fixes

- **env:** don't access window outside of browser ([#428](https://github.com/datorama/akita/issues/428)) ([6fdc251](https://github.com/datorama/akita/commit/6fdc25191f7037c67166a44384bcf740ff9be504))

### [4.23.1](https://github.com/datorama/akita/compare/akita-v4.23.0...akita-v4.23.1) (2020-05-02)

### Bug Fixes

- **dev:** delete stores and queries in prod mode ([ae2e754](https://github.com/datorama/akita/commit/ae2e754f17c98c0cdb32793160063e37b31d278e)), closes [#416](https://github.com/datorama/akita/issues/416)

## [4.23.0](https://github.com/datorama/akita/compare/akita-v4.22.1...akita-v4.23.0) (2020-04-19)

### Features

- **persist-state:** expose `persistState` return type ([#414](https://github.com/datorama/akita/issues/414)) ([111251f](https://github.com/datorama/akita/commit/111251fb14b887a3451fea0847dcd5feb24fc4f1))

### [4.22.2](https://github.com/datorama/akita/compare/akita-v4.22.1...akita-v4.22.2) (2020-04-15)

### [4.22.1](https://github.com/datorama/akita/compare/akita-v4.22.0...akita-v4.22.1) (2020-04-14)

## [4.22.0](https://github.com/datorama/akita/compare/v4.21.0...v4.22.0) (2020-03-26)

### Features

- **array-utils:** added index param on ItemPredicate ([#394](https://github.com/datorama/akita/issues/394)) ([7bb3e45](https://github.com/datorama/akita/commit/7bb3e45))

## [4.21.0](https://github.com/datorama/akita/compare/v4.20.1...v4.21.0) (2020-03-09)

### Bug Fixes

- **persist-state:** ignore storage if not defined ([#385](https://github.com/datorama/akita/issues/385)) ([381433e](https://github.com/datorama/akita/commit/381433e))

### Features

- **entity-service:** added skip flag to skip store writes ([#379](https://github.com/datorama/akita/issues/379)) ([62741bb](https://github.com/datorama/akita/commit/62741bb))

### [4.20.1](https://github.com/datorama/akita/compare/v4.20.0...v4.20.1) (2020-03-03)

### Bug Fixes

- **persist-state:** localStorage security errors ([#384](https://github.com/datorama/akita/issues/384)) ([f8646df](https://github.com/datorama/akita/commit/f8646df))

## [4.20.0](https://github.com/datorama/akita/compare/v4.19.4...v4.20.0) (2020-03-01)

### Features

- 🎸 add support for passing active id in store set ([31c46b4](https://github.com/datorama/akita/commit/31c46b4))

### [4.19.4](https://github.com/datorama/akita/compare/v4.19.3...v4.19.4) (2020-02-25)

### Bug Fixes

- 🐛 persist form should merge the state ([#377](https://github.com/datorama/akita/issues/377)) ([0ab7e2e](https://github.com/datorama/akita/commit/0ab7e2e))

### [4.19.3](https://github.com/datorama/akita/compare/v4.19.2...v4.19.3) (2020-02-24)

### Bug Fixes

- **ng-entity-service:** remove duplicated file ([#357](https://github.com/datorama/akita/issues/357)) ([9cb190b](https://github.com/datorama/akita/commit/9cb190b))
- **state-history:** fix jump past and future ([#375](https://github.com/datorama/akita/issues/375)) ([2f532aa](https://github.com/datorama/akita/commit/2f532aa))

### [4.19.2](https://github.com/datorama/akita/compare/v4.19.1...v4.19.2) (2020-02-06)

### Bug Fixes

- 🐛 snapshot manager should support lazy stores ([94a084c](https://github.com/datorama/akita/commit/94a084c))

### [4.19.1](https://github.com/datorama/akita/compare/v4.19.0...v4.19.1) (2020-02-04)

### Bug Fixes

- **has-active:** fix condition when id provided ([#368](https://github.com/datorama/akita/issues/368)) ([8476eef](https://github.com/datorama/akita/commit/8476eef))

## [4.19.0](https://github.com/datorama/akita/compare/v4.18.1...v4.19.0) (2020-02-02)

### Bug Fixes

- 🐛 snapshot manager should ignore the router store ([f6c6ca2](https://github.com/datorama/akita/commit/f6c6ca2))

### Features

- **query-entity:** support single active state ([#367](https://github.com/datorama/akita/issues/367)) ([32be83e](https://github.com/datorama/akita/commit/32be83e))

### [4.18.1](https://github.com/datorama/akita/compare/v4.18.0...v4.18.1) (2020-01-29)

### Bug Fixes

- 🐛 persist state should not persist the router store ([b858cf5](https://github.com/datorama/akita/commit/b858cf5))

## [4.18.0](https://github.com/datorama/akita/compare/v4.17.5...v4.18.0) (2020-01-27)

### Features

- 🎸 add support for producer fn for immer ([5820703](https://github.com/datorama/akita/commit/5820703))

### [4.17.5](https://github.com/datorama/akita/compare/v4.17.4...v4.17.5) (2020-01-21)

### Bug Fixes

- 🐛 persist state should merge the state ([0792462](https://github.com/datorama/akita/commit/0792462)), closes [#361](https://github.com/datorama/akita/issues/361)

### [4.17.4](https://github.com/datorama/akita/compare/v4.17.3...v4.17.4) (2020-01-14)

### Bug Fixes

- **store:** fix resettable to not return always false, closes [#3](https://github.com/datorama/akita/issues/3)… ([#360](https://github.com/datorama/akita/issues/360)) ([22840ce](https://github.com/datorama/akita/commit/22840ce))

### [4.17.3](https://github.com/datorama/akita/compare/v4.17.2...v4.17.3) (2020-01-12)

### Bug Fixes

- **store:** fix resettable getter condition to return boolean ([#358](https://github.com/datorama/akita/issues/358)) ([4755ab6](https://github.com/datorama/akita/commit/4755ab6))

### [4.17.2](https://github.com/datorama/akita/compare/v4.17.1...v4.17.2) (2020-01-08)

### Bug Fixes

- 🐛 persist state should reset ttl ([d106bd1](https://github.com/datorama/akita/commit/d106bd1))

### [4.17.1](https://github.com/datorama/akita/compare/v4.17.0...v4.17.1) (2019-12-17)

### Bug Fixes

- 🐛 createquery fp options should be optional ([9d4c3f5](https://github.com/datorama/akita/commit/9d4c3f5))
- change arrayFind id param type ([#350](https://github.com/datorama/akita/issues/350)) ([80102b6](https://github.com/datorama/akita/commit/80102b6)), closes [#349](https://github.com/datorama/akita/issues/349)
- **formsmanager.unsubscribe:** update store before unsubscribing ([#344](https://github.com/datorama/akita/issues/344)) ([ee4286b](https://github.com/datorama/akita/commit/ee4286b))

## [4.17.0](https://github.com/datorama/akita/compare/v4.16.0...v4.17.0) (2019-12-05)

### Features

- **context:** release the entry type of akitaPreUpdateEntity ([#341](https://github.com/datorama/akita/issues/341)) ([1d019c1](https://github.com/datorama/akita/commit/1d019c1))

## [4.16.0](https://github.com/datorama/akita/compare/v4.14.1...v4.16.0) (2019-12-01)

### Bug Fixes

- **withTransaction:** Fixed typing ([#334](https://github.com/datorama/akita/issues/334)) ([055c2c3](https://github.com/datorama/akita/commit/055c2c3))

### Features

- **config:** add TTL to global Akita config ([#340](https://github.com/datorama/akita/issues/340)) ([5debdc0](https://github.com/datorama/akita/commit/5debdc0))
- 🎸 add watch property support for state history ([2bf07cf](https://github.com/datorama/akita/commit/2bf07cf))
- add observable past & future for history ([#339](https://github.com/datorama/akita/issues/339)) ([791e8c2](https://github.com/datorama/akita/commit/791e8c2))

## [4.15.0](https://github.com/datorama/akita/compare/v4.14.1...v4.15.0) (2019-12-01)

### Bug Fixes

- **withTransaction:** Fixed typing ([#334](https://github.com/datorama/akita/issues/334)) ([055c2c3](https://github.com/datorama/akita/commit/055c2c3))

### Features

- 🎸 add watch property support for state history ([2bf07cf](https://github.com/datorama/akita/commit/2bf07cf))
- add observable past & future for history ([#339](https://github.com/datorama/akita/issues/339)) ([791e8c2](https://github.com/datorama/akita/commit/791e8c2))

### [4.14.1](https://github.com/datorama/akita/compare/v4.14.0...v4.14.1) (2019-11-17)

### Bug Fixes

- 🐛 persist state dynamic stores ([01efe1f](https://github.com/datorama/akita/commit/01efe1f))

## [4.14.0](https://github.com/datorama/akita/compare/v4.13.0...v4.14.0) (2019-11-17)

### Features

- 🎸 add stores whitelist to devtools ([12e6a76](https://github.com/datorama/akita/commit/12e6a76))

## [4.13.0](https://github.com/datorama/akita/compare/v4.12.1...v4.13.0) (2019-11-15)

### Features

- 🎸 add persist state init to persist state ([b3df8ba](https://github.com/datorama/akita/commit/b3df8ba)), closes [#329](https://github.com/datorama/akita/issues/329)

### [4.12.1](https://github.com/datorama/akita/compare/v4.12.0...v4.12.1) (2019-11-14)

### Bug Fixes

- 🐛 pre add entity type can be any ([85b5ba1](https://github.com/datorama/akita/commit/85b5ba1))
- **with-transaction:** improve typings ([#327](https://github.com/datorama/akita/issues/327)) ([eb91f89](https://github.com/datorama/akita/commit/eb91f89))

## [4.12.0](https://github.com/datorama/akita/compare/v4.11.2...v4.12.0) (2019-11-11)

### Features

- **devtools:** add ability to sort the displayed store in devto… ([#326](https://github.com/datorama/akita/issues/326)) ([ee9d4e8](https://github.com/datorama/akita/commit/ee9d4e8))

### [4.11.2](https://github.com/datorama/akita/compare/v4.11.1...v4.11.2) (2019-11-10)

### Bug Fixes

- 🐛 remove ngentityservice from main bundle ([c0dfbb7](https://github.com/datorama/akita/commit/c0dfbb7))

### [4.11.1](https://github.com/datorama/akita/compare/v4.11.0...v4.11.1) (2019-11-10)

### Bug Fixes

- 🐛 change method name ([995069c](https://github.com/datorama/akita/commit/995069c))

## [4.11.0](https://github.com/datorama/akita/compare/v4.10.9...v4.11.0) (2019-11-10)

### Bug Fixes

- 🐛 add emitNext to cacheable ([80ec395](https://github.com/datorama/akita/commit/80ec395))

### Features

- 🎸 add getValue method to the store ([6fd84c8](https://github.com/datorama/akita/commit/6fd84c8))
- 🎸 add jump method to state history ([94dac25](https://github.com/datorama/akita/commit/94dac25))
- 🎸 add withLoading operator ([d9c1fb5](https://github.com/datorama/akita/commit/d9c1fb5))
- 🎸 expose http provider in entity service ([e5a96e0](https://github.com/datorama/akita/commit/e5a96e0))

### [4.10.10](https://github.com/datorama/akita/compare/v4.10.9...v4.10.10) (2019-11-07)

### Bug Fixes

- 🐛 add emitNext to cacheable ([80ec395](https://github.com/datorama/akita/commit/80ec395))

### [4.10.9](https://github.com/datorama/akita/compare/v4.10.8...v4.10.9) (2019-10-27)

### Bug Fixes

- **schematics:** improve model file ([88e214b](https://github.com/datorama/akita/commit/88e214b))

### [4.10.8](https://github.com/datorama/akita/compare/v4.10.7...v4.10.8) (2019-10-10)

### Bug Fixes

- 🐛 service schematics ([01244c5](https://github.com/datorama/akita/commit/01244c5)), closes [#309](https://github.com/datorama/akita/issues/309)

### [4.10.7](https://github.com/datorama/akita/compare/v4.10.6...v4.10.7) (2019-09-27)

### Bug Fixes

- **entity-query:** selectEntityAction typing ([#301](https://github.com/datorama/akita/issues/301)) ([1f7d6d0](https://github.com/datorama/akita/commit/1f7d6d0))
- **persist-state:** Allow in non-browser ([#300](https://github.com/datorama/akita/issues/300)) ([4c45d12](https://github.com/datorama/akita/commit/4c45d12))
- **root:** fix isNotBrowser check ([#303](https://github.com/datorama/akita/issues/303)) ([9993821](https://github.com/datorama/akita/commit/9993821))

### [4.10.5](https://github.com/datorama/akita/compare/v4.10.4...v4.10.5) (2019-09-24)

### Bug Fixes

- **run-store-action:** add return in switch case ([#302](https://github.com/datorama/akita/issues/302)) ([3946bb3](https://github.com/datorama/akita/commit/3946bb3))

### [4.10.6](https://github.com/datorama/akita/compare/v4.10.4...v4.10.6) (2019-09-27)

### Bug Fixes

- 🐛 destroy should support nativescript ([6b94952](https://github.com/datorama/akita/commit/6b94952))

### [4.10.5](https://github.com/datorama/akita/compare/v4.10.4...v4.10.5) (2019-09-27)

### Bug Fixes

- 🐛 destroy should support nativescript ([6b94952](https://github.com/datorama/akita/commit/6b94952))

### [4.10.4](https://github.com/datorama/akita/compare/v4.10.3...v4.10.4) (2019-09-15)

### [4.10.3](https://github.com/datorama/akita/compare/v4.10.2...v4.10.3) (2019-09-10)

### Bug Fixes

- 🐛 schematics should not override the default service ([a9795b8](https://github.com/datorama/akita/commit/a9795b8))

### [4.10.2](https://github.com/datorama/akita/compare/v4.10.1...v4.10.2) (2019-08-28)

### Bug Fixes

- **selectmany:** refactor it to be sync ([1f884a0](https://github.com/datorama/akita/commit/1f884a0))

### [4.10.1](https://github.com/datorama/akita/compare/v4.10.0...v4.10.1) (2019-08-27)

### Bug Fixes

- **ui-store:** should support upsertmany ([4ee8b2f](https://github.com/datorama/akita/commit/4ee8b2f)), closes [#285](https://github.com/datorama/akita/issues/285)

## [4.10.0](https://github.com/datorama/akita/compare/v4.9.7...v4.10.0) (2019-08-20)

### Features

- **devtools:** allow to change instance name visible in devtools ([50a65e9](https://github.com/datorama/akita/commit/50a65e9))

### [4.9.7](https://github.com/datorama/akita/compare/v4.9.6...v4.9.7) (2019-08-17)

### Bug Fixes

- **schematics:** use name as last part of path ([d0ef1cf](https://github.com/datorama/akita/commit/d0ef1cf))

### [4.9.6](https://github.com/datorama/akita/compare/v4.9.5...v4.9.6) (2019-08-15)

### Bug Fixes

- **entity-store:** removeActive add support for single active ([5097ec4](https://github.com/datorama/akita/commit/5097ec4))

### [4.9.5](https://github.com/datorama/akita/compare/v4.9.4...v4.9.5) (2019-08-15)

### Bug Fixes

- **schematics:** fix typo ([dee8c37](https://github.com/datorama/akita/commit/dee8c37))
- **schematics:** fix typos ([bdf594a](https://github.com/datorama/akita/commit/bdf594a))
- **types:** activestate use id by default again ([ab90451](https://github.com/datorama/akita/commit/ab90451))

### [4.9.4](https://github.com/datorama/akita/compare/v4.9.3...v4.9.4) (2019-08-13)

### Bug Fixes

- **schematics:** add doc link to entityservices ([d8b34c9](https://github.com/datorama/akita/commit/d8b34c9))
- **types:** activestate use any by default ([fd96dbb](https://github.com/datorama/akita/commit/fd96dbb))

### [4.9.3](https://github.com/datorama/akita/compare/v4.9.2...v4.9.3) (2019-08-09)

### Bug Fixes

- **array-utils:** array upsert should pass the id key ([b824e67](https://github.com/datorama/akita/commit/b824e67)), closes [#270](https://github.com/datorama/akita/issues/270)

### [4.9.2](https://github.com/datorama/akita/compare/v4.9.1...v4.9.2) (2019-08-09)

### Bug Fixes

- **dirty-check-plugin:** added missing generic type in DirtyCheckParams ([f12eb1e](https://github.com/datorama/akita/commit/f12eb1e))

## [4.9.0](https://github.com/datorama/akita/compare/v4.8.1...v4.9.0) (2019-08-06)

### Bug Fixes

- **operators:** filternil type ([5be64cd](https://github.com/datorama/akita/commit/5be64cd))
- **schematic:** uncomment ng-entity-service deps ([401f049](https://github.com/datorama/akita/commit/401f049))
- **schematic-path:** update path ([f4b9539](https://github.com/datorama/akita/commit/f4b9539))
- **schematic-path:** update path ([c097b4a](https://github.com/datorama/akita/commit/c097b4a))
- **schematics:** can update providers with object ([6c2b41d](https://github.com/datorama/akita/commit/6c2b41d))
- **schematics:** change requested + build ([9096c1f](https://github.com/datorama/akita/commit/9096c1f))
- **schematics:** change requested after review ([1fce27b](https://github.com/datorama/akita/commit/1fce27b))

### Features

- **cli:** add http entity service ([792e7a5](https://github.com/datorama/akita/commit/792e7a5))
- **cli:** add http entity service ([0ce57a4](https://github.com/datorama/akita/commit/0ce57a4))
- **schematics:** add entity service ([8714eb8](https://github.com/datorama/akita/commit/8714eb8))
- **schematics:** add entity service ([33c0b88](https://github.com/datorama/akita/commit/33c0b88))
- **schematics:** generate http entity service ([838f58b](https://github.com/datorama/akita/commit/838f58b))
- **schematics:** generate http entity service ([36069f6](https://github.com/datorama/akita/commit/36069f6))
- **schematics:** httpService option for feature ([a37ad89](https://github.com/datorama/akita/commit/a37ad89))

### [4.8.1](https://github.com/datorama/akita/compare/v4.8.0...v4.8.1) (2019-07-25)

### Bug Fixes

- **upsert-many:** should support class on update ([4194410](https://github.com/datorama/akita/commit/4194410))

## [4.8.0](https://github.com/datorama/akita/compare/v4.7.0...v4.8.0) (2019-07-21)

### Features

- **upsert-many:** add akitaPreCheckEntity hook ([9eddf45](https://github.com/datorama/akita/commit/9eddf45))
- **upsert-many:** add akitaPreCheckEntity hook ([#255](https://github.com/datorama/akita/issues/255)) ([6d05be9](https://github.com/datorama/akita/commit/6d05be9))

## [4.7.0](https://github.com/datorama/akita/compare/v4.6.0...v4.7.0) (2019-07-21)

### Features

- **array-utils:** add upsert function ([03bda18](https://github.com/datorama/akita/commit/03bda18))
- **array-utils:** added arratUpsert ([ae5f77c](https://github.com/datorama/akita/commit/ae5f77c))

## [4.6.0](https://github.com/datorama/akita/compare/v4.5.0...v4.6.0) (2019-07-18)

### Features

- **packages:** entity-service ([9b1bf13](https://github.com/datorama/akita/commit/9b1bf13))

## [4.5.0](https://github.com/datorama/akita/compare/v4.4.3...v4.5.0) (2019-07-14)

### Features

- **query:** add combine queries helper ([5d0a9f2](https://github.com/datorama/akita/commit/5d0a9f2))
- **query:** add support for querying multiple keys ([b2b0dd1](https://github.com/datorama/akita/commit/b2b0dd1))

<a name="4.4.3"></a>

## [4.4.3](https://github.com/datorama/akita/compare/v4.4.2...v4.4.3) (2019-07-12)

### Bug Fixes

- **schematics:** should support sourceroot key ([793774f](https://github.com/datorama/akita/commit/793774f))

<a name="4.4.2"></a>

## [4.4.2](https://github.com/datorama/akita/compare/v4.4.1...v4.4.2) (2019-07-12)

### Bug Fixes

- **upsert-many:** should run pre hooks ([1786129](https://github.com/datorama/akita/commit/1786129)), closes [#248](https://github.com/datorama/akita/issues/248)

<a name="4.4.1"></a>

## [4.4.1](https://github.com/datorama/akita/compare/v4.4.0...v4.4.1) (2019-07-06)

### Bug Fixes

- **devtools:** fix hmr regression and remove devtools action ([fa45d84](https://github.com/datorama/akita/commit/fa45d84))

<a name="4.4.0"></a>

# [4.4.0](https://github.com/datorama/akita/compare/v4.3.0...v4.4.0) (2019-07-05)

### Features

- **cache:** add cacheable helper ([7ec6044](https://github.com/datorama/akita/commit/7ec6044))

<a name="4.3.0"></a>

# [4.3.0](https://github.com/datorama/akita/compare/v4.2.2...v4.3.0) (2019-07-05)

### Features

- **entity-store:** add move method ([bd7369d](https://github.com/datorama/akita/commit/bd7369d))
- **store:** move cache ttl to base store ([114238a](https://github.com/datorama/akita/commit/114238a))

## [4.2.2](https://github.com/datorama/akita/compare/v4.2.1...v4.2.2) (2019-07-03)

### Bug Fixes

- **schematics:** import packages improvements ([45324ef](https://github.com/datorama/akita/commit/45324ef))

<a name="4.2.1"></a>

## [4.2.1](https://github.com/datorama/akita/compare/v4.2.0...v4.2.1) (2019-06-30)

### Bug Fixes

- **schematics:** router should run in production ([5f1e2de](https://github.com/datorama/akita/commit/5f1e2de))

<a name="4.2.0"></a>

# [4.2.0](https://github.com/datorama/akita/compare/v4.1.1...v4.2.0) (2019-06-29)

### Features

- **persist-state:** include property now can take a preficate ([79f75b4](https://github.com/datorama/akita/commit/79f75b4))

<a name="4.1.1"></a>

## [4.1.1](https://github.com/datorama/akita/compare/v4.1.0...v4.1.1) (2019-06-26)

### Bug Fixes

- **lib:** should work with ts strict type ([e4e4532](https://github.com/datorama/akita/commit/e4e4532)), closes [#241](https://github.com/datorama/akita/issues/241)

<a name="4.1.0"></a>

# [4.1.0](https://github.com/datorama/akita/compare/v4.0.0...v4.1.0) (2019-06-26)

### Features

- **array-add:** upserts ([7e3f1f6](https://github.com/datorama/akita/commit/7e3f1f6))
- **array-add:** upserts ([#239](https://github.com/datorama/akita/issues/239)) ([4dec464](https://github.com/datorama/akita/commit/4dec464))

<a name="4.0.0"></a>

# [4.0.0](https://github.com/datorama/akita/compare/v3.18.0...v4.0.0) (2019-06-26)

### Features

- **lib:** checkout the breaking changes file for more info ([4105a11](https://github.com/datorama/akita/commit/4105a11)), closes [#238](https://github.com/datorama/akita/issues/238)

### BREAKING CHANGES

- **lib:** checkout the breaking changes file for more info

<a name="3.18.0"></a>

# [3.18.0](https://github.com/datorama/akita/compare/v3.17.1...v3.18.0) (2019-06-23)

### Bug Fixes

- **persist-state:** should support dynamic stores deletion ([1a2eb5c](https://github.com/datorama/akita/commit/1a2eb5c))

### Features

- **stores:** expose stores on window in browser devmode ([ead8561](https://github.com/datorama/akita/commit/ead8561))

<a name="3.17.1"></a>

## [3.17.1](https://github.com/datorama/akita/compare/v3.17.0...v3.17.1) (2019-06-20)

### Bug Fixes

- **persist-state:** avoid redundant de/serialize ([b182303](https://github.com/datorama/akita/commit/b182303))

<a name="3.17.0"></a>

# [3.17.0](https://github.com/datorama/akita/compare/v3.16.1...v3.17.0) (2019-06-19)

### Features

- **persist-state:** add prestorage operators option ([91489b8](https://github.com/datorama/akita/commit/91489b8))

<a name="3.16.1"></a>

## [3.16.1](https://github.com/datorama/akita/compare/v3.16.0...v3.16.1) (2019-06-16)

### Bug Fixes

- **schematics:** update devtools version ([c627b99](https://github.com/datorama/akita/commit/c627b99))

<a name="3.16.0"></a>

# [3.16.0](https://github.com/datorama/akita/compare/v3.15.1...v3.16.0) (2019-06-14)

### Features

- **entity-store:** add replace entity method ([0289a7e](https://github.com/datorama/akita/commit/0289a7e))

<a name="3.15.1"></a>

## [3.15.1](https://github.com/datorama/akita/compare/v3.15.0...v3.15.1) (2019-06-10)

### Bug Fixes

- **devtools:** should support ssr ([9da1f9e](https://github.com/datorama/akita/commit/9da1f9e)), closes [#233](https://github.com/datorama/akita/issues/233)

<a name="3.15.0"></a>

# [3.15.0](https://github.com/datorama/akita/compare/v3.14.0...v3.15.0) (2019-06-09)

### Features

- **paginator-plugin:** add refresh page method ([85705e4](https://github.com/datorama/akita/commit/85705e4)), closes [#232](https://github.com/datorama/akita/issues/232)

<a name="3.14.0"></a>

# [3.14.0](https://github.com/datorama/akita/compare/v3.13.1...v3.14.0) (2019-06-07)

### Features

- **history-plugin:** allow custom clear function ([68ba22e](https://github.com/datorama/akita/commit/68ba22e))

<a name="3.13.1"></a>

## [3.13.1](https://github.com/datorama/akita/compare/v3.13.0...v3.13.1) (2019-06-04)

### Bug Fixes

- **persist-state:** allow skipping storage update ([e732050](https://github.com/datorama/akita/commit/e732050)), closes [#228](https://github.com/datorama/akita/issues/228)

<a name="3.13.0"></a>

# [3.13.0](https://github.com/datorama/akita/compare/v3.12.1...v3.13.0) (2019-06-03)

### Bug Fixes

- **store-config:** remove internal storeName from config ([8f8ceec](https://github.com/datorama/akita/commit/8f8ceec))

### Features

- **query-entity:** add predicate function to select-entity method ([ea7a1d7](https://github.com/datorama/akita/commit/ea7a1d7))

<a name="3.12.1"></a>

## [3.12.1](https://github.com/datorama/akita/compare/v3.12.0...v3.12.1) (2019-05-30)

### Bug Fixes

- **persist-state:** should support non-localstorage envs ([3b7e160](https://github.com/datorama/akita/commit/3b7e160)), closes [#226](https://github.com/datorama/akita/issues/226)

<a name="3.12.0"></a>

# [3.12.0](https://github.com/datorama/akita/compare/v3.11.2...v3.12.0) (2019-05-29)

### Features

- **persist-state:** add preupadte hooks ([e3a5396](https://github.com/datorama/akita/commit/e3a5396))

<a name="3.11.2"></a>

## [3.11.2](https://github.com/datorama/akita/compare/v3.11.1...v3.11.2) (2019-05-27)

### Bug Fixes

- **resettable:** allow passing resettable in the constructor ([40d6182](https://github.com/datorama/akita/commit/40d6182)), closes [#224](https://github.com/datorama/akita/issues/224)

<a name="3.11.1"></a>

## [3.11.1](https://github.com/datorama/akita/compare/v3.11.0...v3.11.1) (2019-05-20)

### Bug Fixes

- **entity-store:** revert store config to include idkey ([949237c](https://github.com/datorama/akita/commit/949237c)), closes [#221](https://github.com/datorama/akita/issues/221)
- **fp:** add query entity options to create-entity-query function ([430f8f3](https://github.com/datorama/akita/commit/430f8f3))

<a name="3.11.0"></a>

# [3.11.0](https://github.com/datorama/akita/compare/v3.10.2...v3.11.0) (2019-05-19)

### Features

- **lib:** add create store and create query functions ([ee37a2c](https://github.com/datorama/akita/commit/ee37a2c))

<a name="3.10.0"></a>

# [3.10.0](https://github.com/datorama/akita/compare/v3.9.2...v3.10.0) (2019-05-05)

### Bug Fixes

- **presist-state:** cache value should be persisted ([56b4b16](https://github.com/datorama/akita/commit/56b4b16))

### Features

- **entity-query:** add entity actions query ([6d9dc8d](https://github.com/datorama/akita/commit/6d9dc8d))

<a name="3.9.2"></a>

## [3.9.2](https://github.com/datorama/akita/compare/v3.9.1...v3.9.2) (2019-05-01)

### Bug Fixes

- **paginator:** take current page from response ([4f05658](https://github.com/datorama/akita/commit/4f05658))

<a name="3.9.0"></a>

# [3.9.0](https://github.com/datorama/akita/compare/v3.8.2...v3.9.0) (2019-04-30)

### Bug Fixes

- **paginator:** should take the total property to calc the to field ([0ab4e20](https://github.com/datorama/akita/commit/0ab4e20)), closes [#214](https://github.com/datorama/akita/issues/214)

### Features

- **devtools:** add option to filter actions by deep compare ([e7d4a63](https://github.com/datorama/akita/commit/e7d4a63))
- **entity-store:** add method should reset the loading back to false ([69c9e1c](https://github.com/datorama/akita/commit/69c9e1c))
- **entity-store:** add upsert many method ([79a7752](https://github.com/datorama/akita/commit/79a7752))

<a name="3.7.0"></a>

# [3.7.0](https://github.com/datorama/akita/compare/v3.5.5...v3.7.0) (2019-04-17)

### Bug Fixes

- add platform check for NativeScript ([4930c9b](https://github.com/datorama/akita/commit/4930c9b))
- **entity-store:** select many should filter nil entities ([7aef894](https://github.com/datorama/akita/commit/7aef894)), closes [#210](https://github.com/datorama/akita/issues/210)
- **schematics:** extend angular schematics ([3fe10a1](https://github.com/datorama/akita/commit/3fe10a1))
- **storeconfig:** changed config name ([74c1e1f](https://github.com/datorama/akita/commit/74c1e1f))

### Features

- **store,storeconfig:** config for deepFreeze function ([1d7535c](https://github.com/datorama/akita/commit/1d7535c)), closes [#124](https://github.com/datorama/akita/issues/124)

<a name="3.6.0"></a>

# [3.6.0](https://github.com/datorama/akita/compare/v3.5.7...v3.6.0) (2019-04-17)

### Bug Fixes

- **storeconfig:** changed config name ([74c1e1f](https://github.com/datorama/akita/commit/74c1e1f))

### Features

- **store,storeconfig:** config for deepFreeze function ([1d7535c](https://github.com/datorama/akita/commit/1d7535c)), closes [#124](https://github.com/datorama/akita/issues/124)

<a name="3.5.7"></a>

## [3.5.7](https://github.com/datorama/akita/compare/v3.5.5...v3.5.7) (2019-04-16)

### Bug Fixes

- **schematics:** extend angular schematics ([3fe10a1](https://github.com/datorama/akita/commit/3fe10a1))
- add platform check for NativeScript ([4930c9b](https://github.com/datorama/akita/commit/4930c9b))

<a name="3.5.6"></a>

## [3.5.6](https://github.com/datorama/akita/compare/v3.5.5...v3.5.6) (2019-04-13)

### Bug Fixes

- **schematics:** extend angular schematics ([3fe10a1](https://github.com/datorama/akita/commit/3fe10a1))

<a name="3.5.5"></a>

## [3.5.5](https://github.com/datorama/akita/compare/v3.5.4...v3.5.5) (2019-04-08)

### Bug Fixes

- **transaction:** expose transaction operator ([3b1d036](https://github.com/datorama/akita/commit/3b1d036))

<a name="3.5.4"></a>

## [3.5.4](https://github.com/datorama/akita/compare/v3.5.3...v3.5.4) (2019-04-08)

### Bug Fixes

- **paginator-plugin:** add option to not clear the original store ([be88f3e](https://github.com/datorama/akita/commit/be88f3e))

<a name="3.5.3"></a>

## [3.5.3](https://github.com/datorama/akita/compare/v3.5.2...v3.5.3) (2019-04-07)

### Bug Fixes

- **ui-store:** support pre-middleware hook ([f1da2d7](https://github.com/datorama/akita/commit/f1da2d7))

<a name="3.5.2"></a>

## [3.5.2](https://github.com/datorama/akita/compare/v3.5.1...v3.5.2) (2019-04-04)

### Bug Fixes

- **internal:** simplify not util ([731302a](https://github.com/datorama/akita/commit/731302a))

<a name="3.5.1"></a>

## [3.5.1](https://github.com/datorama/akita/compare/v3.5.0...v3.5.1) (2019-04-04)

### Bug Fixes

- **persist-state:** merge clear all stores ([a2dd005](https://github.com/datorama/akita/commit/a2dd005))

<a name="3.4.2"></a>

## [3.4.2](https://github.com/datorama/akita/compare/v3.4.1...v3.4.2) (2019-04-03)

### Bug Fixes

- **persist-state:** clear store should allow delete all ([1e49782](https://github.com/datorama/akita/commit/1e49782)), closes [#199](https://github.com/datorama/akita/issues/199)

<a name="3.5.0"></a>

# [3.5.0](https://github.com/datorama/akita/compare/v3.4.1...v3.5.0) (2019-04-04)

### Bug Fixes

- **array-utils:** add support for non object keys ([e2456c1](https://github.com/datorama/akita/commit/e2456c1))

### Features

- **array-utils:** add support for non-object keys ([c434621](https://github.com/datorama/akita/commit/c434621))

<a name="3.4.2"></a>

## [3.4.2](https://github.com/datorama/akita/compare/v3.4.1...v3.4.2) (2019-04-04)

### Bug Fixes

- **array-utils:** add support for non object keys ([e2456c1](https://github.com/datorama/akita/commit/e2456c1))

<a name="3.4.1"></a>

## [3.4.1](https://github.com/datorama/akita/compare/v3.4.0...v3.4.1) (2019-04-03)

### Bug Fixes

- **devtools:** call reset action ([151df7a](https://github.com/datorama/akita/commit/151df7a))

<a name="3.4.0"></a>

# [3.4.0](https://github.com/datorama/akita/compare/v3.2.5...v3.4.0) (2019-03-31)

### Bug Fixes

- **entity-id-key:** support dynamic id key from middleware ([495f272](https://github.com/datorama/akita/commit/495f272)), closes [#196](https://github.com/datorama/akita/issues/196)
- **entity-store:** loop over the entities once ([b74ea12](https://github.com/datorama/akita/commit/b74ea12))

### Features

- **transactions:** add new transactions operators ([ce05544](https://github.com/datorama/akita/commit/ce05544))

<a name="3.3.0"></a>

# [3.3.0](https://github.com/datorama/akita/compare/v3.2.5...v3.3.0) (2019-03-31)

### Features

- **transactions:** add new transactions operators ([ce05544](https://github.com/datorama/akita/commit/ce05544))

<a name="3.2.5"></a>

## [3.2.5](https://github.com/datorama/akita/compare/v3.0.1...v3.2.5) (2019-03-30)

### Bug Fixes

- **entity-store:** remove id key check ([d4b4b7b](https://github.com/datorama/akita/commit/d4b4b7b))
- **upsert:** add option to pass a class ([9a6685a](https://github.com/datorama/akita/commit/9a6685a)), closes [#192](https://github.com/datorama/akita/issues/192)

<a name="3.2.2"></a>

## 3.2.2 (2019-03-26)

### Bug Fixes

- **dev-tools:** protect undefined store ([6e6e8c0](https://github.com/datorama/akita/commit/6e6e8c0))
- **store:** fix store cache ([485eac4](https://github.com/datorama/akita/commit/485eac4))

### Features

- **ui-entity-store:** add initial entity state option ([b099184](https://github.com/datorama/akita/commit/b099184))
- **ui-store:** add the option to pass initial state ([b1504df](https://github.com/datorama/akita/commit/b1504df)), closes [#190](https://github.com/datorama/akita/issues/190)

<a name="3.1.8"></a>

## 3.1.8 (2019-03-24)

<a name="3.1.4"></a>

## 3.1.4 (2019-03-23)

### Bug Fixes

- **set-entities:** verify that id is not a number before casting ([c76a64f](https://github.com/datorama/akita/commit/c76a64f)), closes [#185](https://github.com/datorama/akita/issues/185)

<a name="3.1.3"></a>

## 3.1.3 (2019-03-22)

### Bug Fixes

- **middleware:** set method should support pre middleware ([1d7eb97](https://github.com/datorama/akita/commit/1d7eb97)), closes [#186](https://github.com/datorama/akita/issues/186)

<a name="3.1.2"></a>

## 3.1.2 (2019-03-20)

### Bug Fixes

- **arrays:** fix typescript import ([3d6a924](https://github.com/datorama/akita/commit/3d6a924))
- **lib:** export array utils ([b72828e](https://github.com/datorama/akita/commit/b72828e)), closes [#181](https://github.com/datorama/akita/issues/181)
- **lib:** import ([db53731](https://github.com/datorama/akita/commit/db53731))
- **store:** fix regression is not browser check ([16119bb](https://github.com/datorama/akita/commit/16119bb))

### Features

- **entity-store:** add assertEntityIdKey check ([580cd6e](https://github.com/datorama/akita/commit/580cd6e))
- **query:** add selectUpdatedEntityIds query method ([71e6b3f](https://github.com/datorama/akita/commit/71e6b3f)), closes [#183](https://github.com/datorama/akita/issues/183)

<a name="3.0.3"></a>

## 3.0.3 (2019-03-16)

### Bug Fixes

- **actions:** short store actions ([7d9adba](https://github.com/datorama/akita/commit/7d9adba))

<a name="3.0.2"></a>

## 3.0.2 (2019-03-16)

### Bug Fixes

- **run-action:** expose api ([52ed41c](https://github.com/datorama/akita/commit/52ed41c))
