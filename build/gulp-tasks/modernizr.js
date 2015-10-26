/**
 * Modernizr Custom Build Task
 * ===============================
 */

var path = require('path');

module.exports = function (gulp, $, options) {

    var paths = options.paths;

    var distConfig = {

        cache: true,

        devFile: false,

        dest: options.paths.tmp + '/modernizr/modernizr.min.js',

        // Based on default settings on http://modernizr.com/download/
        options: [
            'setClasses',
            'addTest',
            'html5printshiv',
            'testProp',
            'fnBind'
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


    //gulp.task('modernizr', function () {
    //
    //
    //
    //    if (!options.production) {
    //        return gulp.src(options.assetsPath('src.vendors', 'modernizr/modernizr.js'))
    //            .pipe(gulp.dest(options.assetsPath('dist.vendors') + '/modernizr'));
    //    }
    //        return gulp.src(options.assetsPath('src.vendors', 'modernizr/modernizr.js'))
    //            .pipe(modernizr(distConfig))
    //            .pipe($.rename({extname: '.min.js'}))
    //            .pipe($.rev())
    //            .pipe(gulp.dest(options.assetsPath('dist.vendors') + '/modernizr'))
    //            .pipe($.rev.manifest(path.join(paths.dist.root, paths.dist.revmap), {merge: true}))
    //            .pipe(gulp.dest('.'));
    //});



    gulp.task('modernizr', function (done) {
        var fs = require('fs'),
            modernizr = require('modernizr'),
            customizr = require('customizr'),
            fullConfig = require('modernizr/lib/config-all.json'),
            filePath = options.assetsPath('dist.vendors',  '/modernizr');


        require('mkdirp').sync(filePath);

        if (options.production) {
            customizr(distConfig, function () {
                done();
            });
        } else {
            //full build
            modernizr.build(fullConfig, function (result) {
                fs.writeFile(filePath + '/modernizr.js', result, done);
            });
        }



    });

};


