/**
 * Watch for Changes
 * ===============================
 */
/*jshint node:true */
module.exports = function (grunt, options) {

    var viewsTasks = [].concat(options.properties.engines.views);

    var stylesheetsTasks = ['_stylesheets:dev', 'postcss:legacydev'];

    if (options.properties.styleguideDriven) {
        stylesheetsTasks.push('sassdown');
    }

	return {
		images: {
			files: ['<%= paths.src.assets %>/<%= paths.images %>/{,*/}*.{png,jpg,jpeg,gif,svg,webp}'],
			tasks: ['newer:copy:images', 'newer:imagemin:svg']
		},
		js: {
			files: [
				'<%= paths.src.assets %>/<%= paths.js %>/{,*/}*.js',
				'!<%= paths.src.assets %>/<%= paths.js %>/{,*/}*.{spec,conf}.js'
			],
			tasks: ['newer:copy:js']
		},
        css: {
            files: ['<%= paths.src.assets %>/<%= paths.sass %>/{,*/}*.{scss,sass}'],
            tasks: stylesheetsTasks
        },
		fonts: {
			files: ['<%= paths.src.assets %>/<%= paths.fonts %>/{,*/}*.{eot,svg,ttf,woff,woff2}'],
			tasks: ['newer:copy:fonts']
		},
        media: {
            files: ['<%= paths.src.assets %>/{audio,video}/{,*/}*.*'],
            tasks: ['newer:copy:media']
        },
		views: {
			files: [
				'<%= paths.src.documents %>/*.md',
				'<%= paths.src.views %>/{,*/}*.*',
				'<%= paths.src.fixtures %>/*.json'
			],
			tasks: viewsTasks
		},
		livereload: {
			options: {
				livereload: '<%= hosts.devbox.ports.livereload %>'
			},
			files: [
				'<%= paths.dist.views %>/{,*/}<%= properties.viewmatch %>',
				'<%= paths.dist.assets %>/<%= paths.css %>/{,*/}*.css',
				'<%= paths.dist.assets %>/<%= paths.fonts %>/{,*/}*.{eot,svg,ttf,woff,woff2}',
				'<%= paths.dist.assets %>/<%= paths.images %>/{,*/}*.{png,jpg,jpeg,gif,svg,webp}',
				'<%= paths.dist.assets %>/<%= paths.js %>/{,*/}*.js',
				'!<%= paths.dist.assets %>/<%= paths.js %>/{,*/}*.spec.js'
			]
		}
	};
};