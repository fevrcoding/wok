/**
 * Package Data Management Tasks
 * ===============================
 */

module.exports = (gulp, $, { pkg }) => (done) => {
    const semver = require('semver');
    const prompts = require('prompts');
    const { type } = require('yargs').argv;
    const allowed = ['major', 'minor', 'patch'];

    let bump;
    //if --type is set and valid, use it
    if (semver.inc(pkg.version, type) !== null) {
        bump = Promise.resolve({ type });
    } else {
        bump = prompts([{
            name: 'type',
            type: 'select',
            message: 'New version number?',
            initial: allowed.indexOf('patch'),
            choices: allowed.map((value) => (
                { title: `${value} (${semver.inc(pkg.version, value)})`, value }
            ))
        }]);
    }

    bump.then(({ type }) => { //eslint-disable-line no-shadow
        if (!type) {
            done();
            return;
        }
        gulp.src(['package.json'])
            .pipe($.bump({ type }))
            .pipe(gulp.dest('./'))
            .on('end', done);
    });
};