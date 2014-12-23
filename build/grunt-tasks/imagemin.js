/**
 * Shrink images
 * ===============================
 */
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
    }
};