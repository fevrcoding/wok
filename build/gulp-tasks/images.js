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
            .pipe(
                gulp.dest(options.assetsPath('dist.css'))
            )
            .pipe($.size({title: 'images'}));

    });

};

