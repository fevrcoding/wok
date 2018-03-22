/**
 * Grunt build tasks
 */

/*eslint-env node */
/*eslint one-var: 0, no-new: 0, func-names: 0, strict: 0, import/no-extraneous-dependencies: 0 */

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const runSequence = require('run-sequence');
const _ = require('lodash');
const $ = require('gulp-load-plugins')();
const argv = require('yargs').argv || {};
const pkg = require('./package.json');
const paths = require('./build/gulp-config/paths');

const taskPath = path.join(process.cwd(), 'build', 'gulp-tasks');
const optionsPath = path.join(process.cwd(), 'build', 'gulp-config');
const options = {};
const banners = {};

const logError = (...args) => $.util.log($.util.colors.red(...args));


pkg.year = new Date().getFullYear();
/* eslint-disable */
banners.application = "/*! <%= pkg.description %> v<%= pkg.version %> - <%= pkg.author.name %> - Copyright <%= pkg.year %> <%= pkg.author.company %> */\n";
banners.vendors = "/*! <%= pkg.description %> v<%= pkg.version %> - <%= pkg.author.name %> - Vendor package */\n";
/* eslint-enable */


//load configuration from files
['hosts', 'properties'].forEach((filename) => {

    const configFilePath = path.join(optionsPath, `${filename}.js`);
    const configLocalFilePath = path.join(optionsPath, `${filename}.local.js`);
    let conf = {};

    if (fs.existsSync(configFilePath)) {
        conf = _.assign(conf, require(configFilePath));
    }

    if (fs.existsSync(configLocalFilePath)) {
        conf = _.merge(conf, require(configLocalFilePath));
    }

    if (filename === 'properties') {
        _.assign(options, conf);
    } else {
        options[filename] = conf;
    }

});

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
    options[key] = _.has(argv, key) ? argv[key] : value;
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

fs.readdirSync(taskPath).filter((taskFile) => path.extname(taskFile) === '.js').forEach((taskFile) => {
    require(`${taskPath}/${taskFile}`)(gulp, $, options); //eslint-disable-line global-require
});



gulp.task('default', ['clean'], (done) => {

    const tasks = [
        'images',
        ['fonts', 'media', 'styles', 'scripts'],
        'modernizr',
        'views'
    ];

    if (options.styleguideDriven) {
        tasks.push('styleguide');
    }

    if (options.production) {
        //rev production files and cleanup temp files
        tasks.push('rev', 'clean:tmp');
    }


    tasks.push(done);
    runSequence(...tasks);
});

gulp.task('dev', ['default']);


gulp.task('dist', function () {
    logError('`dist` task has been removed. Please run `gulp --production`');
    // emit the end event, to properly end the task
    this.emit('end');
});

if (options.buildOnly) {
    gulp.task('build', function (done) {

        const testHash = require('crypto').createHash('md5').update(fs.readFileSync(__filename, { encoding: 'utf8' })).digest('hex');

        if (!argv.grunthash) {
            logError('Cannot run this task directly');
            this.emit('end');
            return;
        }

        if (argv.grunthash !== testHash) {
            logError('Safety hash check not passed');
            this.emit('end');
            return;
        }

        runSequence('default', done);

    });

} else {

    gulp.task('deploy', (done) => {
        const tasks = ['default'];

        if (!deployStrategy) {
            $.util.warn('No deploy strategy set as default or in the host config');
            done();
            return;
        }

        switch (deployStrategy) {
        case 'rsync':
            //force backup
            options.command = 'backup';
            tasks.push('remote', 'rsync');
            break;
        default:
            tasks.push(deployStrategy);
            break;
        }
        tasks.push(done);

        runSequence(...tasks);
    });
}