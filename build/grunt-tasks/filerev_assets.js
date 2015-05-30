/**
 * Revved Asset Map Creation
 * ===============================
 */
/*jshint node:true */
module.exports = {
    assets: {
        options: {
            dest: '<%= paths.dist.revmap %>',
            cwd: '<%= paths.dist.root %>/',
            prefix: ''
        }
    }
};