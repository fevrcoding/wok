/**
 * Images Task
 * ===============================
 */
const paths = require('../gulp-config/paths');
const { getNotifier } = require('./lib/plugins');

module.exports = (gulp, $, options) => () => {
    const destPath = paths.toPath('dist.assets/images');
    const filesMatch = '**/*.{png,jpg,gif,svg,webp}';
    const plugins = [];
    const { production } = options;
    const { notify } = getNotifier(options);

    plugins.push($.imagemin.svgo({
        plugins: [
            { cleanupIDs: false },
            { removeViewBox: false }
        ]
    }));

    if (production) {
        plugins.push(
            $.imagemin.jpegtran({ progressive: false }),
            $.imagemin.gifsicle({ interlaced: true }),
            $.imagemin.optipng()
        );
    }

    return gulp.src(paths.toPath(`src.assets/images/${filesMatch}`))
        .pipe($.imagemin(plugins))
        .pipe($.if(production, $.rev()))
        .pipe(gulp.dest(destPath))
        .pipe($.if(production, $.rev.manifest({ merge: true, path: paths.toPath('dist.root/dist.revmap') })))
        .pipe($.if(production, gulp.dest('.')))
        .pipe(notify({ message: 'Images Processed', onLast: true }))
        .pipe($.size({ title: 'images' }));

};