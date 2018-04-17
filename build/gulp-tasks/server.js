/**
 * Development Server Task
 * ===============================
 */

module.exports = (gulp, $, options) => {

    const isPlainObject = require('lodash/isPlainObject');
    const paths = require('../gulp-config/paths');
    const { development } = options.hosts;

    if (isPlainObject(development) === false) {
        throw new TypeError('You should define a `development` host object in your hosts.js file');
    }

    const { port = 8000, ui } = development;

    const serverConfigDefault = {
        notify: false,
        ghostMode: false,
        port,
        server: {
            baseDir: [paths.toPath('dist.root')]
        },
        snippetOptions: {
            async: true,
            whitelist: [],
            blacklist: [],
            rule: {
                match: /<\/head[^>]*>/i,
                fn(snippet, match) {
                    if (!options.livereload) {
                        return match;
                    }
                    return snippet + match;
                }
            }
        }
    };

    process.on('SIGINT', () => {
        process.exit();
    });

    return (done) => {

        const { production, buildHash, livereload } = options;
        const browserSync = require('browser-sync').create(buildHash);

        const serverConf = Object.assign({}, serverConfigDefault, {
            middleware: require('./lib/middlewares')(options, browserSync)
        }, (livereload ? {
                ui
            } : {
                open: false,
                ui: false
            }));

        if (production) {
            serverConf.middleware.unshift(require('compression')());
        }

        browserSync.init(serverConf, (err) => {
            if (err) {
                done(err);
                return;
            }
            done();
        });

        process.on('exit', () => {
            browserSync.exit();
        });
    };
};