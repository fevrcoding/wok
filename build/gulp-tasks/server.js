/**
 * Development Server Task
 * ===============================
 */

module.exports = (gulp, $, options) => {

    const paths = require('../gulp-config/paths');
    const { ports } = options.hosts.development;

    const serverConfigDefault = {
        notify: false,
        ghostMode: false,
        port: ports.connect,
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
                    return ['<!--[if (gt IE 9) | (IEMobile)]><!-->', snippet, '<!--<![endif]-->', match].join('\n');
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
                ui: {
                    port: 3001,
                    weinre: {
                        port: ports.weinre
                    }
                }
            } : {
                open: false,
                ui: false
            })
        );

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