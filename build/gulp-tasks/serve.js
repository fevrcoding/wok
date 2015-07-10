var browserSync = require('browser-sync'),
    reload = browserSync.reload;

module.exports = function (gulp, $, options) {

    var paths = options.paths,
        assetsPath = options.assetsPath;

    // Watch Files For Changes & Reload
    gulp.task('serve', ['default'], function () {

        options.isWatching = true;

        browserSync.init(null, {
            watchTask: true,
            notify: true,
            server: {
                baseDir: options.paths.dist.root
            },
            snippetOptions: {
                async: true,
                whitelist: [],
                blacklist: [],
                rule: {
                    match: /<\/head[^>]*>/i,
                    fn: function (snippet, match) {
                        return snippet + match;
                    }
                }
            }
        });

        gulp.watch([assetsPath('src.sass') + '/**/*.{scss,sass}'], ['styles']);
        gulp.watch([assetsPath('src.images', '**/*.{png,jpg,gif,svg,webp}')], ['images', reload]);
        gulp.watch([assetsPath('src.fonts', '**/*.{eot,svg,ttf,woff,woff2}')], ['fonts', reload]);
        gulp.watch([assetsPath('src.video', '{,*/}*.*'), assetsPath('src.audio', '{,*/}*.*')], ['media', reload]);
        gulp.watch([
                assetsPath('src.js') +  '/**/*.js',
                '!' + assetsPath('src.js') +  '/**/*.{spec,conf}.js'
            ],
            ['scripts', reload]
        );
        gulp.watch([
                paths.src.views + '/{,*/}' + options.viewmatch,
                paths.src.documents + '/*.md',
                paths.src.fixtures + '/*.json'
            ],
            ['views', reload]
        );
    });
};

