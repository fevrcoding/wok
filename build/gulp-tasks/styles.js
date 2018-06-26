/**
 * Sass and Stylesheets Related Task
 * ===============================
 */

module.exports = (gulp, $, options) => {

    const path = require('path');
    const autoprefixer = require('autoprefixer');
    const { noop, getReloadStream, getNotifier } = require('./lib/plugins');
    const paths = require('../gulp-config/paths');
    const sassFunctions = require('./lib/sass-functions')(options);
    const { production, banners } = options;
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

        const { notify, errorHandler } = getNotifier(options);


        return gulp.src([
            paths.toPath('src.assets/styles/**/*.{sass,scss}')
        ])
            .pipe($.plumber({ errorHandler }))
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
            .pipe(getReloadStream(options)({ match: '**/*.css' }))
            .pipe(notify({ message: 'SASS Compiled', onLast: true }))
            .pipe($.size({ title: 'styles' }));
    };

};