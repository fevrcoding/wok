/*jshint node:true */


module.export = {

	//NOTE: folders are relative to project root folder

	application: 'application',

	assets: '<%= paths.application %>/assets',

	www: 'www',

	vendor: '<%= paths.www %>/vendor',

	tmp: 'var/tmp',
	//images folder name
	images: '<%= paths.www %>/images',
	//where to store built files
	js: '<%= paths.www %>/javascripts',

	css: '<%= paths.www %>/stylesheets',

	//where to put files in paths.views after processing them...
	//publicView: '<%= paths.www %>',

	fixtures: '<%= paths.application %>/fixtures',

	sass: '<%= paths.assets %>/stylesheets',

	documents: '<%= paths.application %>/documents',

	views: '<%= <%= paths.application %>/views',

	partials: '<%= paths.views %>/partials',

	//don't use grunt templates here
	rsync: 'www'
};