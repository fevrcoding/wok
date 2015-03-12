/**
 * Shrink images
 * ===============================
 */
/*jshint node:true, camelcase:false */
module.exports = {
    options: {
        progressive: false
    },
    images: {
        files: [
            {
                expand: true, // Enable dynamic expansion
                cwd: '<%= paths.images %>/', // Src matches are relative to this path
                src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
                dest: '<%= paths.images %>/' // Destination path prefix
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
                cwd: '<%= paths.images %>/',
                src: ['**/*.svg'],
                dest: '<%= paths.images %>/'
            }
        ]
    }
};