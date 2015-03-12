/**
 * Modernizr Custom Build
 * ===============================
 */
/*jshint node:true, camelcase:false */
module.exports = {

    dist: {

        // [REQUIRED] Path to the build you're using for development.
        devFile: '<%= paths.vendor %>/modernizr/modernizr.js',

        // [REQUIRED] Path to save out the built file.
        outputFile: '<%= paths.vendor %>/dist/modernizr.min.js',

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
                '<%= paths.js %>/**/*.js',
                '!<%= paths.js %>/**/*.min.js',
                '<%= paths.css %>/**/*.css'
            ]
        },

        // When parseFiles = true, matchCommunityTests = true will attempt to
        // match user-contributed tests.
        matchCommunityTests: false,

        // Have custom Modernizr tests? Add paths to their location here.
        customTests: []
    }
};