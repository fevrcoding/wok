/**
 * Clean Task
 * ===============================
 */

module.exports = (gulp, $, options) => {

    const del = require('del');

    const paths = require('../gulp-config/paths');

    const folders = [
        'tmp',
        'dist.assets/images',
        'dist.assets/audio',
        'dist.assets/video',
        'dist.assets/js',
        'dist.assets/css',
        'dist.assets/fonts',
        `dist.views/${options.viewmatch}`,
        'dist.views/{partials,templates,components}',
        'dist.assets/vendors',
        'dist.root/styleguide',
        'dist.root/dist.revmap'
    ].map(paths.toPath);


    gulp.task('clean', (done) => {
        del(folders, { dot: true }).then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    gulp.task('clean:tmp', (done) => {
        del([paths.toPath('tmp')], { dot: true }).then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });
};