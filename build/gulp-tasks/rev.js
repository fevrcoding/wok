/**
 * Resource Revving Task
 * ===============================
 */

module.exports = function (gulp, $, options) {

    const paths = options.paths;

    gulp.task('rev', () => {
        const path = require('path');
        const manifest = gulp.src(path.join(paths.dist.root, paths.dist.revmap));

        return gulp.src(paths.dist.root + '/**/*.*')
            .pipe($.revReplace({ manifest: manifest }))
            .pipe(gulp.dest(paths.dist.root));
    });

};