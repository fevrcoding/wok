/**
 * Revved Asset Map Creation
 * ===============================
 */
/*jshint node:true, camelcase:false */
module.exports = {
    assets: {
        options: {
            dest: '<%= paths.revmap %>',
            cwd: '<%= paths.www %>/',
            prefix: ''
        }
    }
};