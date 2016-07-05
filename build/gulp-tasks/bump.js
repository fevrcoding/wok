/**
 * Package Data Management Tasks
 * ===============================
 */

module.exports = function (gulp, $, options) {

    var argv = require('yargs').argv;

    gulp.task('bump:type', function (done) {

        var allowed = ['major', 'minor', 'patch'],
            semver = require('semver'),
            inquirer = require('inquirer');

        //if --type is set and valid, use it
        if (semver.inc(options.pkg.version, argv.type) !== null) {
            done();
            return;
        }
        //else ask!
        inquirer.prompt([{
            name: 'version',
            type: 'list',
            message: 'New version number?',
            default: (allowed.length - 1),
            choices: allowed.map(function (type) { return { name: type + ' (' + semver.inc(options.pkg.version, type)  + ')', value: type}; })
        }]).then(function (answers) {
            argv.type = answers.version;
            done();
        });
    });

    gulp.task('bump', ['bump:type'], function () {
        return gulp.src(['package.json', 'bower.json'])
            .pipe($.bump({type: argv.type || 'patch'}))
            .pipe(gulp.dest('./'));
    });
};