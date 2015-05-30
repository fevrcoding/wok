/**
 * Static EJS Render Task
 * ===============================
 */
/*jshint node:true */

var loremIpsum = require('lorem-ipsum'),
    marked = require('marked'),
    ejs = require('ejs'),
    _ = require('lodash');


module.exports = function (grunt) {

    var helpers = {
                getConfig: function (prop) {
                    return grunt.config.get(prop);
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

    return {
        options: {
            data: ['<%= paths.src.fixtures %>/{,*/}*.json'],
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
                    cwd: '<%= paths.src.views %>/',
                    src: ['{,*/}<%= properties.viewmatch %>', '!{,*/}_*.*'], //render all views except those starting with `_` ala SASS
                    dest: '<%= paths.dist.views %>'
                }
            ]
        },
        dist: {
            files: '<%= render.dev.files %>'
        }
    };
};