# Contributing to Akita

🙏 We would ❤️ for you to contribute to Akita and help make it even better than it is today!

# Getting Started

- Make sure you have [yarn](https://yarnpkg.com/) installed.
- Akita is a monorepo built using [Nx workspace](https://nx.dev/).
  - Optionally you can install [@nrwl/cli](https://yarnpkg.com/package/@nrwl/cli) (`yarn global add @nrwl/cli`), otherwise you can just run the NPM scripts provided, see [package.json](package.json).

# Developing

Start by installing all dependencies:

```shell
yarn install
```

Run the tests:

```shell
yarn test:all
```

or for a single `yarn test:lib:[library]`

```shell
yarn test:lib:akita-ng-entity-service
```

Run the playground apps via `yarn serve:app:[app-name]`

```shell
yarn serve:app:angular:akita-store-app
```

**NOTE** you must build the libraries (_once_) before you can `serve` them in an app.

## Building

Build everything (libs & apps)

```shell
yarn build:all
```

Build all apps

```shell
yarn build:apps
```

or build a single app `yarn build:app:angular:[app-name]`

```shell
yarn build:app:angular:akita-store-app
```

Build all libs

```shell
yarn build:libs
```

or build a single library `yarn build:lib:[library]`

```shell
yarn build:lib:akita-ng-entity-service
```

these will create a build in the `dist/` directory.

The playground applications are linked directly to the source files, making it easy to debug the code.

**NOTE** you must build the libs (_once_) before using them in an app or in another library. You must also build them in the their dependency order. However you can build with the `--with-deps` argument, and that should take care of it.

## Coding Rules

To ensure consistency throughout the source code, keep these rules in mind as you are working:

- All features or bug fixes **must be tested** by one or more specs (unit-tests).
- All public API methods **must be documented**.

## Commit Message Guidelines

We have very precise rules over how our git commit messages can be formatted. This leads to **more
readable messages** that are easy to follow when looking through the **project history**. But also,
we use the git commit messages to **generate the Akita changelog**.

### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

The footer should contain a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/) if any.

Samples: (even more [samples](https://github.com/angular/angular/commits/master))

```
docs(changelog): update changelog to beta.5
```

```
fix(release): need to depend on latest rxjs and zone.js

The version in our package.json gets copied to the one we publish, and users need the latest of these.
```
