/**
 * Package Data Management Tasks
 * ===============================
 */

module.exports = function (gulp, $) {

    var argv = require('yargs').argv;

    gulp.task('bump', function () {
        return gulp.src(['package.json', 'bower.json'])
            .pipe($.bump({type: argv.type || 'patch'}))
            .pipe(gulp.dest('./'));
    });
};