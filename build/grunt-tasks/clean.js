/**
 * Clean Task
 * ===============================
 */
/*jshint node:true, camelcase:false */
module.exports = {
    options: {
        force: true
    },
    //.tmp ensures usemin defaut staging folder is removed
    //@see https://github.com/rafalgalka/grunt-usemin/commit/c59840e87841dc608340623c939ec74172e34241
    tmp: ['<%= paths.tmp %>', '.tmp'],
    images: ['<%= paths.images %>'],
    js: ['<%= paths.js %>'],
    css: ['<%= paths.css %>'],
    fonts: ['<%= paths.fonts %>'],
    html: ['<%= paths.html %>/<%= properties.viewmatch %>', '<%= paths.html %>/{partials|templates}'], //html in root and whole partials folder
    revmap: ['<%= paths.revmap %>'],
    styleguide: ['<%= paths.www %>/styleguide'],
    vendor: ['<%= paths.vendor %>/vendor.min{,.*}.js',  '<%= paths.vendor %>/dist']
};