/**
 * Modernizr Custom Build Task
 * ===============================
 */

module.exports = function (gulp, $, options) {

    var distConfig = {

        cache: true,

        devFile: false,

        dest: options.paths.tmp + '/assets/vendors/modernizr/modernizr.js',

        // Based on default settings on http://modernizr.com/download/
        options: [
            'setClasses',
            'addTest',
            'html5printshiv',
            'testProp',
            'fnBind',
            'atRule',
            'domPrefixes',
            'hasEvent',
            'html5shiv',
            'mq',
            'prefixed',
            'prefixes',
            'prefixedCSS',
            'testAllProps',
            'testStyles'
        ],

        // By default, source is uglified before saving
        uglify: true,

        // Define any tests you want to explicitly include
        tests: [
            'pointerevents',
            'touchevents'
        ],

        // Useful for excluding any tests that this tool will match
        // e.g. you use .notification class for notification elements,
        // but don’t want the test for Notification API
        excludeTests: [],

        // By default, will crawl your project for references to Modernizr tests
        // Set to false to disable
        crawl: true,

        // Set to true to pass in buffers via the "files" parameter below
        useBuffers: false,

        // By default, this task will crawl all *.js, *.css, *.scss files.
        files: {
            src: [
                options.assetsPath('src.js', '**/*.js'),
                '!' + options.assetsPath('src.js', '**/*.{spec,conf}.js'),
                options.assetsPath('dist.css', '**/*.css')
            ]
        },

        // Have custom Modernizr tests? Add them here.
        customTests: []
    };


    gulp.task('modernizr', function (done) {
        var fs = require('fs'),
            filePath = options.assetsPath('dist.vendors',  '/modernizr'),
            fullConfig,
            modernizr;

        require('mkdirp').sync(filePath);

        if (options.production) {
            modernizr = require('customizr');
            modernizr(distConfig, function () {
                done();
            });
        } else {
            //full build
            modernizr = require('modernizr');
            fullConfig = require('../gulp-config/modernizr.conf.json');
            modernizr.build(fullConfig, function (result) {
                fs.writeFile(filePath + '/modernizr.js', result, done);
            });
        }



    });

};


