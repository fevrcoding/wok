/**
 * Banner on top of files
 * ===============================
 */

/*jshint node:true */
module.exports = {
    application: {
        options: {
            // jscs:disable
            banner: "/* <%= pkg.description %> v<%= pkg.version %> - <%= pkg.author.name %> - Copyright <%= grunt.template.today('yyyy') %> <%= pkg.author.company %> */"
            // jscs:enable
        },
        src: ['<%= paths.dist.assets %>/<%= paths.js %>/**/*.min.js', '<%= paths.dist.assets %>/<%= paths.css %>/*.min.css']
    },
    vendors: {
        options: {
            // jscs:disable
            banner: "/* <%= pkg.description %> v<%= pkg.version %> - <%= pkg.author.name %> - Vendor package */"
            // jscs:enable
        },
        src: ['<%= paths.dist.assets %>/<%= paths.vendors %>/**/*.min.js']
    }
};