module.exports = function (gulp, $, options) {

    var srcPath = options.assetsPath('src.js'),
        destPath = options.assetsPath('dist.js');

    if (options.production) {
        destPath = destPath.replace(options.paths.dist.root, options.paths.tmp);
    }

    gulp.task('scripts', function () {
        return gulp.src([srcPath +  '/**/*.js', '!' + srcPath +  '/**/*.{spec,conf}.js'])
            .pipe(gulp.dest(destPath))
            .pipe($.size({title: 'scripts'}));
    });

};


