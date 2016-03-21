# WOK

> Tasty website cookware

WOK is a loosely opinionated boilerplate for web development built with flexibility and productivity in mind.

## Features

* [HTML5 Boilerplate](http://html5boilerplate.com/)
* Static HTML templating with [Nunjucks](https://mozilla.github.io/nunjucks/)
* [Sass](http://sass-lang.com/) 3.4+ with [node-sass](https://github.com/sass/node-sass) and CSS [post-processing](https://github.com/postcss/postcss)
* [BEM](http://blog.kaelig.fr/post/48196348743/fifty-shades-of-bem)-like naming convention
* Em based media-queries via [sass-mq](https://github.com/sass-mq/sass-mq)
* [Gulp.js](http://gulpjs.com/) build and deploy workflow
* [Bower](http://bower.io/)
* Development server and asset live-reload with [BrowserSync](http://www.browsersync.io/) and [Weinre](http://people.apache.org/~pmuellr/weinre/) remote debugging
* Incremental deploy with [rsync](https://rsync.samba.org/) or [lftp](http://lftp.yar.ru/)
* Remote backup / rollback (UNIX SSH environments only)
* more to come... (project scaffolding, jade support)


## Requirements

* Node.js >= 0.12.7 ([install wiki](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager))
* bower (`sudo npm install -g bower`)
* gulp cli (`sudo npm install -g gulp`)

## Installation

Clone this repo:

    git clone git://github.com/fevrcoding/wok.git

From project root:

* `bower install` (vendors)
* `npm install` (gulp deps)

### Linting

To enable **JavaScript linting** with eslint install npm packages globally:

```
npm install -g eslint@2.2.0 babel-eslint
```

Then install the required linter for [your editor](http://eslint.org/docs/user-guide/integrations#editors)

For **SCSS linting** you need [Ruby 2+](http://rubyinstaller.org/downloads/) and scss-lint package:

```
gem install scss_lint
```

Then install the [integration plugin](https://github.com/brigade/scss-lint#editor-integration) for your editor
 

## Configuration

On a plain HTML project, the default configuration should work just fine. On other setups you might need to tweak some paths/options:


1. customize paths and options in `hosts.js`, `paths.js` and `properties.js` files within the `build/gulp-config` folder

1. if needed, edit/add/remove tasks by editing tasks' configuration in `build/gulp-tasks/`.

## Project Structure

Project sources are located into `application` folder. Don't edit files in `public` since they will be overwritten during the build process.

### Application Folder Structure

    assets
        + fonts #Web Fonts
        + images #Images
        + javascripts #JavaScript files
        + stylesheets #SASS files
        + audio #audio files
        + video #video files
        + vendors #vendors packages installed by bower
    documents #Markdown files or any other txt-like file to be included in HTMLs
    fixtures #JSON files
    views #HTML files
        +   partials #View partials
        +   templates #Nunjucks templates
        index.nunj.html #Main views
    ...

### View Templates

With Nunjucks you can setup extensible page templates. See [official docs](https://mozilla.github.io/nunjucks/templating.html#template-inheritance) for further details.

### View Partials and Sub-folders

View partials in `application/views/partials` are rendered to `public` folder like every other file. To prevent rendering prepend a `_` to the filename.

To limit performance issues, just first level sub-folders will be included in the parse process.

### Vendors

You may use [bower](http://bower.io/) to manage vendors. Installed packages will be stored into the `application/assets/vendors` folder. It's up to you to provide dev and dist configuration to deploy vendors' files to `public`.

### *More docs to come...*

## Building

From project root:

`gulp serve` (builds in development mode,  runs a static server on port 8000, watches for change and live-reloads assets)

### Production build

To generate a production ready build add the `--production` parameter:


    gulp --production
    

### Deploy and rollback:

#### SSH and rsync

By default WOK implements a simple set of deploy tasks requiring SSH remote access and [rsync](https://rsync.samba.org).  

To deploy and rollback with rsync first setup your remote hosts in `build/gulp-config/hosts.js`, then run:
 
    #deploy to remote staging server. A backup of the deploy target folder (`paths.dist.root`) will be stored in `paths.backup`.
    gulp deploy --remotehost=staging
    
    #deploy a production build to remote production server
    gulp deploy --production --remotehost=production
    
    #rollback to the previous version in the remote production server
    gulp remote --command=rollback --remotehost=production

#### FTP

If you are on a shared hosting with FTP access, you can switch to the more basic `ftp` task, which uses [lftp](http://lftp.yar.ru) mirroring feature for incremental upload.

To switch to ftp mode, set `deployStrategy` in `build/gulp-config/properties.js` to `'ftp'`, then config hosts and run deploy commands as explained above.

**Note** Rollback and backup tasks won't be available with this configuration.

#### Usage with extarnal tools

When paired with Phing or other deployment systems, remember to set `buildOnly` to `true` in `build/gulp-config/properties.js` to delegate deploy tasks.

### Other Gulp tasks

* `dev`: one time development build (also runs as default task)
* `bump`: bumps semver version of `package.json` and `bower.json` files. Accepts a `--type` parameter with value `major|minor|patch|prerelease`. Defaults to `patch`. 

## Project Info

WOK was created by [Marco Solazzi](https://github.com/dwightjack) with contributions from [Matteo Guidotto](https://github.com/mguidotto) and [Umberto Quintarelli](https://github.com/quincia).

Original work Copyright © 2014 Intesys S.r.l., released under the MIT license.  
Modified work Copyright © 2015-2016 Marco Solazzi, released under the MIT license.
