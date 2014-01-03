/**
 * Grunt build tasks
 */
/*jshint node:true */
module.exports = function(grunt) {
	'use strict';

	var path = require('path'),
		//load configurations
		confPaths = require('./grunt-config/paths.js'),
		confHosts = require('./grunt-config/hosts.js'),
		confProperties = require('./grunt-config/properties.js');

	grunt.file.setBase('../');

	//forcing `--gruntfile` flag to current Gruntfile.js
	//since using `.setBase` changes working folder and
	//concurrent tasks won't find Gruntfile.js anymore
	grunt.option('gruntfile', __filename);

	//make rsync path absolute
	if (confPaths.hasOwnProperty('rsync')) {
		confPaths.rsync = path.normalize(__dirname + '/../' + confPaths.rsync);
	}



	require('load-grunt-tasks')(grunt);

	grunt.loadNpmTasks('sassdown');

	// Project configuration.
	grunt.initConfig({


		pkg: grunt.file.readJSON('package.json'),


		/**
		 * Project Metadata
		 * ===============================
		 */
		meta: {
			banner: '/* <%= pkg.description %> v<%= pkg.version %> - <%= pkg.author.name %> - Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.company %> */\n'
		},

		properties: confProperties,


		/**
		 * Project Paths Configuration
		 * ===============================
		 */
		paths: confPaths,


		/**
		 * Remote Hosts Configuration
		 * ===============================
		 */
		hosts: confHosts,


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
			html: ['<%= paths.html %>/<%= properties.viewmatch %>'],
			styleguide: ['<%= paths.www %>/styleguide']
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
			options: {
				helpers: {
					getConfig : function (prop) {
						return grunt.config.get(prop);
					}
				}
			},
			html: {
				files: [
					{
						expand: true,
						cwd: '<%= paths.application %>/views/',
						src: ['<%= properties.viewmatch %>'],
						dest: '<%= paths.tmp %>'
					}
				],
				options: {
					data: ['<%= paths.fixtures %>/{,*/}*.json'],
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
						src: ['<%= properties.viewmatch %>'],
						dest: '<%= paths.html %>'
					}
				]
			},

			dist: {
				options: {
					context: {
						PRODUCTION: true
					}
				},
				files: '<%= preprocess.dev.files %>'
			}
		},


		/**
		 * Building and Minifying
		 * ===============================
		 */
		useminPrepare: {
			options: {
				root: '<%= paths.www %>',
				dest: '<%= paths.www %>',
				staging: '<%= paths.tmp %>'
			},
			html: ['<%= paths.html %>/<%= properties.viewmatch %>']
		},

		usemin: {
			options: {
					assetsDirs: ['<%= paths.www %>']
			},
			html: ['<%= paths.html %>/<%= properties.viewmatch %>'],
			css: ['<%= paths.css %>/{,*/}*.css']
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
		 * Live styleguide generation
		 * ===============================
		 */
		sassdown: {
			options: {
				assets: ['<%= paths.css %>/**/*.css'],
				excludeMissing: true,
				readme: 'README.md',
				baseUrl: '/styleguide/',
				commentStart: /\/\* (?:[=]{4,}\n[ ]+|(?!\n))/,
				commentEnd: /[ ]+[=]{4,} \*\//
			},
			styleguide: {
				files: [{
                    expand: true,
                    cwd: '<%= paths.sass %>',
                    src: ['**/*.{sass,scss}'],
                    dest: '<%= paths.www %>/styleguide/'
                }]
			}
		},


		/**
		 * Watch Task (used internally)
		 * ===============================
		 */
		watch: {
			images: {
				files: ['<%= paths.assets %>/images/**/*.{png,jpg,jpeg,gif}'],
				tasks: ['imagemin']
			},
			js: {
				files: ['<%= paths.assets %>/javascripts/{,*/}*.js'],
				tasks: ['copy:js']

			},
			app: {
				files: ['<%= paths.documents %>/*.md', '<%= paths.views %>/**/<%= properties.viewmatch %>', '<%= paths.fixtures %>/*.json'],
				tasks: ['render', 'preprocess:dev']
			},
			livereload: {
				options: {
					livereload: '<%= hosts.devbox.ports.livereload %>'
				},
				files: [
					'<%= paths.html %>/<%= properties.viewmatch %>',
					'<%= paths.css %>/{,*/}*.css',
					'<%= paths.images %>/**/*.{png,jpg,jpeg,gif}',
					'<%= paths.js %>/{,*/}*.js'
				]
			}
		},

		/**
		 * Standalone Static Server
		 * ===============================
		 */
		connect: {
			options: {
				hostname: '*',
				port: '<%= hosts.devbox.ports.connect %>',
				base: ['<%= paths.www %>']
			},
			server: {
				options: {
					keepalive: true
				}
			}
		},



		/**
		 * Weinre Mobile Debug server Tasks
		 * ===============================
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
		'preprocess:dev',
		'sassdown'
	]);

	grunt.registerTask('dist', [
		'clean',
		'copy:js',
		'imagemin',
		'compass:dist',
		'render',
		'preprocess:dist',
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