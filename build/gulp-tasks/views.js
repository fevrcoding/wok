/**
 * Views Compilation and use-ref Task
 * ===============================
 */

var path = require('path'),
    _ = require('lodash'),
    glob = require('glob'),
    map = require('vinyl-map'),
    lazypipe = require('lazypipe'),
    ejs = require('ejs');

module.exports = function (gulp, $, options) {

    var data = {},
        paths = options.paths,
        viewPath = path.join(process.cwd(), paths.src.views),
        fixturesPath = path.join(process.cwd(), options.paths.src.fixtures);


    //build view data
    glob.sync('{,*/}*.json', {
        cwd: fixturesPath
    }).forEach(function (filename) {
        var id = _.camelCase(filename.toLowerCase().replace('.json', ''));
        data[id] = require(path.join(fixturesPath, filename));
    });

    data.helpers = require('./lib/view-helpers')(options);
    data._ = _;


    var assets = $.useref.assets({searchPath: [paths.dist.root, paths.tmp]});
    var styleFilter = $.filter('**/*.min.css');
    var jsFilter = $.filter('**/*.min.js');

    var userRefPipe = lazypipe()
        .pipe(function () {
            return assets;
        })
        .pipe(function () {
            return styleFilter;
        })
        .pipe(function () {
            return $.if(/\-ie\.min\.css$/, $.minifyCss({compatibility: 'ie8'}), $.minifyCss());
        })
        .pipe(styleFilter.restore)

        .pipe(function() {
            return jsFilter;
        })
        .pipe($.uglify, {preserveComments: 'some'})
        .pipe($.header, options.banners.application, {pkg: options.pkg})
        .pipe(jsFilter.restore)
        .pipe(function () {
            var vendorRegexp = new RegExp(paths.vendors);
            return $.if(vendorRegexp, $.header(options.banners.vendors, {pkg: options.pkg}));
        })
        .pipe($.rev)
        .pipe(assets.restore)
        .pipe($.useref, {
            //just replace src
            replace: function (blockContent, target, attbs) {
                if(attbs) {
                    return '<script src="' + target + '" ' + attbs + '></script>';
                } else {
                    return '<script src="' + target + '"></script>';
                }
            }
        });


    gulp.task('views', function () {

        return gulp.src([viewPath + '/{,*/}' + options.viewmatch, '!' + viewPath + '/{,*/}_*.*'])
            .pipe(map(function(code, filename) {
                return ejs.render(code.toString(), _.clone(data), {filename: filename});
            }))
            .pipe($.if(options.production, userRefPipe()))
            .pipe(gulp.dest(paths.dist.views))
            .pipe($.if(options.production, $.rev.manifest(path.join(paths.dist.root, paths.dist.revmap), {merge: true})))
            .pipe($.if(options.production, gulp.dest('.')))
            .pipe($.if(options.isWatching, $.notify({ message: 'Views rendered', onLast: true })));
    });
};