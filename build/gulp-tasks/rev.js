/**
 * Resource Revving Task
 * ===============================
 */
const paths = require('../gulp-config/paths');

module.exports = (gulp, $) => () => {
    const manifest = gulp.src(paths.toPath('dist.root/dist.revmap'));

    return gulp.src(paths.toPath('dist.root') + '/**/*.*')
        .pipe($.revReplace({ manifest }))
        .pipe(gulp.dest(paths.toPath('dist.root')));
};