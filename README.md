# WOK

> Tasty website cookware

WOK is a loosely opinionated boilerplate for web development built with flexibility and productivity in mind.

## Features

* Static HTML templating with [Nunjucks](https://mozilla.github.io/nunjucks/)
* [Sass](http://sass-lang.com/) 3.5+ with Dart [sass](https://github.com/sass/dart-sass) and CSS [post-processing](https://github.com/postcss/postcss)
* [BEM](http://blog.kaelig.fr/post/48196348743/fifty-shades-of-bem)-like naming convention
* Em based media-queries via [sass-mq](https://github.com/sass-mq/sass-mq)
* ES2015+ support with [Babel](https://babeljs.io/) (supports [babel-env](https://github.com/babel/babel-preset-env) for IE10+ and [class properties](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties). Polyfill loaded from CDN.js)
* [Gulp.js](http://gulpjs.com/) build and deploy workflow
* Development server and asset live-reload with [BrowserSync](http://www.browsersync.io/).
* Incremental deploy with [rsync](https://rsync.samba.org/) or [lftp](http://lftp.yar.ru/)
* Remote backup / rollback (UNIX SSH environments only)

## Supported browsers (via [browserslist](https://github.com/browserslist/browserslist))

- >= 1%
- last 1 Chrome version
- last 1 ChromeAndroid version
- last 1 Edge version
- last 1 Firefox version
- last 1 iOS version
- last 1 Safari version
- not ie < 11

## Requirements

* Node.js >= 10.0.0 (we strongly suggest to use something like [nvm](https://github.com/creationix/nvm))
* gulp cli (`npm install -g gulp-cli`)

## Installation

Clone this repo:

    git clone git://github.com/fevrcoding/wok.git

From project root:

* `npm install` (gulp deps)

### Linting

#### JavaScript linting

Wok comes with pre-configured [eslint](http://eslint.org/) linting based on the [airbnb base preset](https://www.npmjs.com/package/eslint-config-airbnb-base).

If you want to use _in editor_ linting, please follow the setup instructions [your editor](http://eslint.org/docs/user-guide/integrations#editors)

#### SCSS linting

Style files are linted via **stylelint**.  
Available editor extensions for in-editor linting are listed [here](http://stylelint.io/user-guide/complementary-tools/)

## Configuration

This boilerplate implements [`@wok-cli/preset-standard`][1] and [`@wok-cli/preset-wok`][2]

On a plain HTML project, the default configuration should work just fine. On other setups you might need to tweak some paths/options.

See `@wok-cli` project [documentation](https://dwightjack.github.io/wok-pkgs/) for configuration and customization details.


## Project Structure

See [`@wok-cli/preset-standard`][1] documentation for details.

### Using a bundler

To use ES2015 modules follow the [webpack2 recipe](https://github.com/fevrcoding/wok/wiki/Gulp:-webpack-and-ES6). 

## Building

From project root:

`gulp serve` (builds in development mode,  runs a static server on port 8000, watches for change and live-reloads assets)

### Production build

To generate a production build add the `--production` flag:

```bash
gulp --production
```

### Available tasks

See [`@wok-cli/preset-standard`][1] and [`@wok-cli/preset-wok`][2] documentations for more details.

## Project Info

WOK was created by [Marco Solazzi](https://github.com/dwightjack) with contributions from [Matteo Guidotto](https://github.com/mguidotto) and [Umberto Quintarelli](https://github.com/quincia).

Original work Copyright © 2014 Intesys S.r.l., released under the MIT license.
Modified work Copyright © 2015-2020 Marco Solazzi, released under the MIT license.

[1]: https://dwightjack.github.io/wok-pkgs/#/packages/preset-standard/
[2]: https://dwightjack.github.io/wok-pkgs/#/packages/preset-wok/