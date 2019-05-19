# Akita cli

## Getting Started

Install it via npm:

```shell
npm install @datorama/akita-cli -g
```

```shell
akita
```

### Base Path:
By default, the prompt is set to the current directory.
To change it, add to the root `package.json` the following config:
```
"akitaCli": {
  "customFolderName": "true",
  "template": "js|angular|ts", // default is js
  "basePath": "./playground/src/app/"
}
```
The path should be relative to the `package.json`.

![Demo](https://media.giphy.com/media/dCDq5fL8AoldTz28L7/giphy.gif)
