/**
 * View Compilation Helpers
 */

const _ = require('lodash');
const random = require('lodash/random');
const defaults = require('lodash/defaults');
const nunjucks = require('nunjucks');
const marked = require('marked');
const Markdown = require('nunjucks-markdown/lib/markdown_tag');
const loremIpsum = require('lorem-ipsum');

const nunjucksEnv = (viewPath) => {
    const env = nunjucks.configure(viewPath, {
        noCache: true
    });

    const markdownTag = new Markdown(env, marked);

    markdownTag.fileTag = (context, file) => {
        return new nunjucks.runtime.SafeString(marked(env.render(file, context)));
    };

    // Markdown rendering for the block. Pretty simple, just get the body text and pass
    // it through the markdown renderer.
    markdownTag.blockTag = (context, bodFn, tabStartFn) => {

        let body = bodFn(); //eslint-disable-line no-var
        const tabStart = tabStartFn(); // The column options of the {% markdown %} tag.

        if (tabStart > 0) { // If the {% markdown %} tag is tabbed in, normalize the content to the same depth.
            body = body.split(/\r?\n/); // Split into lines.
            // Subtract the column options from the start of the string.
            body = body.map((line) => line.slice(tabStart));
            body = body.join('\n'); // Rejoin into one string.
        }

        return new nunjucks.runtime.SafeString(marked(body));
    };

    env.addExtension('markdown', markdownTag);

    return env;

};

const defaultHelpers = (/*options*/) => {

    return {
        lorem(min, max, config) {
            const count = max ? random(min, max) : min;
            const loremDefaults = {
                units: 'words',
                count
            };
            const conf = defaults(config || {}, loremDefaults);

            return loremIpsum(conf);
        }
    };

};

const noopHelper = () => ({});

module.exports.createRenderer = (viewPaths, options, helpers = noopHelper) => {

    const env = nunjucksEnv(viewPaths, options);

    env.addGlobal('helpers', Object.assign(helpers(options), defaultHelpers(options)));
    env.addGlobal('_', _);

    return {
        env,
        render(string, locals) {
            return env.renderString(string, locals);
        }
    };
};