## Build

The local gulp configuration has been replaced by `@wok-cli/preset-standard` setup. As such, she `/build` folder has been removed and replaced by the `wok.config.js` file. Read the official documentation for configuration options.

Removed the `buildOnly` options and `build` task. Just use `gulp --production`. 
If you need any integrity check, please implement your own task or use an external script.

- Removed `gulp lint:js` and `gulp lint:styles`. Files are linted at build time

## Static folder

The `/static` folder is meant for file to be deployed as-is. 
During development the folder will be statically served. When producing a build, every file present in the folder will be copied over to `/public` preserving its original relative pathname.

As a special case, images will be minified when the `--production` flag is set.

## Application

- Removed the `documents` folder (use `fixtures` instead)
- Removed the `assets/fonts`, `assets/images` and  `assets/media` folder (place those file in the `/static` folder)

## Views

- Nunjucks' global `helpers` removed. 
- Added [`faker`](https://github.com/Marak/faker.js) and `_` [lodash](https://lodash.com/) global objects.

## Stylesheets

We now use the `sass` (Dart) package instead of `node-sass` to provide support for the new [module features](https://sass-lang.com/blog/the-module-system-is-launched). 

## JavaScript

- removed babel-polyfill CDN (deprecated) in favor of latest [core-js](https://github.com/zloirock/core-js).