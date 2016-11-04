/**
 * Development Server Task
 * ===============================
 */


module.exports = function (gulp, $, options) {

    const defaults = require('lodash/defaults');
    const del = require('del');
    const path = require('path');

    const paths = options.paths;
    const assetsPath = options.assetsPath;
    const ports = options.hosts.devbox.ports;



    function deleteListener(fileType) {

        return (event) => {

            if (event.type === 'deleted') {
                // Simulating the {base: 'src'} used with gulp.src in the scripts task
                const filePathFromSrc = path.relative(assetsPath('src.' + fileType), event.path);

                // Concatenating the 'build' absolute path used by gulp.dest in the scripts task
                const destFilePath = path.resolve(assetsPath('dist.' + fileType), filePathFromSrc);

                del.sync(destFilePath);
            }
        };
    }

    const serverConfigDefault = {
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
                    return ['<!--[if (gt IE 9) | (IEMobile)]><!-->', snippet, '<!--<![endif]-->', match].join('\n');
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
    // if (process.platform === 'win32') {
    process.on('SIGINT', () => {
        process.exit();
    });
    // }

    // Watch Files For Changes & Reload
    gulp.task('serve', ['default'], (done) => {

        const browserSync = require('browser-sync').create(options.buildHash);
        const serverConf = defaults({
            ui: {
                port: 3001,
                weinre: {
                    port: ports.weinre
                }
            }
        }, serverConfigDefault);

        options.isWatching = true; //eslint-disable-line no-param-reassign

        browserSync.init(serverConf, () => {

            ['images', 'scripts', 'fonts', 'fonts', 'media', 'views'].forEach((task) => {
                gulp.task(task + '-watch', [task], (doneWatch) => {
                    browserSync.reload();
                    doneWatch();
                });
            });

            gulp.watch([
                assetsPath('src.sass', '/**/*.{scss,sass}'),
                '!' + assetsPath('src.sass', '**/*scsslint_tmp*.{sass,scss}') //exclude scss lint files
            ], (options.styleguideDriven ? ['styles', 'styleguide'] : ['styles']));

            gulp.watch([assetsPath('src.images', '**/*.{png,jpg,gif,svg,webp}')], ['images-watch']).on('change', deleteListener('images'));
            gulp.watch([assetsPath('src.fonts', '**/*.{eot,svg,ttf,woff,woff2}')], ['fonts-watch']).on('change', deleteListener('fonts'));
            gulp.watch([assetsPath('src.video', '{,*/}*.*')], ['media-watch']).on('change', deleteListener('video'));
            gulp.watch([assetsPath('src.audio', '{,*/}*.*')], ['media-watch']).on('change', deleteListener('audio'));
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

        process.on('exit', () => {
            browserSync.exit();
            done();
        });

    });

    //just a static server
    gulp.task('server', (done) => {

        const browserSync = require('browser-sync').create(options.buildHash);
        const serverConf = defaults({
            open: false,
            ui: false
        }, serverConfigDefault);

        browserSync.init(serverConf, () => {
            //$.util.log($.util.colors.green('Running a static server on port ' + ports.connect + '...'));
        });

        process.on('exit', () => {
            browserSync.exit();
            done();
        });

    });
};