/**
 * Package Data Management Tasks
 * ===============================
 */

module.exports = (gulp, $, options) => {

    const argv = require('yargs').argv;

    gulp.task('bump:type', (done) => {

        const allowed = ['major', 'minor', 'patch'];
        const semver = require('semver');
        const inquirer = require('inquirer');

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
            choices: allowed.map((type) => (
                { name: type + ' (' + semver.inc(options.pkg.version, type) + ')', value: type }
            ))
        }]).then((answers) => {
            argv.type = answers.version;
            done();
        });
    });

    gulp.task('bump', ['bump:type'], () => {
        return gulp.src(['package.json'])
            .pipe($.bump({ type: argv.type || 'patch' }))
            .pipe(gulp.dest('./'));
    });
};