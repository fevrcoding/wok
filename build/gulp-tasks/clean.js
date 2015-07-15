/**
 * Clean Task
 * ===============================
 */

module.exports = function (gulp, $, options) {

    var path = require('path'),
        del = require('del'),
        paths = options.paths,
        assetsPath = options.assetsPath,
        folders;

    folders = [
        paths.tmp,
        '.tmp',
        assetsPath('dist.images'),
        assetsPath('dist.audio'),
        assetsPath('dist.video'),
        assetsPath('dist.js'),
        assetsPath('dist.css'),
        assetsPath('dist.fonts'),
        paths.dist.views + '/' +  options.viewmatch,
        paths.dist.views + '/{partials,templates,components}',
        assetsPath('dist.vendors'),
        path.join(paths.dist.root, 'styleguide'),
        path.join(paths.dist.root, paths.dist.revmap)
    ];


    gulp.task('clean', function (done) {
        del(folders, {dot: true}, done);
    });
};