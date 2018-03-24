/**
 * Clean Task
 * ===============================
 */

module.exports = (gulp, $, options) => {
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
        'dist.views/*',
        'dist.assets/vendors',
        'dist.root/styleguide',
        'dist.root/dist.revmap'
    ].map(paths.toPath);

    return () => {
        const del = require('del');

        return del(folders, { dot: true, allowEmpty: true });
    };
};