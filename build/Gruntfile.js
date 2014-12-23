/**
 * Grunt build tasks
 */
/*jshint node:true, camelcase:false */
module.exports = function(grunt) {
    'use strict';

    var path = require('path'),
        //load configurations
        confPaths = grunt.file.readYAML(path.join(__dirname, 'grunt-config/paths.yml')),
        confHosts = grunt.file.readYAML(path.join(__dirname, 'grunt-config/hosts.yml')),
        confProperties = grunt.file.readYAML(path.join(__dirname, 'grunt-config/properties.yml')),
        _ = require('lodash'),
        gruntConfig;


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

    gruntConfig = require('load-grunt-config')(grunt, {
        configPath: path.join(process.cwd(), 'build', 'grunt-tasks'),
        init: false
    });



    // Project configuration.
    grunt.initConfig(_.extend(gruntConfig, {


        pkg: grunt.file.readJSON('package.json'),


        /**
         * Project Metadata
         * ===============================
         */
        meta: {
            // jscs:disable
            banner: "/* <%= pkg.description %> v<%= pkg.version %> - <%= pkg.author.name %> - Copyright <%= grunt.template.today('yyyy') %> <%= pkg.author.company %> */\n",
            vendorBanner: "/* <%= pkg.description %> v<%= pkg.version %> - <%= pkg.author.name %> - Vendor package */\n"
            // jscs:enable
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
        hosts: confHosts

    }));

    grunt.registerTask('default', 'Default task', function (server) {
        var tasks = ['dev'],
            connectDev = grunt.config.get('connect.dev');

        function pushMiddleware(middlewareConf, middlewareFn) {
            if (typeof middlewareConf === 'function') {
                var _oldMiddleWares = middlewareConf;
                return function(connect, options, middlewares) {
                    var mids = _oldMiddleWares(connect, options, middlewares);
                    // inject a custom middlewareConf into the array of default middlewares
                    mids.unshift(middlewareFn);
                    return mids;
                };
            } else if (Array.isArray(middlewareConf)) {
                middlewareConf.unshift(middlewareFn);
                return middlewareConf;
            } else {
                return function(connect, options, middlewares) {
                    // inject a custom middlewareConf into the array of default middlewares
                    middlewares.unshift(middlewareFn);
                    return middlewares;
                };
            }
        }

        if (grunt.config.get('properties.sync') === true) {
            var bs = require('browser-sync').init([], { logSnippet: false, port: grunt.config.get('hosts.devbox.ports.browsersync') });
            var browserSyncMiddleware = require('connect-browser-sync')(bs);
            connectDev.options.middleware = pushMiddleware(connectDev.options.middleware, browserSyncMiddleware);
        }

        if (grunt.config.get('properties.livereload') === true) {
            connectDev.options.livereload = grunt.config.get('hosts.devbox.ports.livereload');
        }

        if (grunt.config.get('properties.remoteDebug') === true) {

            //add weinre to the concurrent tasks list
            grunt.config.set('concurrent.dev', (grunt.config.get('concurrent.dev') || []).concat(['weinre:dev']));

            connectDev.options.middleware = pushMiddleware(connectDev.options.middleware, require('connect-weinre-injector')({
                port: grunt.config.get('hosts.devbox.ports.weinre')
            }));
        }

        grunt.config.set('connect.dev', connectDev);

        if (server === 'server') {
            tasks.push('connect:dev');
        }


        //this always comes last
        tasks.push('concurrent:dev');
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

        grunt.registerTask('deploy', 'Build and deploy the project', function(target) {
            if (!arguments.length) {
                grunt.fail.warn('Deploy target not specified: either staging or production', 3);
                return;
            }

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
