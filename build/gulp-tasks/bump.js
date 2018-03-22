/**
 * Package Data Management Tasks
 * ===============================
 */

module.exports = (gulp, $, { pkg }) => (done) {
    const semver = require('semver');
    const prompts = require('prompts');
    const { type = 'patch' } = require('yargs').argv;
    const allowed = ['major', 'minor', 'patch'];

    let bump;
    //if --type is set and valid, use it
    if (semver.inc(pkg.version, type) === null) {
        bump = Promise.resolve({ type });
    } else {
        bump = prompts.prompt([{
            name: 'type',
            type: 'select',
            message: 'New version number?',
            initial: allowed.indexOf('patch'),
            choices: allowed.map((value) => (
                { name: `${value} (${semver.inc(pkg.version, value)})`, value }
            ))
        }]);
    }

    bump.then(({ type }) => {
        gulp.src(['package.json'])
            .pipe($.bump({ type }))
            .pipe(gulp.dest('./'))
            .on('all', done);
    });
});