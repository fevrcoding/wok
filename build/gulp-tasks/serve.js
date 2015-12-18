/**
 * Development Server Task
 * ===============================
 */


module.exports = function (gulp, $, options) {

    var _ = require('lodash'),
        del = require('del'),
        path = require('path');

    var paths = options.paths,
        assetsPath = options.assetsPath,
        ports = options.hosts.devbox.ports,
        serverConfigDefault;



    function deleteListener(fileType) {

        return function (event) {
            var filePathFromSrc,
                destFilePath;

            if (event.type === 'deleted') {
                // Simulating the {base: 'src'} used with gulp.src in the scripts task
                filePathFromSrc = path.relative(assetsPath('src.' + fileType), event.path);

                // Concatenating the 'build' absolute path used by gulp.dest in the scripts task
                destFilePath = path.resolve(assetsPath('dist.' + fileType), filePathFromSrc);

                del.sync(destFilePath);
            }
        };
    }

    serverConfigDefault = {
        middleware: require('./lib/middlewares')(options),
        notify: false,
        ghostMode: false,
        port: ports.connect,
        server: {
            baseDir: options.paths.dist.root
        },
        snippetOptions: {
            async: true,
            whitelist: [],
            blacklist: [],
            rule: {
                match: /<\/head[^>]*>/i,
                fn: function (snippet, match) {
                    return ['<!--[if (gt IE 9) | (IEMobile)]><!-->', snippet, '<!--<![endif]-->', match].join("\n");
                }
            }
        }
    };

    if (!options.livereload) {
        serverConfigDefault.ui = false;
        serverConfigDefault.snippetOptions.rule.fn = function (snippet, match) {
            return match;
        };
    }

    //ensure proper exit on windows
    if (process.platform === 'win32') {
        process.on('SIGINT', function () {
            process.exit();
        });
    }

    // Watch Files For Changes & Reload
    gulp.task('serve', ['default'], function (done) {

        var browserSync = require('browser-sync').create(options.buildHash),
            serverConf = _.defaults({
                ui: {
                    port: 3001,
                    weinre: {
                        port: ports.weinre
                    }
                }
            }, serverConfigDefault);

        options.isWatching = true;

        browserSync.init(serverConf, function () {

            ['images', 'scripts', 'fonts', 'fonts', 'media', 'views'].forEach(function (task) {
                gulp.task(task + '-watch', [task], function (doneWatch) {
                    browserSync.reload();
                    doneWatch();
                });
            });

            gulp.watch([
                assetsPath('src.sass', '/**/*.{scss,sass}'),
                '!' + assetsPath('src.sass', '**/*scsslint_tmp*.{sass,scss}') //exclude scss lint files
            ], ['styles']);

            gulp.watch([assetsPath('src.images', '**/*.{png,jpg,gif,svg,webp}')], ['images-watch']).on('change', deleteListener('images'));
            gulp.watch([assetsPath('src.fonts', '**/*.{eot,svg,ttf,woff,woff2}')], ['fonts-watch']).on('change', deleteListener('fonts'));
            gulp.watch([assetsPath('src.video', '{,*/}*.*'), assetsPath('src.audio', '{,*/}*.*')], ['media-watch']);
            gulp.watch([
                assetsPath('src.js') + '/**/*.js',
                '!' + assetsPath('src.js') + '/**/*.{spec,conf}.js'
            ], ['scripts-watch']);
            gulp.watch([
                paths.src.views + '/{,*/}' + options.viewmatch,
                paths.src.documents + '/*.md',
                paths.src.fixtures + '/*.json'
            ], ['views-watch']);

        });

        process.on('exit', function () {
            browserSync.exit();
            done();
        });

    });

    //just a static server
    gulp.task('server', function (done) {

        var browserSync = require('browser-sync').create(options.buildHash),
            serverConf = _.defaults({
                logLevel: 'silent',
                open: false,
                ui: false
            }, serverConfigDefault);

        browserSync.init(serverConf, function () {
            $.util.log($.util.colors.green('Running a static server on port ' + ports.connect + '...'));
        });

        process.on('exit', function () {
            browserSync.exit();
            done();
        });

    });
};

