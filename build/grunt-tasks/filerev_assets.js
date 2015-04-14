/**
 * Revved Asset Map Creation
 * ===============================
 */
/*jshint node:true */
module.exports = {
    assets: {
        options: {
            dest: '<%= paths.revmap %>',
            cwd: '<%= paths.www %>/',
            prefix: ''
        }
    }
};