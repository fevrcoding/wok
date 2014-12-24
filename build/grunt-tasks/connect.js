/**
 * Standalone Static Server
 * ===============================
 */
/*jshint node:true, camelcase:false */
module.exports = {
    options: {
        hostname: '*',
            port: '<%= hosts.devbox.ports.connect %>',
            useAvailablePort: true,
            base: ['<%= paths.www %>', '<%= paths.html %>']
    },
    server: {
        options: {
            keepalive: true
        }
    },
    dev: {
        options: {}
    }
};