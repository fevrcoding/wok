/**
 * Lint Tasks
 * ===============================
 */

module.exports = (gulp, $) => {

    const paths = require('../gulp-config/paths');

    gulp.task('lint:js', () => {

        return gulp.src(paths.toPath('src.assets/js/**/*.js'))
            .pipe($.eslint({
                configFile: paths.toPath('src.assets/js/.eslintrc.json')
            }))
            .pipe($.eslint.format());
    });


    gulp.task('lint:styles', () => {

        return gulp.src(paths.toPath('src.assets/styles/**/*.{css,sass,scss}'))
            .pipe($.stylelint({
                reporters: [
                    { formatter: 'string', console: true }
                ]
            }));
    });

    gulp.task('lint', ['lint:js', 'lint:styles']);

};