/**
 * Standalone Static Server
 * ===============================
 */
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