/**
 * Development Server Task
 * ===============================
 */


module.exports = function (gulp, $, options) {

    var spawn = require('child_process').spawn,
        browserSync = require('browser-sync').create(options.buildHash);

    var paths = options.paths,
        assetsPath = options.assetsPath,
        ports = options.hosts.devbox.ports,
        browserSyncConfig;


    browserSyncConfig = {
        notify: false,
        port: ports.connect,
        ui: {
            port: 3001,
            weinre: {
                port: ports.weinre
            }
        },
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
        browserSyncConfig.ghostMode = false;
        browserSyncConfig.ui = false;
        browserSyncConfig.snippetOptions.rule.fn = function (snippet, match) {
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

        options.isWatching = true;

        browserSyncConfig.middleware = require('./lib/middlewares')(options);

        browserSync.init(browserSyncConfig, function () {

            ['images', 'scripts', 'fonts', 'fonts', 'media', 'views'].forEach(function (task) {
                gulp.task(task + '-watch', [task], browserSync.reload);
            });

            gulp.watch([
                assetsPath('src.sass', '/**/*.{scss,sass}'),
                '!' + assetsPath('src.sass', '**/*scsslint_tmp*.{sass,scss}') //exclude scss lint files
            ], ['styles']);

            gulp.watch([assetsPath('src.images', '**/*.{png,jpg,gif,svg,webp}')], ['images-watch']);
            gulp.watch([assetsPath('src.fonts', '**/*.{eot,svg,ttf,woff,woff2}')], ['fonts-watch']);
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

        browserSync.init({
            logLevel: 'silent',
            middleware: require('./lib/middlewares')(options),
            notify: false,
            open: false,
            port: ports.connect,
            server: {
                baseDir: options.paths.dist.root
            },
            ui: false
        }, function () {
            $.util.log($.util.colors.green('Running a static server on port ' + ports.connect + '...'));
        });

        process.on('exit', function () {
            browserSync.exit();
            done();
        });

    });
};

