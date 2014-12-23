module.exports = {
    /**
     * Shrink SVGs
     * ===============================
     */
    options: {
        plugins: [{
            removeViewBox: false
        }]
    },
    dist: {
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