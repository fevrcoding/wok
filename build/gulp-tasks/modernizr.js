/**
 * Modernizr Custom Build Task
 * ===============================
 */

module.exports = function (gulp, $, options) {

    const defaultConfig = require('../gulp-config/modernizr.conf.json');

    const distConfig = {

        cache: true,

        devFile: false,

        dest: options.paths.tmp + '/assets/vendors/modernizr/modernizr.js',

        // Based on default settings on http://modernizr.com/download/
        options: defaultConfig.options,

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


    gulp.task('modernizr', ['modernizr:html5shiv'], (done) => {
        const fs = require('fs');
        const filePath = options.assetsPath('dist.vendors', '/modernizr');
        var modernizr; //eslint-disable-line no-var

        require('mkdirp').sync(filePath);

        if (options.production) {
            modernizr = require('customizr');
            modernizr(distConfig, (obj) => {
                const tests = obj.options['feature-detects'];
                const colors = $.util.colors;

                var logStr = 'The production build includes the following tests: '; //eslint-disable-line no-var

                if (tests.length > 0) {

                    logStr += colors.bold(tests.map((test) => test.replace('test/', '')).join(', '));

                    $.util.log(logStr);

                    $.util.log(
                        'For optimal performances you might add a `defer` attribute to the script tag. ' +
                        'Refer to https://github.com/Modernizr/Modernizr/issues/878#issuecomment-41448059 for guidelines'
                    );
                }

                done();
            });
        } else {
            //full build
            modernizr = require('modernizr');
            const fullConfig = require('../gulp-config/modernizr.conf.json');
            modernizr.build(fullConfig, (result) => {
                fs.writeFile(filePath + '/modernizr.js', result, done);
            });
        }



    });

    gulp.task('modernizr:html5shiv', () => {

        const path = require('path');
        const html5shivPath = path.join(path.dirname(require.resolve('html5shiv')), '*.min.js');

        return gulp.src([html5shivPath])
            .pipe(gulp.dest(options.assetsPath('dist.vendors', 'html5shiv/dist')));
    });

};