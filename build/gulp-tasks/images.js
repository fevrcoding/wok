/**
 * Images Task
 * ===============================
 */

module.exports = function (gulp, $, options) {

    var productionPipe = $.util.noop,
        filesMatch = '**/*.{png,jpg,gif,svg,webp}';

    gulp.task('images', function () {

        if (options.production) {
            productionPipe = require('lazypipe')()
                .pipe($.imagemin, {
                    progressive: false,
                    interlaced: true,
                    svgoPlugins: [{
                        cleanupIDs: false,
                        removeViewBox: false
                    }]
                })
                .pipe($.rev);
        }

        return gulp.src(options.assetsPath('src.images', filesMatch))
            .pipe($.changed(options.assetsPath('dist.images')))
            .pipe($.if('*.svg', $.imagemin({
                svgoPlugins: [{
                    cleanupIDs: false,
                    removeViewBox: false
                }]
            })))
            .pipe($.if(options.production, productionPipe()))
            .pipe(
                gulp.dest(options.assetsPath('dist.images'))
            )
            .pipe($.if(options.production, $.rev.manifest(path.join(paths.dist.root, paths.dist.revmap), {merge: true})))
            .pipe($.if(options.production, gulp.dest('.')))
            .pipe($.if(options.isWatching, $.notify({ message: 'Images Processed', onLast: true })))
            .pipe($.size({title: 'images'}));

    });

};

