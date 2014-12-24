/**
 * Replace/remove refs to development resources
 * Overwrites source files
 * ===============================
 */
/*jshint node:true, camelcase:false */
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