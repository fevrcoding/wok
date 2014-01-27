> OK, this is a rather original folder setup... here are some docs to make it work

#INSTALL DEPENDENCIES

Requirements

* Node 0.10+
* Ruby
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


#DEV & BUILD



From project root
`cd build`
`grunt` (builds in development mode and watches for change)

Other Grunt tasks: 

* `dev` (just development)
* `dist` (production ready build)
* `deploy:[staging|production]` (development / production build and deploy with rsync)

