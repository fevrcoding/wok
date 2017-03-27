/**
 * Development Server Task
 * ===============================
 */


module.exports = (gulp, $, options) => {

    const assign = require('lodash/assign');
    const del = require('del');
    const path = require('path');

    const paths = require('../gulp-config/paths');
    const { ports } = options.hosts.development;


    function deleteListener(fileType) {

        return (event) => {

            if (event.type === 'deleted') {
                // Simulating the {base: 'src'} used with gulp.src in the scripts task
                const filePathFromSrc = path.relative(paths.toPath(`src.assets/${fileType}`), event.path);

                // Concatenating the 'build' absolute path used by gulp.dest in the scripts task
                const destFilePath = path.resolve(paths.toPath(`dist.assets/${fileType}`), filePathFromSrc);

                del.sync(destFilePath);
            }
        };
    }

    const serverConfigDefault = {
        notify: false,
        ghostMode: false,
        port: ports.connect,
        server: {
            baseDir: [paths.toPath('dist.root')]
        },
        snippetOptions: {
            async: true,
            whitelist: [],
            blacklist: [],
            rule: {
                match: /<\/head[^>]*>/i,
                fn(snippet, match) {
                    return ['<!--[if (gt IE 9) | (IEMobile)]><!-->', snippet, '<!--<![endif]-->', match].join('\n');
                }
            }
        }
    };

    if (!options.livereload) {
        serverConfigDefault.ui = false;
        serverConfigDefault.snippetOptions.rule.fn = (snippet, match) => {
            return match;
        };
    }

    process.on('SIGINT', () => {
        process.exit();
    });

    const createServer = (conf, cb) => {
        const browserSync = require('browser-sync').create(options.buildHash);
        const serverConf = assign({}, serverConfigDefault, {
            middleware: require('./lib/middlewares')(options, browserSync)
        }, conf || {});

        browserSync.init(serverConf, (err, bs) => {

            if (err) {
                cb(err);
                return;
            }

            if (cb) {
                cb(err, bs);
            }

        });

        process.on('exit', () => {
            browserSync.exit();
        });

        return browserSync;
    };

    // Watch Files For Changes & Reload
    gulp.task('serve', ['default'], (done) => {

        options.isWatching = true; //eslint-disable-line no-param-reassign

        const browserSync = createServer({
            ui: {
                port: 3001,
                weinre: {
                    port: ports.weinre
                }
            }
        }, (err) => {

            if (err) {
                done(err);
                return;
            }

            ['images', 'scripts', 'fonts', 'fonts', 'media', 'views'].forEach((task) => {
                gulp.task(task + '-watch', [task], (doneWatch) => {
                    browserSync.reload();
                    doneWatch();
                });
            });

            gulp.watch([paths.toPath('src.assets/styles/**/*.{css,scss,sass}')], (options.styleguideDriven ? ['styles', 'styleguide'] : ['styles']));
            gulp.watch([paths.toPath('src.assets/images/**/*.{png,jpg,jpeg,gif,svg,webp}')], ['images-watch']).on('change', deleteListener('images'));
            gulp.watch([paths.toPath('src.assets/fonts/**/*.{eot,svg,ttf,woff,woff2}')], ['fonts-watch']).on('change', deleteListener('fonts'));
            gulp.watch([paths.toPath('src.assets/video/{,*/}*.*')], ['media-watch']).on('change', deleteListener('video'));
            gulp.watch([paths.toPath('src.assets/audio/{,*/}*.*')], ['media-watch']).on('change', deleteListener('audio'));
            gulp.watch([
                paths.toPath('src.assets/js/**/*.js'),
                '!' + paths.toPath('src.assets/js/**/*.{spec,conf}.js')
            ], ['scripts-watch']);
            gulp.watch([
                paths.toPath(`src.views/{,*/}${options.viewmatch}`),
                paths.toPath('src.documents/*.md'),
                paths.toPath('src.fixtures/*.json')
            ], ['views-watch']);

        });

        process.on('exit', () => {
            browserSync.exit();
            done();
        });

    });

    //just a static server
    gulp.task('server', (done) => {

        const browserSync = createServer({
            open: false,
            ui: false
        });

        process.on('exit', () => {
            browserSync.exit();
            done();
        });

    });
};