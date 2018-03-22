/**
 * Lint Tasks
 * ===============================
 */



module.exports = (gulp, $) => {

    const paths = require('../gulp-config/paths');

    const js = () => {
        return gulp.src(paths.toPath('src.assets/js/**/*.js'))
            .pipe($.eslint({
                configFile: paths.toPath('src.assets/js/.eslintrc.json')
            }))
            .pipe($.eslint.format());
    };

    const styles = () => {
        return gulp.src(paths.toPath('src.assets/styles/**/*.{css,sass,scss}'))
            .pipe($.stylelint({
                reporters: [
                    { formatter: 'string', console: true }
                ]
            }));
    };

    gulp.task('lint:js', js);
    gulp.task('lint:styles', styles);

    return (done) => {
        gulp.parallel(js, styles, done);
    };

};