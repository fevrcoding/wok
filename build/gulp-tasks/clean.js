/**
 * Clean Task
 * ===============================
 */

var del = require('del'),
    _ = require('lodash');

module.exports = function (gulp, $, options) {

    var paths = options.paths,
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
        paths.dist.views + '/{partials|templates|components}',
        assetsPath('dist.vendors'),
        paths.dist.root + '/styleguide',
        paths.dist.revmap

    ];


    gulp.task('clean', function (done) {
        del(folders, {dot: true}, done);
    });

};