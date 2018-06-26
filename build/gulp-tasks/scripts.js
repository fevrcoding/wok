/**
 * JavaScript Related Task
 * ===============================
 */

const paths = require('../gulp-config/paths');

const srcPath = paths.toPath('src.assets/js');
const jsPath = paths.toPath('dist.assets/js');
const rootPath = paths.toPath('dist.root');
const { getNotifier } = require('./lib/plugins');

module.exports = (gulp, $, options) => () => {
    const { production } = options;
    const destPath = production ? jsPath.replace(rootPath, paths.get('tmp')) : jsPath;
    const { notify, errorHandler } = getNotifier(options);

    return gulp.src([`${srcPath}/**/*.js`, `!${srcPath}/**/*.{spec,conf}.js`])
        .pipe($.plumber({ errorHandler }))
        .pipe($.babel())
        .pipe(gulp.dest(destPath))
        .pipe(notify({ message: 'Scripts Compiled', onLast: true }))
        .pipe($.size({ title: 'scripts' }));

};