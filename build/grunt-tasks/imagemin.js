/**
 * Shrink images
 * ===============================
 */
/*jshint node:true */
module.exports = {
    options: {
        progressive: false
    },
    images: {
        files: [
            {
                expand: true, // Enable dynamic expansion
                cwd: '<%= paths.dist.assets %>/<%= paths.images %>/', // Src matches are relative to this path
                src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
                dest: '<%= paths.dist.assets %>/<%= paths.images %>/' // Destination path prefix
            }
        ]
    },
    svg: {
        options: {
            svgoPlugins: [{
                cleanupIDs: false,
                removeViewBox: false
            }]
        },
        files: [
            {
                expand: true,
                cwd: '<%= paths.dist.assets %>/<%= paths.images %>/',
                src: ['**/*.svg'],
                dest: '<%= paths.dist.assets %>/<%= paths.images %>/'
            }
        ]
    }
};