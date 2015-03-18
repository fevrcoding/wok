module.exports = {

    options: {
        includePaths: ['<%= paths.vendor %>'],
        indentedSyntax: true,
        outputStyle: 'nested', //there's an external task to minify css
        precision: 10
    },

    dev: {
        options: {
            sourceMap: true
        },
        files: [{
            expand: true,
            cwd: '<%= paths.sass %>/',
            src: ['**/*.{sass,scss}'],
            dest: '<%= paths.css %>'
        }]
    },

    dist: {
        options: {
            sourceMap: false
        },
        files: '<%= sass.dev.files %>'
    }
};
