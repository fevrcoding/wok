/*jshint node:true */


module.exports = {

	//NOTE: folders are relative to project root folder

	application: 'application',

	assets: '<%= paths.application %>/assets',

	fixtures: '<%= paths.application %>/fixtures',

	sass: '<%= paths.assets %>/stylesheets',

	documents: '<%= paths.application %>/documents',

	views: '<%= paths.application %>/views',

	partials: '<%= paths.views %>/partials',

	www: 'www',

	//images folder name
	images: '<%= paths.www %>/images',

	//where to store built files
	js: '<%= paths.www %>/javascripts',

	css: '<%= paths.www %>/stylesheets',

	fonts: '<%= paths.www %>/fonts',

	//map of revved files
	revmap: '<%= paths.www %>/assets-map.json',

	//where static files are to be saved
	html: '<%= paths.www %>',

	//path to views to be processed by usemin/htmlrefs
	usemin: '<%= paths.html %>',

	//don't use grunt templates here
	rsync: 'www',

	//overrode by .bowerc if available
	vendor: '<%= paths.www %>/vendor',

	tmp: 'var/tmp'
};