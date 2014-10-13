/**
 * Grunt build tasks
 */
/*jshint node:true, camelcase:false */
module.exports = function(grunt) {
    'use strict';

    var path = require('path'),
        //load configurations
        //confPaths = require('./grunt-config/paths.js'),
        //confHosts = require('./grunt-config/hosts.js'),
        //confProperties = require('./grunt-config/properties.js'),
        confPaths = grunt.file.readYAML('./grunt-config/paths.yml'),
        confHosts = grunt.file.readYAML('./grunt-config/hosts.yml'),
        confProperties = grunt.file.readYAML('./grunt-config/properties.yml'),
        loremIpsum = require('lorem-ipsum');


    //up a folder to the project root
    grunt.file.setBase(path.resolve(__dirname, '..'));


    if (grunt.file.exists('.bowerrc')) {
        confPaths.vendor = grunt.file.readJSON('.bowerrc').directory;
    }

    //forcing `--gruntfile` flag to current Gruntfile.js
    //since using `.setBase` changes working folder and
    //concurrent tasks won't find Gruntfile.js anymore
    grunt.option('gruntfile', __filename);

    //require all the thing
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('sassdown');

    //if `--base` argument is passed in
    //switch to the build folder
    //cannot be done earlier since when working on Phing etc
    //node_modules aren't checked in nor installed
    if (grunt.option('base')) {
        grunt.file.setBase(grunt.option('base'));
    }

    //make rsync path absolute
    if (confPaths.hasOwnProperty('rsync')) {
        confPaths.relRsync = confPaths.rsync;
        confPaths.rsync = path.join(process.cwd(), confPaths.rsync);
    }

    // Project configuration.
    grunt.initConfig({


        pkg: grunt.file.readJSON('package.json'),


        /**
         * Project Metadata
         * ===============================
         */
        meta: {
            banner: '/* <%= pkg.description %> v<%= pkg.version %> - <%= pkg.author.name %> - Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.company %> */\n',
            vendorBanner: '/* <%= pkg.description %> v<%= pkg.version %> - <%= pkg.author.name %> - Vendor package */\n',
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
            fonts: ['<%= paths.fonts %>'],
            html: ['<%= paths.html %>/<%= properties.viewmatch %>', '<%= paths.html %>/partials'], //html in root and whole partials folder
            revmap: ['<%= paths.revmap %>'],
            styleguide: ['<%= paths.www %>/styleguide'],
            vendor: ['<%= paths.vendor %>/vendor.min{,.*}.js',  '<%= paths.vendor %>/dist']
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
                //exclude specs and config files
                src: ['**/*.js', '!**/*.{spec,conf}.js'],
                dest: '<%= paths.js %>/'
            },
            images: {
                expand: true,
                cwd: '<%= paths.assets %>/images/',
                src: '**',
                dest: '<%= paths.images %>/'
            },
            fonts: {
                expand: true,
                cwd: '<%= paths.assets %>/fonts/',
                src: '**/*.{eot,svg,ttf,woff}',
                dest: '<%= paths.fonts %>/'
            }
        },


        /**
         * SASS Compilation Tasks
         * ===============================
         */
        compass: {

            options: {
                config: path.normalize(process.cwd() + '/build/compass.rb'),
                bundleExec: grunt.file.exists(path.join(process.cwd(), 'Gemfile'))
            },

            watch: {
                options: {
                    watch: true
                }
            },

            dev: {},

            dist: {
                options: {
                    force: true,
                    environment: 'production',
                    outputStyle: 'expanded' //there's an external task to minify css
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
            },

            vendors: {
                options: {
                    stripBanners: false,
                    banner: '<%= meta.vendorBanner %>'
                },
                files: []
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
         * (just options and banner other stuff is configured by usemin)
         * @see https://github.com/twbs/bootstrap/blob/master/Gruntfile.js#L188
         * ===============================
         */
        cssmin: {
            options: {
                banner: '<%= meta.banner %>',
                noAdvanced: true, // turn advanced optimizations off until the issue is fixed in clean-css
                selectorsMergeMode: 'ie8'
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
                    },
                    getAsset: function (relPath, type) {
                        var www = grunt.config.get('paths.www'),
                            regexp = new RegExp('^' +(www || 'www') + '\\\/'),
                            assetPath = grunt.config.get('paths.' + (type || 'images')) || '';

                        return assetPath.replace(regexp, '/') + relPath;
                    },
                    lorem: function (min, max, config) {
                        var _ = this._;
                        var count = max ? _.random(min, max) : min;
                        var defaults = {
                            units: 'words',
                            count: count
                        };
                        var conf = _.defaults(config || {}, defaults);

                        return loremIpsum(conf);
                    }
                },
                //custom option object. to be used to switch between env related blocks
                env: {}
            },
            html: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= paths.views %>/',
                        src: ['{,partials/}<%= properties.viewmatch %>', '!{,partials/}_*.*'], //render all views except those starting with `_` ala SASS
                        dest: '<%= paths.html %>'
                    }
                ],
                options: {
                    data: ['<%= paths.fixtures %>/{,*/}*.json'],
                    partialPaths: ['<%= paths.documents %>', '<%= paths.views %>/partials']
                }
            }
        },


        /**
         * Replace/remove refs to development resources
         * Overwrites source files
         * ===============================
         */
        htmlrefs: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= paths.usemin %>/',
                        src: ['**/<%= properties.viewmatch %>'],
                        dest: '<%= paths.usemin %>'
                    }
                ],
                options: {
                    includes: {}
                }
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
                staging: '<%= paths.tmp %>',
                flow: {
                    // i'm using this config for all targets, not only 'html'
                    steps: {
                        concat: ['concat'],
                        js: ['concat', 'uglifyjs'],
                        css: ['concat', 'cssmin']
                    },
                    // also you MUST define 'post' field to something not null
                    post: {}
                }
            },
            html: ['<%= paths.usemin %>/**/<%= properties.viewmatch %>']
        },

        usemin: {
            options: {
                assetsDirs: ['<%= paths.www %>'],
                blockReplacements: {
                    concat: function (block) {
                        return '<script src="' + block.dest + '"></script>';
                    }
                }
            },
            html: ['<%= paths.usemin %>/**/<%= properties.viewmatch %>'],
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
         * Remote SSH commands
         * ===============================
         */
        sshexec: {
            backup: {
                command: [
                    'mkdir -p <%= paths.backup %>',
                    'filecount=$(ls -t <%= paths.backup %> | grep .tgz | wc -l)',
                    'if [ $filecount -gt 2 ];' +
                        'then for file in $(ls -t <%= paths.backup %> | grep .tgz | tail -n $(($filecount-2)));' +
                            'do rm <%= paths.backup %>/$file;' +
                            'done;' +
                    'fi',
                    'if [ -d <%= paths.relRsync %> ]; then ' +
                        'tar -cpzf <%= paths.backup %>/backup-<%= new Date().getTime() %>.tgz ' +
                            '<%= grunt.config.get("rsync.options.exclude").map(function (exc) { return " --exclude=\'" + exc + "\'";}).join(" ") %> <%= paths.relRsync %>',
                    'fi;'
                ].join('; ')
            },
            rollback: {
                command: [
                    'if [ -d <%= paths.backup %> ];then ' +
                        'rm -rf <%= paths.relRsync %>/;' +
                        'for file in $(ls -tr <%= paths.backup %> | tail -n 1);' +
                            'do tar -xzpf <%= paths.backup %>/$file;' +
                            'rm <%= paths.backup %>/$file;' +
                            'done;' +
                    'fi;'
                ].join('; ')
            }
        },


        /**
         * Resize Retina images
         * ===============================
         */
        modernizr: {

            dist: {

                // [REQUIRED] Path to the build you're using for development.
                devFile: '<%= paths.vendor %>/modernizr/modernizr.js',

                // [REQUIRED] Path to save out the built file.
                outputFile: '<%= paths.vendor %>/dist/modernizr.min.js',

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
                files : {
                    src: [
                        '<%= paths.js %>/**/*.js',
                        '!<%= paths.js %>/**/*.min.js',
                        '<%= paths.css %>/application{,-ie}.css'
                    ]
                },

                // When parseFiles = true, matchCommunityTests = true will attempt to
                // match user-contributed tests.
                matchCommunityTests: false,

                // Have custom Modernizr tests? Add paths to their location here.
                customTests: []
            }
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
                        cwd: '<%= paths.images %>/', // Src matches are relative to this path
                        src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
                        dest: '<%= paths.images %>/' // Destination path prefix
                    }
                ]
            }
        },



        /**
         * Shrink SVGs
         * ===============================
         */
        svgmin: {
            options: {
                plugins: [{
                    removeViewBox: false
                }]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= paths.images %>/',
                        src: ['**/*.svg'],
                        dest: '<%= paths.images %>/'
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
                //application files and concatenated vendors
                src: ['<%= paths.js %>/**/*.min.js', '<%= paths.vendor %>/dist/*.min.js', '<%= paths.vendor %>/vendor.min.js']
            },
            css: {
                src: ['<%= paths.css %>/**/*.css']
            }
        },

        filerev_assets: {
            assets: {
                options: {
                    dest: '<%= paths.revmap %>',
                    cwd: '<%= paths.www %>/',
                    prefix: ''
                }
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
                commentStart: /\/\* (?:[=]{4,}\n+[ ]+|(?!\n))/,
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
                files: ['<%= paths.assets %>/images/{,*/}*.{png,jpg,jpeg,gif}'],
                tasks: ['copy:images']
            },
            js: {
                files: ['<%= paths.assets %>/javascripts/{,*/}*.js', '!<%= paths.assets %>/javascripts/{,*/}*.{spec,conf}.js'],
                tasks: ['newer:copy:js']

            },
            fonts: {
                files: ['<%= paths.assets %>/fonts/{,*/}*.{eot,svg,ttf,woff}'],
                tasks: ['newer:copy:fonts']

            },
            app: {
                files: ['<%= paths.documents %>/*.md', '<%= paths.views %>/{,*/}<%= properties.viewmatch %>', '<%= paths.fixtures %>/*.json'],
                tasks: ['render']
            },
            livereload: {
                options: {
                    livereload: '<%= hosts.devbox.ports.livereload %>'
                },
                files: [
                    '<%= paths.html %>/{,partials/}<%= properties.viewmatch %>',
                    '<%= paths.css %>/{,*/}*.css',
                    '<%= paths.images %>/{,*/}*.{png,jpg,jpeg,gif}',
                    '!<%= paths.images %>/rgbapng/*.png',
                    '<%= paths.js %>/{,*/}*.js',
                    '!<%= paths.js %>/{,*/}*.spec.js'
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
                base: ['<%= paths.www %>', '<%= paths.html %>']
            },
            server: {
                options: {
                    keepalive: true
                }
            },
            dev: {}
        },



        /**
         * Weinre Mobile Debug server Tasks
         * ===============================
         */
        weinre: {
            dev: {
                options: {
                    boundHost: '-all-',
                    httpPort: '<%= hosts.devbox.ports.weinre %>',
                    verbose: true
                }
            }
        },


        browserSync: {
            dev: {
                bsFiles: {
                    src : '<%= watch.livereload.files %>'
                },
                options: {
                    watchTask: true
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
        },


        /**
         * Package Data Management Tasks
         * ===============================
         */
        bumpup: {
            options: {
                updateProps: {
                    pkg: 'package.json'
                }
            },
            files: ['package.json', 'bower.json']
        }

    });


    grunt.registerTask('dev',[
        'clean',
        'copy',
        'compass:dev',
        'render',
        'sassdown'
    ]);

    grunt.registerTask('dist', function () {
        //don't print livereload/browsersync/weinre scripts
        grunt.config.merge({
            'properties': {
                'sync': false,
                'livereload': false,
                'remoteDebug': false
            }
        });
        grunt.task.run([
            'clean',
            'copy:js',
            'copy:fonts',
            'copy:images',
            'imagemin',
            'compass:dist',
            'render',
            'htmlrefs:dist',
            'useminPrepare',
            'concat',
            'uglify',
            'cssmin',
            'modernizr',
            'filerev',
            'filerev_assets',
            'usemin'
        ]);
    });

    grunt.registerTask('default', 'Default task', function () {
        var tasks = ['dev'];

        if (grunt.config.get('properties.sync') === true) {
            grunt.config.set('properties.livereload', false);
            grunt.config.set('watch.livereload.options.livereload', false);
            tasks.push('browserSync');
        }

        Array.prototype.forEach.call(arguments, function (arg) {

            if (arg === 'weinre' || grunt.config.get('properties.remoteDebug') === true) {

                var concurrent = grunt.config.get('concurrent.dev');

                concurrent.push('weinre:dev');
                grunt.config.set('concurrent.dev', concurrent);

            }

            if (arg === 'server') {
                tasks.push('connect:dev');
            }

        });

        //this always comes last
        tasks.push('concurrent:dev');
        grunt.task.run(tasks);

    });

    grunt.registerTask('serve', ['default:server']);


    if (confProperties.buildOnly) {

        grunt.registerTask('build', 'Build the project', function(target, grunthash) {

            var testHash = require('crypto').createHash('md5').update(grunt.file.read(__filename)).digest('hex');

            if (arguments.length < 2) {
                grunt.fail.warn('Cannot run this task directly', 3);
                return;
            }
            if (testHash !== grunthash) {
                grunt.fail.warn('Safety hash check not passed', 3);
                return;
            }
            if (target === 'staging' || target === 'preview') {
                grunt.task.run(['dev']);
            } else if (target === 'production') {
                grunt.task.run(['dist']);
            }

        });

    } else {

        grunt.registerTask('deploy', 'Build and deploy the project', function(target) {
            if (!arguments.length) {
                grunt.fail.warn('Deploy target not specified: either staging or production', 3);
                return;
            }
            //don't print livereload/browsersync/weinre scripts
            grunt.config.merge({
                'properties': {
                    'sync': false,
                    'livereload': false,
                    'remoteDebug': false
                }
            });

            if (target === 'staging') {

                grunt.config.set('sshexec.backup.options', grunt.config.get('hosts.staging'));
                grunt.config.set('sshexec.backup.command', 'cd <%= hosts.staging.path %>; ' + grunt.config.get('sshexec.backup.command'));
                grunt.task.run(['dev', 'sshexec:backup', 'rsync:staging']);

            } else if (target === 'production') {

                grunt.config.set('sshexec.backup.options', grunt.config.get('hosts.production'));
                grunt.config.set('sshexec.backup.command', 'cd <%= hosts.production.path %>; ' + grunt.config.get('sshexec.backup.command'));
                grunt.task.run(['dist', 'sshexec:backup', 'rsync:production']);

            }

        });

        grunt.registerTask('rollback', 'Restores the previous version of the application', function(target) {
            if (!arguments.length) {
                grunt.fail.warn('Rollback target not specified: either staging or production', 3);
            } else if (target === 'staging') {

                grunt.config.set('sshexec.rollback.options', grunt.config.get('hosts.staging'));
                grunt.config.set('sshexec.rollback.command', 'cd <%= hosts.staging.path %>; ' + grunt.config.get('sshexec.rollback.command'));

            } else if (target === 'production') {

                grunt.config.set('sshexec.rollback.options', grunt.config.get('hosts.production'));
                grunt.config.set('sshexec.rollback.command', 'cd <%= hosts.production.path %>; ' + grunt.config.get('sshexec.rollback.command'));
            }
            grunt.task.run(['sshexec:rollback']);

        });

    }


};
