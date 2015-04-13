/**
 * Watch for Changes
 * ===============================
 */
/*jshint node:true, camelcase:false */
module.exports = function (grunt, options) {

    var viewsTasks = [].concat(options.properties.engines.views);

    var stylesheetsTasks = ['_stylesheets:dev'];

    if (options.properties.styleguideDriven) {
        stylesheetsTasks.push('sassdown');
    }

	return {
        options: {
            //ensure we won't loose gruntfile reference
            //https://github.com/gruntjs/grunt-contrib-watch/issues/162#issuecomment-21288035
            cliArgs: ['--gruntfile', require('path').join(__dirname, '..', 'Gruntfile.js')]
        },
		images: {
			files: ['<%= paths.assets %>/images/{,*/}*.{png,jpg,jpeg,gif,svg,webp}'],
			tasks: ['newer:copy:images', 'newer:imagemin:svg']
		},
		js: {
			files: [
				'<%= paths.assets %>/javascripts/{,*/}*.js',
				'!<%= paths.assets %>/javascripts/{,*/}*.{spec,conf}.js'
			],
			tasks: ['newer:copy:js']
		},
        css: {
            files: ['<%= paths.sass %>/{,*/}*.{scss,sass}'],
            tasks: stylesheetsTasks
        },
		fonts: {
			files: ['<%= paths.assets %>/fonts/{,*/}*.{eot,svg,ttf,woff,woff2}'],
			tasks: ['newer:copy:fonts']
		},
        media: {
            files: ['<%= paths.assets %>/media/{,*/}*.*'],
            tasks: ['newer:copy:media']
        },
		views: {
			files: [
				'<%= paths.documents %>/*.md',
				'<%= paths.views %>/{,*/}*.*',
				'<%= paths.fixtures %>/*.json'
			],
			tasks: viewsTasks
		},
		livereload: {
			options: {
				livereload: '<%= hosts.devbox.ports.livereload %>'
			},
			files: [
				'<%= paths.html %>/{,*/}<%= properties.viewmatch %>',
				'<%= paths.css %>/{,*/}*.css',
				'<%= paths.fonts %>/{,*/}*.{eot,svg,ttf,woff,woff2}',
				'<%= paths.images %>/{,*/}*.{png,jpg,jpeg,gif,svg,webp}',
				'!<%= paths.images %>/rgbapng/*.png',
				'<%= paths.js %>/{,*/}*.js',
				'!<%= paths.js %>/{,*/}*.spec.js'
			]
		}
	};
};