/**
 * Media Task
 * ===============================
 */

const paths = require('../gulp-config/paths');

module.exports = (gulp, $, options) => () => {

    const distPath = paths.toPath('dist.assets/media');

    return gulp.src(paths.toPath('src.assets/media/**/*.*'))
        .pipe($.changed(distPath))
        .pipe(gulp.dest(distPath))
        .pipe($.if(options.isWatching, $.notify({ message: 'Media files synced', onLast: true })))
        .pipe($.size({ title: 'media' }));

};