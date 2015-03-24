/**
 * Node-Sass Task
 * ===============================
 */

//NOTE: `functions` option won't work until node-sass 3.0.x is released

/*jshint node:true, camelcase:false */
module.exports = {

    options: {
        includePaths: ['<%= paths.vendor %>'],
        indentedSyntax: true,
        outputStyle: 'nested', //there's an external task to minify css
        precision: 10
    },

    dev: {
        options: {
            sourceMap: true,
            functions: {
                'build-env()': function () {
                    return 'development';
                }
            }
        },
        files: [{
            expand: true,
            cwd: '<%= paths.sass %>/',
            src: ['**/*.{sass,scss}'],
            dest: '<%= paths.css %>',
            ext: '.css'
        }]
    },

    dist: {
        options: {
            sourceMap: false,
            functions: {
                'build-env()': function () {
                    return 'production';
                }
            }
        },
        files: '<%= sass.dev.files %>'
    }
};
