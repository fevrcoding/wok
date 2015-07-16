#WOK

> Tasty website cookware

WOK is a loosely opinionated boilerplate for web development built with flexibility and productivity in mind.

##Features

* [HTML5 Boilerplate](http://html5boilerplate.com/)
* Static HTML templating with [EJS](https://github.com/mde/ejs)
* [Sass](http://sass-lang.com/) 3.2+ with [node-sass](https://github.com/sass/node-sass) and CSS [post-processing](https://github.com/postcss/postcss)
* [BEM](http://blog.kaelig.fr/post/48196348743/fifty-shades-of-bem)-like naming convention
* Legacy browsers fallback stylesheet (rem units conversion, large screen fallback via [sass-mq](https://github.com/sass-mq/sass-mq#responsive-mode-off))
* [Gulp.js](http://gulpjs.com/) build and deploy workflow
* [Bower](http://bower.io/)
* Development server and asset live-reload with [BrowserSync](http://www.browsersync.io/)
* [Weinre](http://people.apache.org/~pmuellr/weinre/) remote debugging
* more to come... (project scaffolding, jade support)


##Requirements

* Node.js >= 0.10.30 ([install wiki](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager))
* bower (`sudo npm install -g bower`)
* gulp cli (`sudo npm install -g gulp`)

##Installation

Clone this repo:

    git clone git://github.com/fevrcoding/wok.git

From project root:

* `bower install` (vendors)
* `npm install` (gulp deps)

##Configuration

On a plain HTML project, the default configuration should work just fine. On other setups you might need to tweak some paths/options:


1. customize paths and options in `hosts.js`, `paths.js` and `properties.js` files within the `build/gulp-config` folder

1. if needed, edit/add/remove tasks by editing tasks' configuration in `build/gulp-tasks/`.

##Project Structure

Project sources are located into `application` folder. Don't edit files in `public` since they will be overwritten during the build process.

###Application Folder Structure

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
        index.html #Main views
    ...

###View Partials

View partials in `application/views/partials` are rendered to `public` folder like every other file. To prevent rendering prepend a `_` to the filename.

To limit performance issues, nested `partials` subfolders will not be parsed.

###Vendors

You may use [bower](http://bower.io/) to manage vendors. Installed packages will be stored into the `application/assets/vendors` folder. Except for modernizr (which comes with wok by default) it's up to you to provide dev and dist configuration to deploy vendors' files to `public`.

###*More docs to come...*

##Building

From project root:

`gulp serve` (builds in development mode,  runs a static server on port 8000, watches for change and live-reloads assets)

###Production build

To generate a production ready build add the `--production` parameter:


    gulp --production
    

###Deploy and rollback:

To deploy and rollback with rsync first setup your remote hosts in `build/gulp-config/hosts.js`, then run:
 
    #deploy to remote staging server. A backup of the deploy target folder (`paths.dist.root`) will be stored in `paths.backup`.
    gulp deploy --remotehost=staging
    
    #deploy a production build to remote production server
    gulp deploy --production --remotehost=production
    
    #rollback to the previous version in the remote production server
    gulp remote --command=rollback --remotehost=production

**Note**: when paired with Phing or other deployment systems, remember to set `buildOnly` to `false` in `build/gulp-config/properties.js` to delegate deploy tasks.

###Other Gulp tasks

* `dev`: one time development build (also runs as default task)
* `bump`: bumps semver version of `package.json` and `bower.json` files. Accepts a `--type` parameter with value `major|minor|patch|prerelease`. Defaults to `patch`. 

##Project Info

WOK was created by [Marco Solazzi](https://github.com/dwightjack) with contributions from [Matteo Guidotto](https://github.com/mguidotto) and [Umberto Quintarelli](ttps://github.com/quincia).

Original work Copyright © 2014 Intesys S.r.l., released under the MIT license.
Modified work Copyright © 2015 Marco Solazzi, released under the MIT license.
