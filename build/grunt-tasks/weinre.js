/**
 * Weinre Mobile Debug Server Tasks
 * ===============================
 */
/*jshint node:true, camelcase:false */
module.exports = {
    dev: {
        options: {
            boundHost: '-all-',
            httpPort: '<%= hosts.devbox.ports.weinre %>',
            verbose: true
        }
    }
};