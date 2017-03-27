/**
 * Images Task
 * ===============================
 */

module.exports = (gulp, $, options) => {

    const paths = require('../gulp-config/paths');
    const destPath = paths.toPath('dist.assets/images');
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

        return gulp.src(paths.toPath(`src.assets/images/${filesMatch}`))
            .pipe($.imagemin(plugins))
            .pipe($.if(options.production, $.rev()))
            .pipe(gulp.dest(destPath))
            .pipe($.if(options.production, $.rev.manifest({ merge: true, path: paths.toPath('dist.root/dist.revmap') })))
            .pipe($.if(options.production, gulp.dest('.')))
            .pipe($.if(options.isWatching, $.notify({ message: 'Images Processed', onLast: true })))
            .pipe($.size({ title: 'images' }));
    });

};