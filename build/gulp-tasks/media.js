/**
 * Media Task
 * ===============================
 */

module.exports = (gulp, $, options) => {

    const paths = require('../gulp-config/paths');


    gulp.task('media', () => {

        const distPath = paths.toPath('dist.assets');

        return gulp.src([
            paths.toPath('src.assets/video/**/*.*'),
            paths.toPath('src.assets/audio/**/*.*')
        ], { base: paths.toPath('src.assets') })
            .pipe($.changed(distPath))
            .pipe(gulp.dest(distPath))
            .pipe($.if(options.isWatching, $.notify({ message: 'Media files synced', onLast: true })))
            .pipe($.size({ title: 'media' }));
    });

};