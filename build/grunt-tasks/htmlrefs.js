/**
 * Replace/remove refs to development resources
 * Overwrites source files
 * ===============================
 */
/*jshint node:true */
module.exports = {
    dist: {
        options: {
            includes: {}
        },
        files: [
            {
                expand: true,
                cwd: '<%= paths.usemin %>/',
                src: ['**/<%= properties.viewmatch %>'],
                dest: '<%= paths.usemin %>'
            }
        ]
    }
};