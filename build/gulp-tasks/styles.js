/**
 * Sass and Stylesheets Related Task
 * ===============================
 */

module.exports = (gulp, $, options) => {

    const path = require('path');
    const autoprefixer = require('autoprefixer');
    const through = require('through2');
    const paths = require('../gulp-config/paths');
    const sassFunctions = require('./lib/sass-functions')(options);
    const noop = () => through.obj();

    const { production, banners, isWatching, enableNotify, livereload, buildHash } = options;
    let destPath = paths.toPath('dist.assets/css');
    let optimizePipe = noop;

    if (production) {
        destPath = path.normalize(destPath.replace(paths.toPath('dist.root'), paths.get('tmp')));
    }

    if (production) {
        optimizePipe = require('lazypipe')()
            .pipe($.header, banners.application, {})
            .pipe(() => gulp.dest(destPath))
            .pipe($.cleanCss, {
                advanced: false,
                aggressiveMerging: false,
                mediaMerging: false,
                rebase: false
            })
            .pipe($.rename, { suffix: '.min' });
    }

    return () => {
        let reloadStream;
        function reloadStreamFn() {
            if (isWatching && livereload) {
                return reloadStream || (reloadStream = require('browser-sync').get(buildHash).stream); //eslint-disable-line no-return-assign
            }
            return noop;
        }

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
                autoprefixer()
            ]))
            .pipe($.if(production, optimizePipe()))
            .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest(paths.toPath('dist.assets/css')))
            .pipe(reloadStreamFn()({ match: '**/*.css' }))
            .pipe($.if(isWatching && enableNotify, $.notify({ message: 'SASS Compiled', onLast: true })))
            .pipe($.size({ title: 'styles' }));
    };

};