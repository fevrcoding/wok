/**
 * Live styleguide generation
 * ===============================
 */
module.exports = {
    options: {
        assets: ['<%= paths.css %>/**/*.css'],
            excludeMissing: true,
            readme: 'README.md',
            baseUrl: '/styleguide/',
            commentStart: /\/\* (?:[=]{4,}\n+[ ]+|(?!\n))/,
            commentEnd: /[ ]+[=]{4,} \*\//
    },
    styleguide: {
        files: [{
            expand: true,
            cwd: '<%= paths.sass %>',
            src: ['**/*.{sass,scss}'],
            dest: '<%= paths.www %>/styleguide/'
        }]
    }
};