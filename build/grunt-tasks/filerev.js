/**
 * Asset Revving
 * ===============================
 */
/*jshint node:true */
module.exports = {
    images: {
        src: ['<%= paths.dist.assets %>/<%= paths.images %>/**/*.{png,jpg,gif,svg,webp}']
    },
    js: {
        //application files and concatenated vendors
        src: ['<%= paths.dist.assets %>/<%= paths.js %>/**/*.min.js', '<%= paths.dist.assets %>/<%= paths.vendors %>/**/*.min.js']
    },
    css: {
        src: ['<%= paths.dist.assets %>/<%= paths.css %>/**/*.css']
    }
};