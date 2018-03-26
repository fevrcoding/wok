/**
 * Grunt build tasks
 */

/*eslint-env node */
/*eslint one-var: 0, no-new: 0, func-names: 0, strict: 0, import/no-extraneous-dependencies: 0 */

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const glob = require('globby');
const _ = require('lodash');
const log = require('fancy-log');
const { red } = require('ansi-colors');
const $ = require('gulp-load-plugins')();
const { argv = {} } = require('yargs');
const pkg = require('./package.json');
const paths = require('./build/gulp-config/paths');

const taskPath = path.join(process.cwd(), 'build', 'gulp-tasks');
const optionsPath = path.join(process.cwd(), 'build', 'gulp-config');
const banners = {
    application: `/*! ${pkg.description} v${pkg.version} - ${pkg.author.name} - Copyright ${pkg.year} ${pkg.author.company} */\n`,
    vendors: `/*! ${pkg.description} v${pkg.version} - ${pkg.author.name} - Vendor package */\n`
};

const logError = (...args) => log(red(...args));


pkg.year = new Date().getFullYear();


//load configuration from files
const options = ['hosts', 'properties'].reduce((obj, filename) => {

    const configFilePath = path.join(optionsPath, `${filename}.js`);
    const configLocalFilePath = path.join(optionsPath, `${filename}.local.js`);
    let conf = {};

    if (fs.existsSync(configFilePath)) {
        Object.assign(conf, require(configFilePath));
    }

    if (fs.existsSync(configLocalFilePath)) {
        conf = _.merge(conf, require(configLocalFilePath));
    }

    if (filename === 'properties') {
        return Object.assign(obj, conf);
    }

    obj[filename] = conf; //eslint-disable-line no-param-reassign

    return obj;

}, {});

if (fs.existsSync(path.join(optionsPath, 'paths.local.js'))) {
    paths.merge(require(path.join(optionsPath, 'paths.local.js')));
}

if (_.has(argv, 'remotehost')) {
    logError('WARNING: param `--remotehost` is deprecated use `--target` instead');
    argv.target = argv.remotehost;
}


_.forOwn({
    production: false,
    command: null,
    target: null //be explicit!
}, (value, key) => {
    options[key] = _.get(argv, key, value);
});

//force production env
if (options.production) {
    process.env.NODE_ENV = 'production';
}

if (options.target === null) {
    options.target = options.production ? 'production' : 'development';
}

options.pkg = pkg;
options.banners = banners;

//unique build identifier
options.buildHash = `buildhash${(Date.now())}`;


glob.sync('./*.js', { cwd: taskPath }).forEach((taskFile) => {
    const name = path.basename(taskFile, '.js');
    const task = require(`${taskPath}/${taskFile}`)(gulp, $, options);
    gulp.task(name, task);
});

gulp.task('default', (done) => {

    const tasks = [
        'images',
        gulp.parallel('fonts', 'media', 'styles', 'scripts'),
        'modernizr',
        'views'
    ];

    if (options.styleguideDriven) {
        tasks.push('styleguide');
    }

    if (options.production) {
        tasks.push('rev');
    }

    gulp.series(...tasks, done);
});

gulp.task('serve', (done) => {
    gulp.series('default', gulp.parallel('server', 'watch'), done);
});

gulp.task('dev', (done) => {
    logError('`dev` task has been removed. Please run `gulp`');
    done();
});


gulp.task('dist', (done) => {
    logError('`dist` task has been removed. Please run `gulp --production`');
    done();
});

if (options.buildOnly) {
    gulp.task('build', (done) => {

        const testHash = require('crypto').createHash('md5').update(fs.readFileSync(__filename, { encoding: 'utf8' })).digest('hex');

        if (!argv.grunthash) {
            logError('Cannot run this task directly');
            done();
            return;
        }

        if (argv.grunthash !== testHash) {
            logError('Safety hash check not passed');
            done();
            return;
        }

        gulp.series('default', done);

    });

} else {

    gulp.task('deploy', (done) => {
        gulp.series('default', 'remote', done);
    });
}