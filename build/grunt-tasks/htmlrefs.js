/**
 * Replace/remove refs to development resources
 * Overwrites source files
 * ===============================
 */
module.exports = {
    dist: {
        files: [
            {
                expand: true,
                cwd: '<%= paths.usemin %>/',
                src: ['**/<%= properties.viewmatch %>'],
                dest: '<%= paths.usemin %>'
            }
        ],
            options: {
            includes: {}
        }
    }
};