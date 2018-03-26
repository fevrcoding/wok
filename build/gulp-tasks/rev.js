/**
 * Resource Revving Task
 * ===============================
 */
const paths = require('../gulp-config/paths');
const del = require('del');

module.exports = (gulp, $) => {

    const rootPath = `${paths.toPath('dist.root')}/**/*.*`;
    const tmpPath = paths.toPath('tmp');

    const rev = () => {
        const manifest = gulp.src(paths.toPath('dist.root/dist.revmap'));
        return gulp.src(rootPath)
            .pipe($.revReplace({ manifest }))
            .pipe(gulp.dest(paths.toPath('dist.root')));
    };

    const delTmp = () => del(tmpPath);

    //rev production files and cleanup temp files
    return gulp.series(rev, delTmp);
};