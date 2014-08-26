> OK, this is a rather original folder setup... here are some docs to make it work

#INSTALL DEPENDENCIES

Requirements

* Node 0.10.25+
* Ruby 1.9.3+
* bundler (`gem install bundler`)
* bower (`sudo npm install -g bower`)
* grunt-cli (`sudo npm install -g grunt-cli`)


From project root

* `bundle install` (compass deps)
* `bower install` (vendors, though they should already be checked in svn/git repo)
* `npm install` (grunt deps)

#CONFIGURATION

On a static-only project the default configuration should be fine. On other setups you might need tweek some paths/options:

1) customize compass configuration file in `build/compass.rb`

2) customize paths and options in `hosts.js`, `paths.js` and `properties.js` files within the `build/grunt-config` folder

3) if needed, add/remove tasks by editing `build/Gruntfile.js`

_Note: compass and grunt configs are kept separate to allow standalone usage._

#WORKING WITH SOURCES 

Project sources are located into `application` folder. Don't edit files in `www` since they will be overwritten during build process.

**Application Structure**

	assets 
		+ fonts #Web Fonts
		+ images #Images
		+ javascripts #JavaScript files
		+ stylesheets #SASS files
	documents #Markdown files or any other txt-like file to be included in HTMLs
	fixtures #JSON files 
	views #HTML files
		+	partials #View partials
	*index*.html #Main views
	...

**View Partials**

View partials are rendered to `www` folder like every other file. To prevent rendering prepend a `_` to the filename.

**Vendors**

You may use [bower](http://bower.io/) to manage vendors. Anyway it's a good habit to checkin those files on your repository.


#DEV & BUILD

From project root
`cd build`
`grunt` (builds in development mode and watches for change)

Other Grunt tasks: 

* `serve` (same as default, also runs a static server on port 8000)
* `dev` (just development)
* `dist` (production ready build)
* `deploy:[staging|production]` (development / production build and deploy with rsync)

**Note**: when working with Phing remeber to set `buildOnly: false` in `build/grunt-config/properties` to delegate deploy tasks to Phing.


