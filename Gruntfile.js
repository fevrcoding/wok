/**
 * Grunt build tasks
 */
/*jshint node:true, camelcase:false */
module.exports = function(grunt) {
    'use strict';

    var path = require('path'),
        //load configurations
        confPaths = grunt.file.readYAML(path.join(__dirname, 'build/grunt-config/paths.yml')),
        confHosts = grunt.file.readYAML(path.join(__dirname, 'build/grunt-config/hosts.yml')),
        confProperties = grunt.file.readYAML(path.join(__dirname, 'build/grunt-config/properties.yml')),
        _ = require('lodash'),
        gruntConfig;


    //force base folder
    grunt.file.setBase(__dirname);

    //forcing `--gruntfile` flag to current Gruntfile.js
    //since using `.setBase` changes working folder and
    //concurrent tasks won't find Gruntfile.js anymore
    grunt.option('gruntfile', __filename);

    //require all the thing
    require('time-grunt')(grunt);

    try {
        //sassdown might be unavailable...
        require.resolve('sassdown') && grunt.loadNpmTasks('sassdown');
    } catch (e) {

    }

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

    gruntConfig = require('load-grunt-config')(grunt, {

        jitGrunt: {
            staticMappings: {
                notify_hooks: 'grunt-notify',
                usebanner: 'grunt-banner',
                useminPrepare: 'grunt-usemin',
                render: 'grunt-tmpl-render'
            }
        },
        configPath: path.join(process.cwd(), 'build', 'grunt-tasks'),
        data: {


            pkg: grunt.file.readJSON('package.json'),


            /**
             * Project Metadata (unused)
             * ===============================
             */
            meta: {},

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
            hosts: confHosts

        }
    });



    if (confProperties.notify) {
        grunt.task.run('notify_hooks');
    }


    ['views', 'stylesheets'].forEach(function (buildSection) {
        var engine = confProperties.engines[buildSection];
        grunt.registerTask('_' + buildSection, function (target) {
            var tasks = [];
            if (Array.isArray(engine)) {
                tasks = engine.map(function (eng) {
                    return eng + ':' + (target || 'dev');
                });
            } else {
                tasks = engine + ':' + (target || 'dev');
            }
            grunt.task.run(tasks);
        });
    });

    grunt.registerTask('default', 'Default task', function (target) {
        var tasks = ['dev'],
            properties = grunt.config.get('properties'),
            connectOpts = grunt.config.get('connect.dev.options'),
            ports = grunt.config.get('hosts.devbox.ports');

        function pushMiddleware(middlewareConf, middlewareFn) {
            if (_.isFunction(middlewareConf)) {
                return _.wrap(middlewareConf, function(oldMiddleWares) {
                    var mids = oldMiddleWares.apply(oldMiddleWares, _.toArray(arguments).slice(1));
                    // inject a custom middlewareConf into the array of default middlewares
                    mids.unshift(middlewareFn);
                    return mids;
                });
            } else if (Array.isArray(middlewareConf)) {
                return [middlewareFn].concat(middlewareConf);
            } else {
                return function(connect, options, middlewares) {
                    // inject a custom middlewareConf into the array of default middlewares
                    middlewares.unshift(middlewareFn);
                    return middlewares;
                };
            }
        }

        if (properties.sync) {
            var bs = require('browser-sync').init([], { logSnippet: false, port: ports.browsersync });
            var browserSyncMiddleware = require('connect-browser-sync')(bs);
            connectOpts.middleware = pushMiddleware(connectOpts.middleware, browserSyncMiddleware);
        }

        if (properties.livereload) {
            connectOpts.livereload = ports.livereload;
        }
        if (properties.remoteDebug) {
            //add weinre to the concurrent tasks list
            grunt.config.set('concurrent.dev', (grunt.config.get('concurrent.dev') || []).concat(['weinre:dev']));
            connectOpts.middleware = pushMiddleware(connectOpts.middleware, require('connect-weinre-injector')({
                port: ports.weinre
            }));
        }

        grunt.config.set('connect.dev.options', connectOpts);

        if (target === 'server') {
            tasks.push('connect:dev');
        }

        //this always comes last
        //also if we are running just one task, we don't need concurrency
        var concurrentTasks = grunt.config.get('concurrent.dev');
        if (Array.isArray(concurrentTasks) && concurrentTasks.length === 1) {
            tasks.push(concurrentTasks[0]);
        } else {
	        tasks.push('concurrent:dev');
        }

        grunt.task.run(tasks);

    });

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

        grunt.registerTask('remoteexec', function (command, target) {
            var tasks = {
                    'deploy:staging': ['dev', 'sshexec:backup', 'rsync:staging'],
                    'deploy:production': ['dist', 'sshexec:backup', 'rsync:production'],
                    'rollback:staging': ['sshexec:rollback'],
                    'rollback:production': ['sshexec:rollback']
                },
                execTarget = 'sshexec.' + (command === 'deploy' ? 'backup' : 'rollback');

            if (!arguments.length) {
                grunt.fail.warn('Target for command `' + command + '`not specified: either staging or production', 3);
                return;
            }

            grunt.config.set(execTarget + '.options', grunt.config.get('hosts.' + target));
            grunt.config.set(execTarget + '.command', 'cd <%= hosts.' + target + '.path %>; ' + grunt.config.get(execTarget + '.command'));
            grunt.task.run(tasks[command + ':' + target]);

        });

        grunt.registerTask('deploy', function(target) {
            grunt.task.run(['remoteexec:deploy:' + target]);
        });
        grunt.registerTask('rollback', function(target) {
            grunt.task.run(['remoteexec:rollback:' + target]);
        });

    }


};
