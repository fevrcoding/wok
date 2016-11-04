/**
 * Images Task
 * ===============================
 */

module.exports = function (gulp, $, options) {

    const path = require('path');
    const paths = options.paths;
    const filesMatch = '**/*.{png,jpg,gif,svg,webp}';
    const plugins = [];

    plugins.push($.imagemin.svgo({
        plugins: [
            { cleanupIDs: false },
            { removeViewBox: false }
        ]
    }));

    if (options.production) {
        plugins.push(
            $.imagemin.jpegtran({ progressive: false }),
            $.imagemin.gifsicle({ interlaced: true }),
            $.imagemin.optipng()
        );
    }

    gulp.task('images', () => {

        return gulp.src(options.assetsPath('src.images', filesMatch))
            .pipe($.imagemin(plugins))
            .pipe($.if(options.production, $.rev()))
            .pipe(gulp.dest(options.assetsPath('dist.images')))
            .pipe($.if(options.production, $.rev.manifest(path.join(paths.dist.root, paths.dist.revmap), { merge: true })))
            .pipe($.if(options.production, gulp.dest('.')))
            .pipe($.if(options.isWatching, $.notify({ message: 'Images Processed', onLast: true })))
            .pipe($.size({ title: 'images' }));
    });

};