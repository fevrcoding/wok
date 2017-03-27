/**
 * Resource Revving Task
 * ===============================
 */

module.exports = (gulp, $) => {

    const paths = require('../gulp-config/paths');

    gulp.task('rev', () => {
        const manifest = gulp.src(paths.toPath('dist.root/dist.revmap'));

        return gulp.src(paths.toPath('dist.root') + '/**/*.*')
            .pipe($.revReplace({ manifest }))
            .pipe(gulp.dest(paths.toPath('dist.root')));
    });

};