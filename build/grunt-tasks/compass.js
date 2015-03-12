/**
 * SASS Compilation Tasks
 * ===============================
 */
/*jshint node:true, camelcase:false */
var path = require('path');
module.exports = function (grunt) {

    return {

        options: {
            config: path.normalize(process.cwd() + '/build/compass.rb'),
            bundleExec: grunt.file.exists(path.join(process.cwd(), 'Gemfile'))
        },

        watch: {
            options: {
                watch: true
            }
        },

        dev: {},

        dist: {
            options: {
                force: true,
                environment: 'production',
                outputStyle: 'expanded' //there's an external task to minify css
            }
        }
    };
};