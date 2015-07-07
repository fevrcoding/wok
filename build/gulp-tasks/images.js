module.exports = function (gulp, $, options) {

    gulp.task('images', function () {

        return gulp.src(options.assetsPath('src.images', '**/*.{png,jpg,gif,svg}'))
            .pipe($.cache($.imagemin({
                progressive: false,
                interlaced: true,
                svgoPlugins: [{
                    cleanupIDs: false,
                    removeViewBox: false
                }]
            })))
            .pipe($.if(options.production, $.rev()))
            .pipe(
                gulp.dest(options.assetsPath('dist.images'))
            )
            .pipe($.if(options.production, $.rev.manifest(options.paths.dist.revmap, {merge: true})))
            .pipe($.size({title: 'images'}));

    });

};

