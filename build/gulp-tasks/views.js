var path = require('path'),
    _ = require('lodash'),
    glob = require('glob'),
    map = require('vinyl-map'),
    loremIpsum = require('lorem-ipsum'),
    lazypipe = require('lazypipe'),
    marked = require('marked'),
    ejs = require('ejs');


module.exports = function (gulp, $, options) {


    var data = {},
        paths = options.paths,
        viewPath = path.join(process.cwd(), paths.src.views),
        fixturesPath = path.join(process.cwd(), options.paths.src.fixtures),
        helpers,
        render;


    helpers = {
        lorem: function (min, max, config) {
            var count = max ? _.random(min, max) : min,
                defaults = {
                    units: 'words',
                    count: count
                },
                conf = _.defaults(config || {}, defaults);

            return loremIpsum(conf);
        },

        md: function (src) {
            return marked(src);
        }
    };



    var assets = $.useref.assets({searchPath: [paths.dist.root, paths.tmp]});
    var styleFilter = $.filter('**/*.css');

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
        //.pipe(styleFilter.restore)
        //.pipe(function () {
        //    return $.if('*.min.js', $.uglify({preserveComments: 'some'}));
        //})
        //.pipe(function () {
        //    var vendorRegexp = new RegExp(paths.vendors);
        //    var vendorBanner = $.header(options.banners.vendors, {pkg: options.pkg});
        //    var applicationBanner = $.header(options.banners.application, {pkg: options.pkg});
        //    return $.if(vendorRegexp, vendorBanner, applicationBanner);
        //})
        .pipe($.rev)
        .pipe($.revCssUrl)
        .pipe(function () {
            return gulp.dest(options.assetsPath('dist.css'));
        })
        .pipe(assets.restore)
        .pipe($.useref)
        .pipe($.revReplace);



    glob.sync('{,*/}*.json', {
        cwd: fixturesPath
    }).forEach(function (filename) {
        var id = _.camelCase(filename.toLowerCase().replace('.json', ''));
        data[id] = require(path.join(fixturesPath, filename));
    });

    data.helpers = helpers;
    data._ = _;

    render = map(function(code, filename) {
        return ejs.render(code.toString(), _.clone(data), {filename: filename});
    });

    gulp.task('views', function () {
        return gulp.src([viewPath + '/{,*/}' + options.viewmatch, '!' + viewPath + '/{,*/}_*.*'])
            .pipe(render)
            .pipe($.if(options.production, userRefPipe()))
            .pipe(gulp.dest(paths.dist.views))
            .pipe($.if(options.production, $.rev.manifest(paths.dist.revmap, {merge: true})))
            .pipe($.if(options.production, gulp.dest(paths.dist.assets)));
    });
};