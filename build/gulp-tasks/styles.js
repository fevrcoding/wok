/**
 * Sass and Stylesheets Related Task
 * ===============================
 */

module.exports = (gulp, $, options) => {

    const path = require('path');
    const autoprefixer = require('autoprefixer');
    const production = options.production;
    const paths = require('../gulp-config/paths');
    const sassFunctions = require('./lib/sass-functions')(options);

    let productionPipe;
    let destPath = paths.toPath('dist.assets/css');
    let reloadStream;

    function reloadStreamFn() {
        if (options.isWatching && options.livereload) {
            return reloadStream || (reloadStream = require('browser-sync').get(options.buildHash).stream); //eslint-disable-line no-return-assign
        }
        return $.util.noop;
    }


    if (production) {
        destPath = path.normalize(destPath.replace(paths.toPath('dist.root'), paths.get('tmp')));
    }

    if (production) {
        productionPipe = require('lazypipe')()
            .pipe($.header, options.banners.application, { pkg: options.pkg })
            .pipe(() => gulp.dest(destPath))
            .pipe($.cleanCss, {
                advanced: false,
                aggressiveMerging: false,
                mediaMerging: false,
                rebase: false
            })
            .pipe($.rename, { suffix: '.min' });
    } else {
        productionPipe = $.util.noop;
    }



    gulp.task('styles', () => {

        return gulp.src([
            paths.toPath('src.assets/styles/**/*.{sass,scss}')
        ])
            .pipe($.plumber({
                errorHandler: $.notify.onError('Error: <%= error.message %>')
            }))
            .pipe($.sourcemaps.init())
            .pipe($.sass({
                precision: 10,
                includePaths: [paths.toPath('src.assets/vendors'), 'node_modules'],
                outputStyle: 'expanded',
                functions: sassFunctions
            }).on('error', $.sass.logError))
            .pipe($.postcss([
                autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'ie 9'] })
            ]))
            .pipe($.if(production, productionPipe()))
            .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest(paths.toPath('dist.assets/css')))
            .pipe(reloadStreamFn()({ match: '**/*.css' }))
            .pipe($.if(options.isWatching, $.notify({ message: 'SASS Compiled', onLast: true })))
            .pipe($.size({ title: 'styles' }));
    });

};