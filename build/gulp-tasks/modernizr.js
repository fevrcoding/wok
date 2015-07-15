/**
 * Modernizr Custom Build Task
 * ===============================
 */

var path = require('path'),
    modernizr = require('./lib/modernizr');

module.exports = function (gulp, $, options) {

    var paths = options.paths;

    var distConfig = {

        // [REQUIRED] Path to the build you're using for development.
        devFile: options.assetsPath('src.vendors', 'modernizr/modernizr.js'),

        // [REQUIRED] Path to save out the built file.
        outputFile: options.paths.tmp + '/modernizr/modernizr.min.js',

        // Based on default settings on http://modernizr.com/download/
        extra: {
            shiv: true,
            printshiv: false,
            load: false, //exclude yepnope
            mq: true,
            cssclasses: true
        },

        // Based on default settings on http://modernizr.com/download/
        extensibility: {
            addtest: false,
            prefixed: false,
            teststyles: false,
            testprops: false,
            testallprops: false,
            hasevents: false,
            prefixes: false,
            domprefixes: false
        },

        // By default, source is uglified before saving
        uglify: true,

        // Define any tests you want to impliticly include.
        tests: ['touch'],

        // By default, this task will crawl your project for references to Modernizr tests.
        // Set to false to disable.
        parseFiles: true,

        // When parseFiles = true, this task will crawl all *.js, *.css, *.scss files, except files that are in node_modules/.
        // You can override this by defining a 'files' array below.
        files: {
            src: [
                options.assetsPath('src.js', '**/*.js'),
                '!' + options.assetsPath('src.js', '**/*.{spec,conf}.js'),
                options.assetsPath('dist.css', '**/*.css')
            ]
        },

        // When parseFiles = true, matchCommunityTests = true will attempt to
        // match user-contributed tests.
        matchCommunityTests: false,

        // Have custom Modernizr tests? Add paths to their location here.
        customTests: []
    };


    gulp.task('modernizr', function () {



        if (!options.production) {
            return gulp.src(options.assetsPath('src.vendors', 'modernizr/modernizr.js'))
                .pipe(gulp.dest(options.assetsPath('dist.vendors') + '/modernizr'));
        } else {
            return gulp.src(options.assetsPath('src.vendors', 'modernizr/modernizr.js'))
                .pipe(modernizr(distConfig))
                .pipe($.rename({extname: '.min.js'}))
                .pipe($.rev())
                .pipe(gulp.dest(options.assetsPath('dist.vendors') + '/modernizr'))
                .pipe($.rev.manifest(path.join(paths.dist.root, paths.dist.revmap), {merge: true}))
                .pipe(gulp.dest('.'));
        }

    });

};


