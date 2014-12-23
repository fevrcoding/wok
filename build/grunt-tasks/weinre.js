/**
 * Weinre Mobile Debug server Tasks
 * ===============================
 */
module.exports = {
    dev: {
        options: {
            boundHost: '-all-',
                httpPort: '<%= hosts.devbox.ports.weinre %>',
                verbose: true
        }
    }
};