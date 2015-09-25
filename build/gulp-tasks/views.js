/**
 * Views Compilation and use-ref Task
 * ===============================
 */



module.exports = function (gulp, $, options) {

    var path = require('path'),
        _ = require('lodash'),
        glob = require('glob'),
        map = require('vinyl-map'),
        through = require('through2'),
        lazypipe = require('lazypipe'),
        ejs = require('ejs'),
        data = {},
        paths = options.paths,
        viewPath = path.join(process.cwd(), paths.src.views),
        fixturesPath = path.join(process.cwd(), options.paths.src.fixtures),
        styleFilter,
        jsFilter,
        userRefPipe,
        assets;


    //build view data
    glob.sync('{,*/}*.json', {
        cwd: fixturesPath
    }).forEach(function (filename) {
        var id = _.camelCase(filename.toLowerCase().replace('.json', ''));
        data[id] = require(path.join(fixturesPath, filename));
    });

    data.helpers = require('./lib/view-helpers')(options);
    data._ = _;
    data.PRODUCTION = options.production;


    assets = $.useref.assets({searchPath: [paths.dist.root, paths.tmp]});
    styleFilter = $.filter('**/*.min.css', {restore: true});
    jsFilter = $.filter('**/*.min.js', {restore: true});

    if (options.production) {

    userRefPipe = lazypipe()
        .pipe(function () {
            return assets;
        })
        .pipe(function () {
            return styleFilter;
        })
        .pipe(function () {
            return $.if(/\-ie\.min\.css$/, $.minifyCss({compatibility: 'ie8'}), $.minifyCss());
        })
        .pipe(function () {
            return styleFilter.restore;
        })

        .pipe(function () {
            return jsFilter;
        })
        .pipe($.uglify, {preserveComments: 'license'})
        .pipe($.header, options.banners.application, {pkg: options.pkg})
        .pipe(function () {
            return jsFilter.restore;
        })
        .pipe(function () {
            var vendorRegexp = new RegExp(paths.vendors);
            return $.if(vendorRegexp, $.header(options.banners.vendors, {pkg: options.pkg}));
        })
        .pipe($.rev)
        .pipe(assets.restore)
        .pipe($.useref, {
            //just replace src
            replace: function (blockContent, target, attbs) {
                if (attbs) {
                    return '<script src="' + target + '" ' + attbs + '></script>';
                }
                return '<script src="' + target + '"></script>';
            }
        });
    } else {
        userRefPipe = function empty() {
            return through.obj(function (file, enc, cb) {
                cb(null, file);
            });
        };
    }


    gulp.task('views', function () {

        return gulp.src([viewPath + '/{,*/}' + options.viewmatch, '!' + viewPath + '/{,*/}_*.*'])
            .pipe(map(function (code, filename) {
                return ejs.render(code.toString(), _.clone(data), {filename: filename});
            }))
            .pipe(userRefPipe())
            .pipe(gulp.dest(paths.dist.views))
            .pipe($.if(options.production, $.rev.manifest(path.join(paths.dist.root, paths.dist.revmap), {merge: true})))
            .pipe($.if(options.production, gulp.dest('.')))
            .pipe($.if(options.isWatching, $.notify({ message: 'Views rendered', onLast: true })));
    });
};