/**
 * CSS Post processor Task
 * ===============================
 */
/*jshint node:true */


var autoprefixer = require('autoprefixer-core'),
    assets  = require('postcss-assets'),
    _ = require('lodash');

module.exports = function (grunt, options) {

    var basePath = grunt.template.process('<%= paths.dist.root %>/', {data: options});

    var autoPrefixerConf = {
        browsers: ['> 1%', 'last 2 versions', 'ie 9']
    };

    var assetsConf = {
        loadPaths: ['<%= paths.dist.assets %>/<%= paths.fonts %>/', '<%= paths.dist.assets %>/<%= paths.images %>/'].map(function (path) {
            return grunt.template.process(path, {data: options}).replace(new RegExp('^' + _.escapeRegExp(basePath)), '');
        }),
        basePath: basePath
    };

    return {
        dev: {
            options: {
                map: true,
                processors: [
                    autoprefixer(autoPrefixerConf),
                    assets(_.assign({cachebuster: true}, assetsConf))
                ]
            },
            src: ['<%= paths.dist.assets %>/<%= paths.css %>/**/*.css', '!<%= paths.dist.assets %>/<%= paths.css %>/**/*-ie.css']
        },
        legacydev: {
            options: {
                map: true,
                processors: [
                    autoprefixer({browsers: ['ie 8']}),
                    require('postcss-pseudoelements')(),
                    require('postcss-color-rgba-fallback')(),
                    assets(_.assign({cachebuster: true}, assetsConf))
                ]
            },
            src: '<%= paths.dist.assets %>/<%= paths.css %>/**/*-ie.css'
        },

        dist: {
            options: {
                map: false,
                processors: [
                    autoprefixer(autoPrefixerConf),
                    assets(assetsConf)
                ]
            },
            src: ['<%= paths.dist.assets %>/<%= paths.css %>/**/*.css', '!<%= paths.dist.assets %>/<%= paths.css %>/**/*-ie.css']
        },
        legacydist: {
            options: {
                map: false,
                processors: [
                    autoprefixer({browsers: ['ie 8']}),
                    require('postcss-pseudoelements')(),
                    assets(assetsConf)
                ]
            },
            src: '<%= paths.dist.assets %>/<%= paths.css %>/**/*-ie.css'
        }
    };

};