/**
 * CSS Post processor Task
 * ===============================
 */
/*jshint node:true, camelcase:false */


var autoprefixer = require('autoprefixer-core'),
    assets  = require('postcss-assets'),
    _ = require('lodash');

module.exports = function (grunt, options) {

    var basePath = grunt.template.process('<%= paths.www %>/', {data: options});

    var autoPrefixerConf = {
        browsers: ['> 1%', 'last 2 versions', 'ie 8', 'ie 9']
    };

    var assetsConf = {
        loadPaths: ['<%= paths.fonts %>/', '<%= paths.images %>/'].map(function (path) {
            return grunt.template.process(path, {data: options}).replace(new RegExp('^' + _.escapeRegExp(basePath)), '');
        }),
        basePath: basePath
    };

    return {
        dev: {
            options: {
                map: false,
                processors: [
                    autoprefixer(autoPrefixerConf).postcss,
                    assets(_.assign({cachebuster: true}, assetsConf))
                ]
            },
            src: '<%= paths.css %>/**/*.css'
        },
        dist: {
            options: {
                map: false,
                processors: [
                    autoprefixer(autoPrefixerConf).postcss,
                    assets(assetsConf)
                ]
            },
            src: '<%= paths.css %>/**/*.css'
        }
    };

};