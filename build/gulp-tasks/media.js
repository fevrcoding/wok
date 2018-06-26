/**
 * Media Task
 * ===============================
 */

const paths = require('../gulp-config/paths');
const { getNotifier } = require('./lib/plugins');

module.exports = (gulp, $, options) => () => {

    const distPath = paths.toPath('dist.assets/media');
    const { notify } = getNotifier(options);

    return gulp.src(paths.toPath('src.assets/media/**/*.*'))
        .pipe($.changed(distPath))
        .pipe(gulp.dest(distPath))
        .pipe(notify({ message: 'Media files synced', onLast: true }))
        .pipe($.size({ title: 'media' }));

};