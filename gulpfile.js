/**
 * Grunt build tasks
 */

/*jshint node:true */

'use strict';

var fs = require('fs'),
    path = require('path'),
    gulp = require('gulp'),
    runSequence = require('run-sequence'),
    _ = require('lodash'),
    moment = require('moment'),
    $ = require('gulp-load-plugins')(),
    yargs = require('yargs'),
    pkg = require('./package.json'),
    taskPath = path.join(process.cwd(), 'build', 'gulp-tasks'),
    optionsPath = path.join(process.cwd(), 'build', 'gulp-config'),
    options = {},
    banners = {},
    taskList;


pkg.year = moment().format('YYYY');
banners.application = "/*! <%= pkg.description %> v<%= pkg.version %> - <%= pkg.author.name %> - Copyright <%= pkg.year %> <%= pkg.author.company %> */"
banners.vendors = "/*! <%= pkg.description %> v<%= pkg.version %> - <%= pkg.author.name %> - Vendor package */";






//load configuration from yaml files
fs.readdirSync(optionsPath).filter(function (optFile) {
    //accept just js files
    return path.extname(optFile) === '.js';
}).forEach(function (optFile) {
    var key = _.camelCase(path.basename(optFile, path.extname(optFile)));

    if (key === 'properties') {
        //properties are merged directly in options, so they are overriddable by cli
        _.assign(options, require(optionsPath + '/' + optFile));
    } else {
        options[key] = require(optionsPath + '/' + optFile);
    }

});

var flags = _.forOwn({
    production: false
}, function (value, key) {
    options[key] = _.has(yargs.argv, key) ? yargs.argv[key] : value;
});

options.pkg = pkg;
options.banners = banners;

options.assetsPath = function (type, match) {
    var parts = type.split('.'),
        paths = options.paths;
    if (parts.length > 1) {
        var folderPath = path.join(paths[parts[0]].assets, paths[parts[1]]);
    } else {
        var folderPath = path.normalize(paths[parts[0]].assets);
    }
    if (match) {
        folderPath = path.join(folderPath, match);
    }
    return folderPath;
};

taskList = fs.readdirSync(taskPath).filter(function (taskFile) {
    //accept just js files
    return path.extname(taskFile) === '.js';
}).forEach(function (taskFile) {
    require(taskPath + '/' + taskFile)(gulp, $, options);
});


gulp.task('default', ['clean'], function (done) {
    runSequence(
        ['images', 'fonts', 'media'],
        ['styles', 'scripts'],
        ['views'],
        done
    );
});