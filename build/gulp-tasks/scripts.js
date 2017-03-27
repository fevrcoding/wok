/**
 * JavaScript Related Task
 * ===============================
 */

module.exports = (gulp, $, options) => {

    const paths = require('../gulp-config/paths');
    const srcPath = paths.toPath('src.assets/js');
    const jsPath = paths.toPath('dist.assets/js');
    const destPath = options.production ? jsPath.replace(paths.toPath('dist.root'), paths.get('tmp')) : jsPath;

    gulp.task('scripts', () => {

        return gulp.src([srcPath + '/**/*.js', '!' + srcPath + '/**/*.{spec,conf}.js'])
            .pipe($.plumber({
                errorHandler: $.notify.onError('Error: <%= error.message %>')
            }))
            .pipe($.babel())
            .pipe(gulp.dest(destPath))
            .pipe($.if(options.isWatching, $.notify({ message: 'Scripts Compiled', onLast: true })))
            .pipe($.size({ title: 'scripts' }));
    });

};