/**
 * Views Compilation and use-ref Task
 * ===============================
 */



module.exports = function (gulp, $, options) {

    var path = require('path'),
        _ = require('lodash'),
        glob = require('glob'),
        through = require('through2'),
        lazypipe = require('lazypipe'),
        data = {},
        paths = options.paths,
        viewPath = path.join(process.cwd(), paths.src.views),
        fixturesPath = path.join(process.cwd(), options.paths.src.fixtures),
        styleFilter,
        jsFilter,
        userRefPipe,
        env,
        assets;


    function map(renderFn) {

        return through.obj(function (file, enc, cb) {
            if (file.isNull()) {
                this.push(file);
                return cb();
            }
            if (file.isStream()) {
                this.emit(
                    'error',
                    new $.util.PluginError('view-task', 'Streaming not supported')
                );
            }
            try {
                file.contents = new Buffer(renderFn(file.contents.toString(), file.path));
            } catch (err) {
                this.emit('error', new $.util.PluginError('view-task', err.toString()));
            }
            this.push(file);
            cb();
        });

    }


    //build view data
    glob.sync('{,*/}*.json', {
        cwd: fixturesPath
    }).forEach(function (filename) {
        var id = _.camelCase(filename.toLowerCase().replace('.json', ''));
        data[id] = require(path.join(fixturesPath, filename));
    });

    data.helpers = require('./lib/view-helpers').helpers(options);
    data._ = _;
    data.PRODUCTION = options.production;
    data.page = {};

    env = require('./lib/view-helpers').nunjucks([viewPath, paths.src.documents], options);


    //assets = $.useref.assets({types: ['css', 'js', 'replace'], searchPath: [paths.dist.root, paths.tmp]});
    styleFilter = $.filter('**/*.min.css', {restore: true});
    jsFilter = $.filter('**/*.min.js', {restore: true});

    if (options.production) {


        userRefPipe = lazypipe()
            .pipe($.useref, {
                types: ['css', 'js', 'replace', 'remove'],
                searchPath: [paths.dist.root, paths.tmp],
                //just replace src
                replace: function (blockContent, target, attbs) {
                    if (attbs) {
                        return '<script src="' + target + '" ' + attbs + '></script>';
                    }
                    return '<script src="' + target + '"></script>';
                }
            })
            .pipe(function () {
                return styleFilter;
            })
            .pipe(function () {
                return $.if(/\-ie\.min\.css$/, $.minifyCss({compatibility: 'ie8'}), $.minifyCss());
            })
            .pipe($.rev)
            .pipe(function () {
                return styleFilter.restore;
            })

            .pipe(function () {
                return jsFilter;
            })
            .pipe($.uglify, {preserveComments: 'license'})
            .pipe($.header, options.banners.application, {pkg: options.pkg})
            .pipe($.rev)
            .pipe(function () {
                return jsFilter.restore;
            })
            .pipe(function () {
                var vendorRegexp = new RegExp(paths.vendors);
                return $.if(vendorRegexp, $.header(options.banners.vendors, {pkg: options.pkg}));
            });

        //userRefPipe = lazypipe()
        //    .pipe(function () {
        //        return assets;
        //    })
        //    .pipe(function () {
        //        return styleFilter;
        //    })
        //    .pipe(function () {
        //        return $.if(/\-ie\.min\.css$/, $.minifyCss({compatibility: 'ie8'}), $.minifyCss());
        //    })
        //    .pipe(function () {
        //        return styleFilter.restore;
        //    })
        //
        //    .pipe(function () {
        //        return jsFilter;
        //    })
        //    .pipe($.uglify, {preserveComments: 'license'})
        //    .pipe($.header, options.banners.application, {pkg: options.pkg})
        //    .pipe(function () {
        //        return jsFilter.restore;
        //    })
        //    .pipe(function () {
        //        var vendorRegexp = new RegExp(paths.vendors);
        //        return $.if(vendorRegexp, $.header(options.banners.vendors, {pkg: options.pkg}));
        //    })
        //    .pipe($.rev)
        //    .pipe(assets.restore)
        //    .pipe($.useref,
        //    });
    } else {
        userRefPipe = $.util.noop;
    }

    gulp.task('views', function () {

        return gulp.src([viewPath + '/{,*/}' + options.viewmatch, '!' + viewPath + '/{,*/}_*.*'])
            .pipe($.plumber({
                errorHandler: $.notify.onError('Error: <%= error.message %>')
            }))
            .pipe(map(function (code/*, filename*/) {
                return env.renderString(code, _.clone(data));
            }))
            .pipe(userRefPipe())
            .pipe($.rename(function (filepath) {
                filepath.basename = filepath.basename.replace('.nunj', '');
            }))
            .pipe(gulp.dest(paths.dist.views))
            .pipe($.if(options.production, $.rev.manifest(path.join(paths.dist.root, paths.dist.revmap), {merge: true})))
            .pipe($.if(options.production, gulp.dest('.')))
            .pipe($.if(options.isWatching, $.notify({ message: 'Views rendered', onLast: true })));
    });
};