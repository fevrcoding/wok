
var autoprefixer = require('autoprefixer-core');
var assets  = require('postcss-assets');

module.exports = function () {

    return {
        options: {
            map: true,
            processors: [
                autoprefixer({browsers: ['> 1%', 'last 2 versions', 'ie 8', 'ie 9']}).postcss,
                assets({
                    loadPaths: ['<%= paths.fonts %>/', '<%= paths.images %>/'],
                    basePath: '<%= paths.www %>/',
                    cachebuster: true
                })
            ]
        },
        dev: {
            src: '<%= paths.css %>/**/*.css'
        },
        dist: {
        }
    };

};