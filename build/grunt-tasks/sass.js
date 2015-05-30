/**
 * Node-Sass Task
 * ===============================
 */

/*jshint node:true */

var types = require('grunt-sass/node_modules/node-sass').types;

module.exports = {

    options: {
        includePaths: ['<%= paths.src.assets %>/<%= paths.vendors %>'],
        outputStyle: 'expanded', //there's an external task to minify css
        precision: 10
    },

    dev: {
        options: {
            sourceMap: true,
            functions: {
                'build-env()': function () {
                    return new types.String('development');
                }
            }
        },
        files: [{
            expand: true,
            cwd: '<%= paths.src.assets %>/<%= paths.sass %>/',
            src: ['**/*.{sass,scss}'],
            dest: '<%= paths.dist.assets %>/<%= paths.css %>',
            ext: '.css'
        }]
    },

    dist: {
        options: {
            sourceMap: false,
            functions: {
                'build-env()': function () {
                    return new types.String('production');
                }
            }
        },
        files: '<%= sass.dev.files %>'
    }
};
