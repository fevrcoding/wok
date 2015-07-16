/**
 * View Compilation Helpers
 */

'use strict';


var _ = require('lodash'),
    loremIpsum = require('lorem-ipsum'),
    marked = require('marked');

module.exports = function (options) {

    return {
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

};