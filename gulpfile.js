/**
 * Grunt build tasks
 */

/*eslint-env node */
/*eslint one-var: 0, no-new: 0, func-names: 0, strict: 0, prefer-template: 0 */
/*eslint import/no-dynamic-require: 0, import/no-extraneous-dependencies: [2, {"devDependencies": true, "optionalDependencies": true, "peerDependencies": true}], global-require: 0 */

'use strict';

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const runSequence = require('run-sequence');
const _ = require('lodash');
const $ = require('gulp-load-plugins')();
const argv = require('yargs').argv || {};
const pkg = require('./package.json');

const taskPath = path.join(process.cwd(), 'build', 'gulp-tasks');
const optionsPath = path.join(process.cwd(), 'build', 'gulp-config');
const options = {};
const banners = {};


pkg.year = new Date().getFullYear();

/* eslint-disable */
banners.application = "/*! <%= pkg.description %> v<%= pkg.version %> - <%= pkg.author.name %> - Copyright <%= pkg.year %> <%= pkg.author.company %> */\n";
banners.vendors = "/*! <%= pkg.description %> v<%= pkg.version %> - <%= pkg.author.name %> - Vendor package */\n";
/* eslint-enable */


//load configuration from yaml files
['hosts', 'properties', 'paths'].forEach((filename) => {

    const configFilePath = path.join(optionsPath, filename + '.js');
    const configLocalFilePath = path.join(optionsPath, filename + '.local.js');
    var conf = {}; //eslint-disable-line no-var

    if (fs.existsSync(configFilePath)) {
        conf = Object.assign(conf, require(configFilePath));
    }

    if (fs.existsSync(configLocalFilePath)) {
        conf = _.merge(conf, require(configLocalFilePath));
    }

    if (filename === 'properties') {
        Object.assign(options, conf);
    } else {
        options[filename] = conf;
    }

});

_.forOwn({
    production: false,
    command: null,
    remotehost: null //be explicit!
}, (value, key) => {
    options[key] = _.has(argv, key) ? argv[key] : value;
});

//force production env
if (options.production) {
    process.env.NODE_ENV = 'production';
}

options.pkg = pkg;
options.banners = banners;

//unique build identifier
options.buildHash = 'buildhash' + (Date.now());


options.assetsPath = function (type, match) {
    const parts = type.split('.');
    const paths = options.paths;

    var folderPath; //eslint-disable-line no-var

    if (parts.length > 1) {
        folderPath = path.join(paths[parts[0]].assets, paths[parts[1]]);
    } else {
        folderPath = path.normalize(paths[parts[0]].assets);
    }
    if (match) {
        folderPath = path.join(folderPath, match);
    }
    return folderPath;
};
//accept just js files
fs.readdirSync(taskPath).filter((taskFile) => (
    path.extname(taskFile) === '.js'
)).forEach((taskFile) => {
    require(taskPath + '/' + taskFile)(gulp, $, options);
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
    runSequence.apply(null, tasks); //eslint-disable-line prefer-spread
});

gulp.task('dev', ['default']);


gulp.task('dist', function () {
    $.util.log($.util.colors.red('`dist` task has been removed. Please run `gulp --production`'));
    // emit the end event, to properly end the task
    this.emit('end');
});

if (options.buildOnly) {
    gulp.task('build', function (done) {

        const testHash = require('crypto').createHash('md5').update(fs.readFileSync(__filename, { encoding: 'utf8' })).digest('hex');

        if (!argv.grunthash) {
            $.util.log($.util.colors.red('Cannot run this task directly'));
            this.emit('end');
            return;
        }

        if (argv.grunthash !== testHash) {
            $.util.log($.util.colors.red('Safety hash check not passed'));
            this.emit('end');
            return;
        }

        runSequence('default', done);

    });

} else {

    gulp.task('deploy', (done) => {
        const tasks = ['default'];

        switch (options.deployStrategy) {
        case 'rsync':
            //force backup
            options.command = 'backup';
            tasks.push('remote', 'rsync');
            break;
        default:
            tasks.push(options.deployStrategy);
            break;
        }
        tasks.push(done);

        runSequence.apply(null, tasks); //eslint-disable-line prefer-spread
    });
}