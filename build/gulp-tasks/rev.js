/**
 * Resource Revving Task
 * ===============================
 */

module.exports = function (gulp, $, options) {

    var paths = options.paths;

    gulp.task('rev', function () {
        var path = require('path'),
            manifest = gulp.src(path.join(paths.dist.root, paths.dist.revmap));

        return gulp.src(paths.dist.root + '/**/*.*')
            .pipe($.revReplace({manifest: manifest}))
            .pipe(gulp.dest(paths.dist.root));
    });

};

