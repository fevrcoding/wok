/**
 * Images Task
 * ===============================
 */



var path = require('path'),
    lazypipe = require('lazypipe');

module.exports = function (gulp, $, options) {

    var paths = options.paths;

    var productionPipe = lazypipe()
        .pipe($.imagemin, {
            progressive: false,
            interlaced: true,
            svgoPlugins: [{
                cleanupIDs: false,
                removeViewBox: false
            }]
        })
        .pipe($.rev);

    gulp.task('images', function () {

        return gulp.src(options.assetsPath('src.images', '**/*.{png,jpg,gif,svg,webp}'))
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

