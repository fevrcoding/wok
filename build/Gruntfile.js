/**
 * Grunt build tasks
 */
/*jshint node:true */
module.exports = function(grunt) {
	'use strict';

	var path = require('path');

	grunt.file.setBase('../');

	//forcing `--gruntfile` flag to current Gruntfile.js
	//since using `.setBase` changes working folder and
	//concurrent tasks won't find Gruntfile.js anymore
	grunt.option('gruntfile', __filename);

	require('load-grunt-tasks')(grunt);

	// Project configuration.
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		/* rigt now this is useless... */
		meta: {
			banner: '/* <%= pkg.description %> v<%= pkg.version %> - <%= pkg.author.name %> - Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.company %> */\n'
		},

		/**
		 * Project Paths Configuration
		 * ===============================
		 */
		paths: {

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

			fixtures: '<%= paths.application %>/fixtures',

			sass: '<%= paths.assets %>/stylesheets',

			documents: '<%= paths.application %>/documents',

			partials: '<%= paths.application %>/partials',
			//rsync needs absolute path
			rsync: path.normalize(__dirname + '/../www')
		},

		/**
		 * Remote Hosts Configuration
		 * ===============================
		 */
		hosts: {
			staging: {
				host: 'devug.intesys.it',
				username: 'web',
				password: 'rezzonico',
				path: '/home/httpd/virtualhost'
			},

			production: {
				host: 'mississippi.intesys.it',
				username: 'web',
				password: 'rezzonico',
				path: '/home/httpd/virtualhost'
			},

			//remote host of developer box for mobile debug with weinre
			devbox: {
				host: 'pilcomayo.intesys.it',
				ports: {
					livereload: 35729,
					weinre: 8080
				}
			}
		},

		/**
		 * Clean Task
		 * ===============================
		 */
		clean: {
			options: {
				force: true
			},
			//.tmp ensures usemin defaut staging folder is removed
			//@see https://github.com/rafalgalka/grunt-usemin/commit/c59840e87841dc608340623c939ec74172e34241
			tmp: ['<%= paths.tmp %>', '.tmp'],
			images: ['<%= paths.images %>'],
			js: ['<%= paths.js %>'],
			css: ['<%= paths.css %>'],
			html: ['<%= paths.www %>/*.html']
		},

		/**
		 * Copy Task
		 * ===============================
		 */
		copy: {
			//dev only
			js: {
				expand: true,
				cwd: '<%= paths.assets %>/javascripts/',
				src: '**/*.js',
				dest: '<%= paths.js %>/'
			},
			images: {
				expand: true,
				cwd: '<%= paths.assets %>/images/',
				src: '**',
				dest: '<%= paths.images %>/'
			}
		},


		/**
		 * SASS Compilation Tasks
		 * ===============================
		 */
		compass: {

			options: {
				config: path.normalize(__dirname + '/compass.rb')
			},

			watch: {
				options: {
					watch: true,
				}
			},

			dev: {},

			dist: {
				options: {
					force: true,
					environment: 'production'
				}
			}
		},

		/**
		 * JS Concatenation Task
		 * (just banner other stuff is configured by usemin)
		 * ===============================
		 */
		concat: {
			options: {
				stripBanners: true,
				banner: '<%= meta.banner %>'
			}
		},


		/**
		 * JS Compression Task
		 * (just banner other stuff is configured by usemin)
		 * ===============================
		 */
		uglify: {
			options: {
				banner: '<%= meta.banner %>'
			}
		},


		/**
		 * CSS Minification Task
		 * (just banner other stuff is configured by usemin)
		 * ===============================
		 */
		cssmin: {
			options: {
				banner: '<%= meta.banner %>'
			}
		},


		/**
		 * Static EJS Render Task
		 * ===============================
		 */
		render: {
			html: {
				files: [
					{
						expand: true,
						cwd: '<%= paths.application %>/',
						src: ['*.html'],
						dest: '<%= paths.tmp %>',
						ext: '.html'
					}
				],
				options: {
					data: {
						devbox: '<%= hosts.devbox %>'
					},
					partialPaths: ['<%= paths.documents %>']
				}
			}
		},

		/**
		 * Find replace based on env vars
		 * ===============================
		 */
		preprocess: {

			dev: {
				files: [
					{
						expand: true,
						cwd: '<%= paths.tmp %>/',
						src: ['*.html'],
						dest: '<%= paths.www %>',
						ext: '.html'
					}
				]
			},

			dist: {
				options: {
					context: {
						PRODUCTION: true
					}
				},
				files: [
					{
						expand: true,
						cwd: '<%= paths.tmp %>/',
						src: ['*.html'],
						dest: '<%= paths.www %>',
						ext: '.html'
					}
				]
			}
		},

		/**
		 * Find replace based on envs
		 * ===============================
		 */
		/*
		devcode: {
			options: {
				html: true, // html files parsing?
				js: false, // javascript files parsing?
				css: false, // css files parsing?
				clean: true, // removes devcode comments even if code was not removed
				block: {
					open: 'devcode', // with this string we open a block of code
					close: 'endcode' // with this string we close a block of code
				},
				dest: 'dist' // default destination which overwrittes environment variable
			},
			dev: { // settings for task used with 'devcode:dev'
				options: {
					source: '<%= paths.tmp %>/',
					dest: '<%= paths.www %>/',
					env: 'development'
				}
			},
			html: { // settings for task used with 'devcode:html'
				options: {
					source: '<%= paths.tmp %>/statichtml',
					dest: '<%= paths.www %>/statichtml',
					env: 'development'
				}
			},
			dist: { // settings for task used with 'devcode:dist'
				options: {
					source: '<%= paths.tmp %>/',
					dest: '<%= paths.www %>',
					env: 'production'
				}
			}
		},*/

		useminPrepare: {
			options: {
				dest: '<%= paths.www %>',
				staging: '<%= paths.tmp %>'
			},
			html: ['<%= paths.www %>/*.html']
		},

		usemin: {
			options: {
				dirs: ['<%= paths.www %>']
			},
			html: ['<%= paths.www %>/*.html'],
			css: {
				src: ['<%= paths.css %>/{,*/}*.css'],
				options: {
					assetsDirs: ['<%= paths.www %>']
				}
			}
		},

		/**
		 * Deploy with rsync
		 * ===============================
		 */
		rsync: {
			options: {
				src: '<%= paths.rsync %>',
				recursive: true,
				compareMode: 'checksum',
				syncDestIgnoreExcl: true,
				args: ['--verbose', '--progress', '--cvs-exclude'],
				exclude: [
					'.svn*',
					'.tmp*',
					'.sass-cache*',
					'*.sublime-*'
				]
			},

			staging: {
				options: {
					dest: '<%= hosts.staging.path %>',
					host: '<%= hosts.staging.username %>@<%= hosts.staging.host %>'
				}
			},

			production: {
				options: {
					dest: '<%= hosts.production.path %>',
					host: '<%= hosts.production.username %>@<%= hosts.production.host %>'
				}
			}
		},


		/**
		 * Resize Retina images
		 * ===============================
		 */
		modernizr: {

			// [REQUIRED] Path to the build you're using for development.
			devFile: '<%= paths.vendor %>/modernizr/modernizr.js',

			// [REQUIRED] Path to save out the built file.
			outputFile: '<%= paths.vendor %>/modernizr/modernizr.min.js',

			// Based on default settings on http://modernizr.com/download/
			extra: {
				shiv: true,
				printshiv: false,
				load: true,
				mq: false,
				cssclasses: true
			},

			// Based on default settings on http://modernizr.com/download/
			extensibility: {
				addtest: false,
				prefixed: false,
				teststyles: false,
				testprops: false,
				testallprops: false,
				hasevents: false,
				prefixes: false,
				domprefixes: false
			},

			// By default, source is uglified before saving
			uglify: true,

			// Define any tests you want to impliticly include.
			tests: ['touch'],

			// By default, this task will crawl your project for references to Modernizr tests.
			// Set to false to disable.
			parseFiles: true,

			// When parseFiles = true, this task will crawl all *.js, *.css, *.scss files, except files that are in node_modules/.
			// You can override this by defining a 'files' array below.
			files : [
				'<%= paths.js %>/**/*.js',
				'!<%= paths.js %>/**/*.min.js',
				'<%= paths.css %>/application.css'
			],

			// When parseFiles = true, matchCommunityTests = true will attempt to
			// match user-contributed tests.
			matchCommunityTests: false,

			// Have custom Modernizr tests? Add paths to their location here.
			customTests: []
		},

		/**
		 * Shrink images
		 * ===============================
		 */
		imagemin: {
			options: {
				progressive: false
			},
			images: {
				files: [
					{
						expand: true, // Enable dynamic expansion
						cwd: '<%= paths.assets %>/images/', // Src matches are relative to this path
						src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
						dest: '<%= paths.images %>/' // Destination path prefix
					}
				]
			}
		},

		/**
		 * Add revision number to static resources
		 * ===============================
		 */

		filerev: {
			images: {
				src: ['<%= paths.images %>/**/*.{png,jpg,gif}']
			},
			js: {
				src: ['<%= paths.js %>/**/*.min.js']
			},
			css: {
				src: ['<%= paths.css %>/**/*.css']
			}
		},

		/**
		 * Watch Task (used internally)
		 * ===============================
		 */
		watch: {
			// compass: {
			// 	files: ['<%= paths.images %>/**/*', '<%= paths.sass %>/**/*.sass'],
			// 	tasks: ['compass:dev']
			// },
			images: {
				files: ['<%= paths.assets %>/images/**/*.{png,jpg,jpeg,gif}'],
				tasks: ['imagemin']
			},
			js: {
				files: ['<%= paths.assets %>/javascripts/{,*/}*.js'],
				tasks: ['copy:js']

			},
			app: {
				files: ['<%= paths.documents %>/*.md','<%= paths.application %>/*.html', '<%= paths.partials %>/*.html', '<%= paths.fixtures %>/*.json'],
				tasks: ['render', 'preprocess:dev']
			},
			livereload: {
				options: {
					livereload: '<%= hosts.devbox.ports.livereload %>'
				},
				files: [
					'<%= paths.www %>/*.html',
					'<%= paths.css %>/{,*/}*.css',
					'<%= paths.images %>/**/*.{png,jpg,jpeg,gif}',
					'<%= paths.js %>/{,*/}*.js'
				]
			}
		},


		/**
		 * Weinre Mobile Debug server Tasks
		 * ===============================
		 * TODO
		 */
		weinre: {
			dev: {
				options: {
					boundHost: '-all-',
					httpPort: 8080,
					verbose: true
				}
			}
		},

		/**
		 * Concurrent Tasks
		 * ===============================
		 */
		concurrent: {
			options: {
				limit: 3,
				logConcurrentOutput: true
			},
			dev: ['watch', 'compass:watch']
		}
	});



	//grunt.registerTask('default', ['dev', 'concurrent:dev']);

	grunt.registerTask('default', 'Default task', function (target) {
		if (target === 'weinre') {
			var concurrent = grunt.config.get('concurrent.dev');

			concurrent.push('weinre:dev');

			grunt.config.set('concurrent.dev', concurrent);

		}
		grunt.task.run(['dev', 'concurrent:dev']);
	});

	grunt.registerTask('dev',[
		'clean',
		'copy',
		'compass:dev',
		'render',
		'preprocess:dev'
		//'devcode:dev'
	]);

	grunt.registerTask('dist', [
		'clean',
		'copy:js',
		'imagemin',
		'compass:dist',
		'render',
		'preprocess:dist',
		//'devcode:dist',
		'useminPrepare',
		'concat',
		'uglify',
		'cssmin',
		'filerev',
		'usemin',
		'modernizr'
	]);

	grunt.registerTask('deploy', 'Build and deploy the project', function(target) {
		if (!arguments.length) {
			grunt.fail.warn('Deploy target not specified: either staging or production', 3);
		} else if (target === 'staging') {
			grunt.task.run(['dev', 'rsync:staging']);
		} else if (target === 'production') {
			grunt.task.run(['dist', 'rsync:production']);
		}

	});
};