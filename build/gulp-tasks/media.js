module.exports = function (gulp, $, options) {

    gulp.task('media', function () {
        return gulp.src([options.assetsPath('src.video', '**/*.*'), options.assetsPath('src.audio', '**/*.*')])
            .pipe(
                gulp.dest(options.assetsPath('dist'))
            )
            .pipe($.size({title: 'media'}));
    });

};


