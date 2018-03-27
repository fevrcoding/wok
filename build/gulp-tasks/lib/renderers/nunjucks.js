/**
 * View Compilation Helpers
 */

const random = require('lodash/random');
const defaults = require('lodash/defaults');
const loremIpsum = require('lorem-ipsum');

const nunjucksEnv = (viewPath) => {

    const nunjucks = require('nunjucks');
    const marked = require('marked');
    const Markdown = require('nunjucks-markdown/lib/markdown_tag');


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



module.exports.createRenderer = (viewPaths, options, helpers) => {

    const matchRegExp = /\.(njk|html)$/;

    const defaultHelpers = {
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

    let env;

    return {
        get env() {
            return env;
        },
        name: 'nunjucks',
        extensions: ['njk', 'html'],
        match: (filepath) => matchRegExp.test(filepath),
        render(string, locals) {
            //lazy load renderer
            if (!env) {
                env = nunjucksEnv(viewPaths, options);
                env.addGlobal('helpers', Object.assign({}, defaultHelpers, helpers && helpers(options)));
                env.addGlobal('_', require('lodash'));
            }
            return env.renderString(string, locals);
        }
    };
};