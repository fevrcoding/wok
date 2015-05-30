/**
 * Copy Task
 * ===============================
 */
/*jshint node:true */
module.exports = {
    //dev only
    js: {
        expand: true,
        cwd: '<%= paths.src.assets %>/<%= paths.js %>/',
        //exclude specs and config files
        src: ['**/*.js', '!**/*.{spec,conf}.js'],
        dest: '<%= paths.dist.assets %>/<%= paths.js %>/'
    },
    images: {
        expand: true,
        cwd: '<%= paths.src.assets %>/<%= paths.images %>/',
        src: '**/*.{png,jpg,gif,svg,webp}',
        dest: '<%= paths.dist.assets %>/<%= paths.images %>/'
    },
    fonts: {
        expand: true,
        cwd: '<%= paths.src.assets %>/<%= paths.fonts %>/',
        src: '**/*.{eot,svg,ttf,woff,woff2}',
        dest: '<%= paths.dist.assets %>/<%= paths.fonts %>/'
    },
    media: {
        expand: true,
        cwd: '<%= paths.src.assets %>/',
        src: ['<%= paths.video %>/**/*.*', '<%= paths.audio %>/**/*.*'],
        dest: '<%= paths.dist.assets %>/'
    },

    vendors: {
        files: [
            {
                src: ['<%= paths.src.assets %>/<%= paths.vendors %>/modernizr/modernizr.js'],
                dest: '<%= paths.dist.assets %>/<%= paths.vendors %>/modernizr/modernizr.js'
            }
        ]
    }
};