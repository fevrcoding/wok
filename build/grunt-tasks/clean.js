/**
 * Clean Task
 * ===============================
 */
/*jshint node:true */
module.exports = {
    options: {
        force: true
    },
    //.tmp ensures usemin default staging folder is removed
    //@see https://github.com/rafalgalka/grunt-usemin/commit/c59840e87841dc608340623c939ec74172e34241
    tmp: ['<%= paths.tmp %>', '.tmp'],
    images: ['<%= paths.dist.assets %>/<%= paths.images %>'],
    media: ['<%= paths.dist.assets %>/<%= paths.audio %>', '<%= paths.dist.assets %>/<%= paths.video %>'],
    js: ['<%= paths.dist.assets %>/<%= paths.js %>'],
    css: ['<%= paths.dist.assets %>/<%= paths.css %>'],
    fonts: ['<%= paths.dist.assets %>/<%= paths.fonts %>'],
    views: ['<%= paths.dist.views %>/<%= properties.viewmatch %>', '<%= paths.dist.views %>/{partials|templates|components}'], //html in root and whole partials folder
    vendors: ['<%= paths.dist.assets %>/<%= paths.vendors %>'],
    styleguide: ['<%= paths.dist.root %>/styleguide'],
    revmap: ['<%= paths.dist.revmap %>'],
};