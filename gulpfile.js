/**
 * Grunt build tasks
 */

/*eslint-env node, mocha */
/*eslint one-var: 0, no-new: 0, func-names: 0, strict: 0 */

'use strict';

var fs = require('fs'),
    path = require('path'),
    gulp = require('gulp'),
    runSequence = require('run-sequence'),
    _ = require('lodash'),
    $ = require('gulp-load-plugins')(),
    argv = require('yargs').argv || {},
    pkg = require('./package.json'),
    taskPath = path.join(process.cwd(), 'build', 'gulp-tasks'),
    optionsPath = path.join(process.cwd(), 'build', 'gulp-config'),
    options = {},
    banners = {};


pkg.year = new Date().getFullYear();
banners.application = "/*! <%= pkg.description %> v<%= pkg.version %> - <%= pkg.author.name %> - Copyright <%= pkg.year %> <%= pkg.author.company %> */\n";
banners.vendors = "/*! <%= pkg.description %> v<%= pkg.version %> - <%= pkg.author.name %> - Vendor package */\n";



//load configuration from yaml files
fs.readdirSync(optionsPath).filter(function (optFile) {
    //accept just js files
    return path.extname(optFile) === '.js' && optFile.indexOf('.conf.') === -1;
}).forEach(function (optFile) {
    var key = _.camelCase(path.basename(optFile, path.extname(optFile)));

    if (key === 'properties') {
        //properties are merged directly in options, so they are overriddable by cli
        _.assign(options, require(optionsPath + '/' + optFile));
    } else {
        options[key] = require(optionsPath + '/' + optFile);
    }

});

_.forOwn({
    production: false,
    command: null,
    remotehost: null //be explicit!
}, function (value, key) {
    options[key] = argv.hasOwnProperty(key) ? argv[key] : value;
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
    var parts = type.split('.'),
        paths = options.paths,
        folderPath;
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

fs.readdirSync(taskPath).filter(function (taskFile) {
    //accept just js files
    return path.extname(taskFile) === '.js';
}).forEach(function (taskFile) {
    require(taskPath + '/' + taskFile)(gulp, $, options);
});


gulp.task('default', ['clean'], function (done) {

    var tasks = [
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
    runSequence.apply(null, tasks);
});

gulp.task('dev', ['default']);


gulp.task('dist', function () {
    $.util.log($.util.colors.red('`dist` task has been removed. Please run `gulp --production`'));
    // emit the end event, to properly end the task
    this.emit('end');
});

if (options.buildOnly) {
    gulp.task('build', function (done) {

        var testHash = require('crypto').createHash('md5').update(fs.readFileSync(__filename, {encoding: 'utf8'})).digest('hex');

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

    gulp.task('deploy', function (done) {
        var tasks = ['default'];

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

        runSequence.apply(null, tasks);
    });
}