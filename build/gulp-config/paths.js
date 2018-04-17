//NOTE: folders are relative to project root folder

const path = require('path');
const get = require('lodash/get');
const merge = require('lodash/merge');

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
    styles: 'stylesheets',
    css: 'stylesheets',
    images: 'images',
    media: 'media',
    fonts: 'fonts',
    audio: 'audio',
    video: 'video',
    vendors: 'vendors',

    rsync: distRoot,
    tmp: 'var/tmp',
    backup: 'var/backups'
};

module.exports.merge = (p) => merge(paths, p);

module.exports.get = (frag) => (frag ? paths[frag] : paths);

//excludes glob patterns from match (ie: `*.xxx`)
const translatePath = (pathMatch) => pathMatch.split('/').map((frag) => (frag.indexOf('*') === -1 ? get(paths, frag, frag) : frag));

module.exports.toPath = (pathMatch) => {
    return path.posix.join(...translatePath(pathMatch));
};

module.exports.toAbsPath = (pathMatch) => {
    return path.posix.join(process.cwd(), ...translatePath(pathMatch));
};