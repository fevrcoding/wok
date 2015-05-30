/**
 * Live Styleguide Generation
 * ===============================
 */
/*jshint node:true */
module.exports = {
    options: {
        assets: ['<%= paths.dist.assets %>/<%= paths.css %>/**/*.css'],
        excludeMissing: true,
        readme: 'README.md',
        baseUrl: '/styleguide/',
        commentStart: /\/\* (?:[=]{4,}\n+[ ]+|(?!\n))/,
        commentEnd: /[ ]+[=]{4,} \*\//
    },
    styleguide: {
        files: [{
            expand: true,
            cwd: '<%= paths.src.assets %>/<%= paths.sass %>',
            src: ['**/*.{sass,scss}'],
            dest: '<%= paths.dist.root %>/styleguide/'
        }]
    }
};