/**
 * View Compilation Helpers
 */

'use strict';


var _ = require('lodash'),
    nunjucks = require('nunjucks'),
    marked = require('marked'),
    Markdown = require('nunjucks-markdown/lib/markdown_tag'),
    loremIpsum = require('lorem-ipsum');

module.exports.helpers = function (options) {

    return {
        lorem: function (min, max, config) {
            var count = max ? _.random(min, max) : min,
                defaults = {
                    units: 'words',
                    count: count
                },
                conf = _.defaults(config || {}, defaults);

            return loremIpsum(conf);
        }
    };

};

module.exports.nunjucks = function (viewPath) {
    var env = nunjucks.configure(viewPath, {
        noCache: true
    });

    var markdownTag = new Markdown(env, marked);

    markdownTag.fileTag = function (context, file) {
        return new nunjucks.runtime.SafeString(marked(env.render(file, context)));
    };

    // Markdown rendering for the block. Pretty simple, just get the body text and pass
    // it through the markdown renderer.
    markdownTag.blockTag = function (context, bodFn, tabStartFn) {

        var body = bodFn();
        var tabStart = tabStartFn(); // The column postion of the {% markdown %} tag.

        if (tabStart > 0) { // If the {% markdown %} tag is tabbed in, normalize the content to the same depth.
            body = body.split(/\r?\n/); // Split into lines.
            body = body.map(function (line) {
                return line.slice(tabStart); // Subtract the column postion from the start of the string.
            });
            body = body.join("\n"); // Rejoin into one string.
        }

        return new nunjucks.runtime.SafeString(marked(body));
    };

    env.addExtension('markdown', markdownTag);

    return env;

};