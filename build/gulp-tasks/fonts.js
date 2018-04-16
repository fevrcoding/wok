/**
 * Fonts Task
 * ===============================
 */

module.exports = (gulp, $, options) => () => {
    const paths = require('../gulp-config/paths');
    const destFolder = paths.toPath('dist.assets/fonts');
    const filesMatch = '**/*.{eot,svg,ttf,woff,woff2}';

    const { isWatching, enableNotify } = options;

    return gulp.src([paths.toPath(`src.assets/fonts/${filesMatch}`)])
        .pipe($.changed(destFolder))
        .pipe(gulp.dest(destFolder))
        .pipe($.if(isWatching && enableNotify, $.notify({ message: 'Fonts synced', onLast: true })))
        .pipe($.size({ title: 'fonts' }));

};