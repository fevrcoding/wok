#WOK

> Tasty website cookware

WOK is a loosely opinionated boilerplate for web development built with flexibility and productivity in mind.

##Features

* [HTML5 Boilerplate](http://html5boilerplate.com/)
* [Compass](http://compass-style.org/) 1.0+ and [Sass](http://sass-lang.com/) 3.3+
* [BEM](http://blog.kaelig.fr/post/48196348743/fifty-shades-of-bem)-like naming convention
* Legacy browsers fallback stylesheet *(rem units conversion, large screen fallback via [Breakpoint](http://breakpoint-sass.com/#no_query_fallback))
* [Grunt.js](http://gruntjs.com/) build and deploy workflow
* [Bower](http://bower.io/)
* Asset Live-reload and/or [BrowserSync](http://www.browsersync.io/)
* [Weinre](http://people.apache.org/~pmuellr/weinre/) remote debugging
* more to come... (project scaffolding, jade support)


##Requirements

* Node.js >= 0.10.30 ([install wiki](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager))
* Ruby >= 1.9.3 ([installers](http://www.ruby-lang.org/en/downloads/))
* bundler (`gem install bundler`)
* bower (`sudo npm install -g bower`)
* grunt-cli (`sudo npm install -g grunt-cli`)

##Installation

Clone this repo:

	git clone git://github.com/dwightjack/grunt-email-boilerplate.git

From project root:

* `bundle install` (compass deps)
* `bower install` (vendors, Modernizr is already there [until v3.x](https://github.com/Modernizr/Modernizr/issues/1267))
* `npm install` (grunt deps)

##Configuration

On a plain HTML project, the default configuration should work fine. On other setups you might need to tweek some paths/options:


1. customize paths and options in `hosts.yml`, `paths.yml` and `properties.yml` files within the `build/grunt-config` folder

1. if needed customize compass configuration file in `build/compass.rb` 

1. if needed, add/remove tasks by editing `build/Gruntfile.js`

*Note: compass and grunt configs are kept separate to allow standalone usage.*

##Project Structure

Project sources are located into `application` folder. Don't edit files in `www` since they will be overwritten during the build process.

###Application Folder Structure

	assets
		+ fonts #Web Fonts
		+ images #Images
		+ javascripts #JavaScript files
		+ stylesheets #SASS files
	documents #Markdown files or any other txt-like file to be included in HTMLs
	fixtures #JSON files
	views #HTML files
		+	partials #View partials
		index.html #Main views
	...

###View Partials

View partials in `application/views/partials` are rendered to `www` folder like every other file. To prevent rendering prepend a `_` to the filename.

To limit performance issues, nested `partials` subfolders will not be parsed.

###Vendors

You may use [bower](http://bower.io/) to manage vendors. Installed packages will be stored into the `www/vendor` folder. Anyway, it's a good habit to checkin those files onto your repository.

###*More docs to come...*

##Building

From project root:

1. `cd build`
2. `grunt` (builds in development mode, watches for change and live-reloads assets)

Other Grunt tasks:

* `serve`: same as default, also runs a static server on port 8000
* `dev`: development build
* `dist`: production ready build
* `deploy:[staging|production]`: development / production build and deploy with rsync. A backup of the deploy target folder (`paths.www`) will be stored in `paths.backup`.
* `rollback:[staging|production]`: restores the latest backup (if available)

**Note**: when paired with Phing or other deployment systems, remember to set `buildOnly` to `false` in `build/grunt-config/properties.yml` to delegate deploy tasks.

##Project Info

WOK was created by [Marco Solazzi](https://github.com/dwightjack) with contributions from [Matteo Guidotto](https://github.com/mguidotto) and [Umberto Quintarelli](ttps://github.com/quincia).


Copyright © 2014 Intesys S.r.l., released under the MIT license.