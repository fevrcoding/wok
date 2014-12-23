module.exports = {
    options: {
        root: '<%= paths.www %>',
            dest: '<%= paths.www %>',
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
    html: ['<%= paths.usemin %>/**/<%= properties.viewmatch %>']
};