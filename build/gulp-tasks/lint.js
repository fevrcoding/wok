/**
 * Lint Tasks
 * ===============================
 */

module.exports = function (gulp, $, options) {

    gulp.task('lint:js', () => {

        const fail = options.isWatching ? $.util.noop : $.eslint.failAfterError;

        return gulp.src(options.assetsPath('src.js', '**/*.js'))
            .pipe($.eslint())
            .pipe($.eslint.format())
            .pipe(fail());
    });


    gulp.task('lint:scss', () => {

        return gulp.src([
            options.assetsPath('src.sass', '**/*.{sass,scss}'),
            '!' + options.assetsPath('src.sass', '**/*scsslint_tmp*.{sass,scss}') //exclude scss lint files
        ])
        .pipe($.stylelint({
            reporters: [
                { formatter: 'string', console: true }
            ]
        }));
    });

    gulp.task('lint', ['lint:js', 'lint:scss']);

};