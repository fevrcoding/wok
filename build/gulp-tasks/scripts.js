/**
 * JavaScript Related Task
 * ===============================
 */

module.exports = function (gulp, $, options) {

    const srcPath = options.assetsPath('src.js');
    var destPath = options.assetsPath('dist.js'); //eslint-disable-line no-var

    if (options.production) {
        destPath = destPath.replace(options.paths.dist.root, options.paths.tmp);
    }

    gulp.task('scripts', () => {


        return gulp.src([srcPath + '/**/*.js', '!' + srcPath + '/**/*.{spec,conf}.js'])
            .pipe($.plumber({
                errorHandler: $.notify.onError('Error: <%= error.message %>')
            }))
            .pipe(gulp.dest(destPath))
            .pipe($.if(options.isWatching, $.notify({ message: 'Scripts Compiled', onLast: true })))
            .pipe($.size({ title: 'scripts' }));
    });

};