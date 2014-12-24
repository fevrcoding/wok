/**
 * Rsync Deploy
 * ===============================
 */
/*jshint node:true, camelcase:false */
module.exports = {
    options: {
        src: '<%= paths.rsync %>',
            recursive: true,
            compareMode: 'checksum',
            syncDestIgnoreExcl: true,
            args: ['--verbose', '--progress', '--cvs-exclude'],
            exclude: [
            '.svn*',
            '.tmp*',
            '.sass-cache*',
            '*.sublime-*'
        ]
    },

    staging: {
        options: {
            dest: '<%= hosts.staging.path %>',
                host: '<%= hosts.staging.username %>@<%= hosts.staging.host %>'
        }
    },

    production: {
        options: {
            dest: '<%= hosts.production.path %>',
                host: '<%= hosts.production.username %>@<%= hosts.production.host %>'
        }
    }
};