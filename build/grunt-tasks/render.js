/**
 * Static EJS Render Task
 * ===============================
 */
/*jshint node:true, camelcase:false */
module.exports = function (grunt) {

    var loremIpsum = require('lorem-ipsum');

    return {
        options: {
            helpers: {
                getConfig : function (prop) {
                    return grunt.config.get(prop);
                },
                getAsset: function (relPath, type) {
                    var www = grunt.config.get('paths.www'),
                        regexp = new RegExp('^' +(www || 'www') + '\\\/'),
                        assetPath = grunt.config.get('paths.' + (type || 'images')) || '';

                    return assetPath.replace(regexp, '/') + relPath;
                },
                lorem: function (min, max, config) {
                    var _ = this._,
                        count = max ? _.random(min, max) : min,
                        defaults = {
                            units: 'words',
                            count: count
                        },
                        conf = _.defaults(config || {}, defaults);

                    return loremIpsum(conf);
                }
            },
            //custom option object. to be used to switch between env related blocks
            env: {}
        },
        html: {
            files: [
                {
                    expand: true,
                    cwd: '<%= paths.views %>/',
                    src: ['{,*/}<%= properties.viewmatch %>', '!{,*/}_*.*'], //render all views except those starting with `_` ala SASS
                    dest: '<%= paths.html %>'
                }
            ],
                options: {
                data: ['<%= paths.fixtures %>/{,*/}*.json'],
                    partialPaths: ['<%= paths.documents %>', '<%= paths.views %>/*']
            }
        }
    };
};