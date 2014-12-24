/**
 * Asset Revving
 * ===============================
 */
/*jshint node:true, camelcase:false */
module.exports = {
    images: {
        src: ['<%= paths.images %>/**/*.{png,jpg,gif,svg,webp}']
    },
    js: {
        //application files and concatenated vendors
        src: ['<%= paths.js %>/**/*.min.js', '<%= paths.vendor %>/dist/*.min.js', '<%= paths.vendor %>/vendor.min.js']
    },
    css: {
        src: ['<%= paths.css %>/**/*.css']
    }
};