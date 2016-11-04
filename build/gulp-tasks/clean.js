/**
 * Clean Task
 * ===============================
 */

module.exports = function (gulp, $, options) {

    const path = require('path');
    const del = require('del');

    const paths = options.paths;
    const assetsPath = options.assetsPath;

    const folders = [
        paths.tmp,
        '.tmp',
        assetsPath('dist.images'),
        assetsPath('dist.audio'),
        assetsPath('dist.video'),
        assetsPath('dist.js'),
        assetsPath('dist.css'),
        assetsPath('dist.fonts'),
        paths.dist.views + '/' + options.viewmatch,
        paths.dist.views + '/{partials,templates,components}',
        assetsPath('dist.vendors'),
        path.join(paths.dist.root, 'styleguide'),
        path.join(paths.dist.root, paths.dist.revmap)
    ];


    gulp.task('clean', (done) => {
        del(folders, { dot: true }).then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });

    gulp.task('clean:tmp', (done) => {
        del([paths.tmp, '.tmp'], { dot: true }).then(() => {
            done();
        }, (err) => {
            done(err);
        });
    });
};