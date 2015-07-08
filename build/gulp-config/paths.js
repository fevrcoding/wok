//NOTE: folders are relative to project root folder

var srcRoot = 'application';
var distRoot = 'public';

var paths = {

    src: {
        root: srcRoot,
        assets: srcRoot + '/assets',
        fixtures: srcRoot + '/fixtures',
        documents: srcRoot + '/documents',
        views: srcRoot + '/views',
        partials: srcRoot + '/views/partials'
    },

    dist: {
        root: distRoot, //where static files are to be saved
        assets: distRoot + '/assets',
        views: distRoot, //when working on with CMS, views may be stored in a diffrent folder
        revmap: 'assets/assets-map.json', //map of revved files
        usemin: distRoot  //path to views to be processed by usemin/htmlrefs
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