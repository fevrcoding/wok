/**
 * Asset Concatenation and Minification
 * ===============================
 */
/*jshint node:true */
module.exports = {
    options: {
        assetsDirs: ['<%= paths.dist.root %>'],
        blockReplacements: {
            concat: function (block) {
                return '<script src="' + block.dest + '"></script>';
            }
        },
        patterns: {
            // FIXME While usemin won't have full support for revved files we have to put all references manually here
            //see https://github.com/yeoman/grunt-usemin/issues/235#issuecomment-54136565
            js: [
                [/(\/.*?\.(?:gif|jpeg|jpg|png|webp|svg|css))/gm, 'Update the JS to reference our revved resouces']
            ]
        }
    },
    html: ['<%= paths.dist.usemin %>/**/<%= properties.viewmatch %>'],
    css: ['<%= paths.dist.assets %>/<%= paths.css %>/{,*/}*.css'],
    js: ['<%= paths.dist.assets %>/<%= paths.js %>/{,*/}*.js']
};
