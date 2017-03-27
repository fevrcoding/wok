/**
 * Modernizr Custom Build Task
 * ===============================
 */

module.exports = (gulp, $, options) => {

    const defaultConfig = require('../gulp-config/modernizr.conf.json');
    const paths = require('../gulp-config/paths');
    const tmpPath = paths.toPath('dist.assets/vendors').replace(paths.toPath('dist.root'), paths.get('tmp'));

    const distConfig = {

        cache: true,

        devFile: false,

        dest: `${tmpPath}/modernizr/modernizr.js`,

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
                paths.toPath('src.assets/js/**/*.js'),
                '!' + paths.toPath('src.assets/js/**/*.{spec,conf}.js'),
                paths.toPath('dist.assets/css/**/*.css')
            ]
        },

        // Have custom Modernizr tests? Add them here.
        customTests: []
    };


    gulp.task('modernizr', ['modernizr:html5shiv'], (done) => {
        const fs = require('fs');
        const filePath = paths.toPath('dist.assets/vendors/modernizr');


        require('mkdirp').sync(filePath);

        if (options.production) {
            const customizr = require('customizr');
            customizr(distConfig, (obj) => {
                const tests = obj.options['feature-detects'];
                const colors = $.util.colors;
                let logStr = 'The production build includes the following tests: ';
                if (tests.length > 0) {

                    logStr += colors.bold(tests.map((test) => {
                        return test.replace('test/', '');
                    }).join(', '));

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
            const modernizr = require('modernizr');
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
            .pipe(gulp.dest(paths.toPath('dist.assets/vendors/html5shiv') + '/dist'));
    });

};