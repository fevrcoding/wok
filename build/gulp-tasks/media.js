/**
 * Media Task
 * ===============================
 */

module.exports = function (gulp, $, options) {

    gulp.task('media', function () {
        return gulp.src([options.assetsPath('src.video', '**/*.*'), options.assetsPath('src.audio', '**/*.*')])
            .pipe($.changed(options.assetsPath('dist')))
            .pipe(gulp.dest(options.assetsPath('dist')))
            .pipe($.if(options.isWatching, $.notify({ message: 'Media files synced', onLast: true })))
            .pipe($.size({title: 'media'}));
    });

};


