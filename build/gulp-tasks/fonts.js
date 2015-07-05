module.exports = function (gulp, $, options) {

    gulp.task('fonts', function () {
        return gulp.src([options.assetsPath('src.fonts', '**/*.{eot,svg,ttf,woff,woff2}')])
            .pipe(
                gulp.dest(options.assetsPath('dist.fonts'))
            )
            .pipe($.size({title: 'fonts'}));
    });

};


