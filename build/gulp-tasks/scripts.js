/**
 * JavaScript Related Task
 * ===============================
 */

const paths = require('../gulp-config/paths');

const srcPath = paths.toPath('src.assets/js');
const jsPath = paths.toPath('dist.assets/js');
const rootPath = paths.toPath('dist.root');

module.exports = (gulp, $, options) => () => {
    const {isWatching, production, enableNotify } = options;
    const destPath = production ? jsPath.replace(rootPath, paths.get('tmp')) : jsPath;

    return gulp.src([`${srcPath}/**/*.js`, `!${srcPath}/**/*.{spec,conf}.js`])
        .pipe($.plumber({
            errorHandler: $.notify.onError('Error: <%= error.message %>')
        }))
        .pipe($.babel())
        .pipe(gulp.dest(destPath))
        .pipe($.if(isWatching && enableNotify, $.notify({ message: 'Scripts Compiled', onLast: true })))
        .pipe($.size({ title: 'scripts' }));

};