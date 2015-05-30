/**
 * Asset Concatenation and Minification
 * ===============================
 */
/*jshint node:true */
module.exports = {
    options: {
        root: '<%= paths.dist.root %>',
        dest: '<%= paths.dist.root %>',
        staging: '<%= paths.tmp %>',
        flow: {
            // i'm using this config for all targets, not only 'html'
            steps: {
                concat: ['concat'],
                    js: ['concat', 'uglifyjs'],
                    css: ['concat', 'cssmin']
            },
            // also you MUST define 'post' field to something not null
            post: {}
        }
    },
    html: ['<%= paths.dist.usemin %>/**/<%= properties.viewmatch %>']
};