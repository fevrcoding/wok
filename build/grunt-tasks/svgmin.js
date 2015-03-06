/**
 * Shrink SVGs
 * ===============================
 */
/*jshint node:true, camelcase:false */
module.exports = {
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