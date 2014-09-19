#WOK

> Tasty website cookware

##Features

While you might use a wok to cook almost everything, it's just a cooking vessel.

This is a loosely opinionated static website boilerplate featuring:

* HTML5 Boilerplate
* Compass 1.0+ and Sass 3.3+
* BEM-like naming convention
* Legacy browsers fallback stylesheet
* Grunt.js
* Bower
* Asset Live-reload and Browser-sync
* Weinre remote debugging


##Requirements

* Node 0.10.25+
* Ruby 1.9.3+
* bundler (`gem install bundler`)
* bower (`sudo npm install -g bower`)
* grunt-cli (`sudo npm install -g grunt-cli`)

##Installation

From project root:

* `bundle install` (compass deps)
* `bower install` (vendors, though they should already be checked in svn/git repo)
* `npm install` (grunt deps)

##Configuration

On a plain HTML project, the default configuration should work fine. On other setups you might need to tweek some paths/options:


1. customize paths and options in `hosts.yml`, `paths.yml` and `properties.yml` files within the `build/grunt-config` folder

1. customize compass configuration file in `build/compass.rb`

1. if needed, add/remove tasks by editing `build/Gruntfile.js`

_Note: compass and grunt configs are kept separate to allow standalone usage._

##Project Structure

Project sources are located into `application` folder. Don't edit files in `www` since they will be overwritten during build process.

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

To limit performance issues, partials subfolders will not be parsed.

###Vendors

You may use [bower](http://bower.io/) to manage vendors. Installed packages will be stored into the `www/vendor` folder. Anyway, it's a good habit to checkin those files on your repository.


##Building

From project root:

1. `cd build`
2. `grunt` (builds in development mode and watches for change)

Other Grunt tasks:

* `serve`: same as default, also runs a static server on port 8000
* `dev`: development build
* `dist`: production ready build
* `deploy:[staging|production]`: development / production build and deploy with rsync. A backup of the deploy target folder (`paths.www`) will be stored in `paths.backup`.
* `rollback:[staging|production]`: restores the latest backup (if available)

**Note**: when paired with Phing, remember to set `buildOnly` to `false` in `build/grunt-config/properties.yml` to delegate deploy tasks to Phing.

##Project Info

WOK was created by [Marco Solazzi](https://github.com/dwightjack) with contributions from [Matteo Guidotto](https://github.com/mguidotto) and Umberto Quintarelli.


Copyright © 2014 Intesys S.r.l., released under the MIT license.


