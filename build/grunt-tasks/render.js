/**
 * Static EJS Render Task
 * ===============================
 */
/*jshint node:true, camelcase:false */

var loremIpsum = require('lorem-ipsum'),
    marked = require('marked'),
    ejs = require('ejs'),
    _ = require('lodash');


module.exports = function (grunt) {

    var helpers = {
                getConfig: function (prop) {
                    return grunt.config.get(prop);
                },
                getAsset: function (relPath, type) {
                    var www = grunt.config.get('paths.www'),
                        regexp = new RegExp('^' + (www || 'www') + '\\\/'),
                        assetPath = grunt.config.get('paths.' + (type || 'images')) || '';

                    return assetPath.replace(regexp, '/') + relPath;
                },
                lorem: function (min, max, config) {
                    var count = max ? _.random(min, max) : min,
                        defaults = {
                            units: 'words',
                            count: count
                        },
                        conf = _.defaults(config || {}, defaults);

                    return loremIpsum(conf);
                },
                md: function (src) {
                    return marked(src);
                }
        };

    //setup ejs alias
    grunt.registerTask('ejs', function(target) { grunt.task.run(['render:' + target || 'dev']); });

    return {
        options: {
            data: ['<%= paths.fixtures %>/{,*/}*.json'],
            config: {
                cache: true
            },
            render: function (src, filepath, options) {
                var data = options.data || {},
                    config = options.config || {};

                config.filename = filepath;
                data.helpers = helpers;
                data._ = _;
                return ejs.render(src, data, config);
            }
        },

        dev: {
            files: [
                {
                    expand: true,
                    cwd: '<%= paths.views %>/',
                    src: ['{,*/}<%= properties.viewmatch %>', '!{,*/}_*.*'], //render all views except those starting with `_` ala SASS
                    dest: '<%= paths.html %>'
                }
            ]
        },
        dist: {
            files: '<%= render.dev.files %>'
        }
    };
};