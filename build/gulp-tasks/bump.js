var argv = require('yargs').argv;

module.exports = function (gulp, $) {

    gulp.task('bump', function () {
        return gulp.src(['package.json', 'bower.json'])
            .pipe($.bump({type: argv.type || 'patch'}))
            .pipe(gulp.dest('./'));
    });
}