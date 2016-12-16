//NOTE: folders are relative to project root folder

const srcRoot = 'application';
const distRoot = 'public';
const assetsPath = 'assets';

const paths = {

    src: {
        root: srcRoot,
        assets: srcRoot + '/' + assetsPath,
        fixtures: srcRoot + '/fixtures',
        documents: srcRoot + '/documents',
        views: srcRoot + '/views'
    },

    dist: {
        root: distRoot, //where static files are to be saved
        assets: distRoot + '/' + assetsPath,
        views: distRoot, //when working on with CMS, views may be stored in a different folder
        revmap: assetsPath + '/assets-map.json' //map of revved files
    },

    js: 'javascripts',
    sass: 'stylesheets',
    css: 'stylesheets',
    images: 'images',
    fonts: 'fonts',
    audio: 'audio',
    video: 'video',
    vendors: 'vendors',

    rsync: distRoot,
    tmp: 'var/tmp',
    backup: 'var/backups'
};


module.exports = paths;