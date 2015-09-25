/**
 * Fonts Task
 * ===============================
 */

module.exports = function (gulp, $, options) {

    var destFolder = options.assetsPath('dist.fonts'),
        filesMatch = '**/*.{eot,svg,ttf,woff,woff2}';


    gulp.task('fonts', function () {

        return gulp.src([options.assetsPath('src.fonts', filesMatch)])
            .pipe($.changed(destFolder))
            .pipe(gulp.dest(destFolder))
            .pipe($.if(options.isWatching, $.notify({ message: 'Fonts synced', onLast: true })))
            .pipe($.size({title: 'fonts'}));
    });

};


