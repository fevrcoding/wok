/**
 * JavaScript Related Task
 * ===============================
 */

module.exports = function (gulp, $, options) {

    var srcPath = options.assetsPath('src.js'),
        destPath = options.assetsPath('dist.js');

    if (options.production) {
        destPath = destPath.replace(options.paths.dist.root, options.paths.tmp);
    }

    gulp.task('scripts', function () {
        return gulp.src([srcPath +  '/**/*.js', '!' + srcPath +  '/**/*.{spec,conf}.js'])
            .pipe($.plumber({
                errorHandler: $.notify.onError('Error: <%= error.message %>')
            }))
            .pipe(gulp.dest(destPath))
            .pipe($.if(options.isWatching, $.notify({ message: 'Scripts Compiled', onLast: true })))
            .pipe($.size({title: 'scripts'}));
    });

};


