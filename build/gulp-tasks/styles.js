
var _ = require('lodash'),
    autoprefixer = require('autoprefixer-core'),
    assets  = require('postcss-assets'),
    lazypipe = require('lazypipe'),
    types = require('gulp-sass/node_modules/node-sass').types;


module.exports = function (gulp, $, options) {

    var production = options.production,
        basePath = options.paths.dist.root,
        basePathRegExp = new RegExp('^' + _.escapeRegExp(basePath));


    var assetsConf = {
            loadPaths: [options.assetsPath('dist.fonts'), options.assetsPath('dist.images')].map(function (path) {
                return path.replace(basePathRegExp, '');
            }),

            basePath: basePath,
            cachebuster: (!production)
        };


    var postLegacyPipe = lazypipe()
                    .pipe($.postcss, [
                        autoprefixer({ browsers: ['ie 8'] }),
                        assets(assetsConf),
                        require('postcss-pseudoelements')(),
                        require('postcss-color-rgba-fallback')()
                    ]);

    var postPipe = lazypipe()
                    .pipe($.postcss, [
                        autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'ie 9'] }),
                        assets(assetsConf)
                    ]);

    var productionPipe = lazypipe()
                        .pipe($.header, options.banners.application, {pkg: options.pkg})
                        .pipe($.csso)
                        .pipe($.rename, {suffix: '.min'});


    gulp.task('styles', ['images'], function () {


        // For best performance, don't add Sass partials to `gulp.src`
        return gulp.src([
          options.assetsPath('src.sass', '**/*.{sass,scss}')
        ])
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            precision: 10,
            includePaths: [options.assetsPath('src.vendors')],
            outputStyle: 'expanded',
            functions: {
                'build-env()': function () {
                    return new types.String(production ? 'production' : 'development');
                }
            }
        }).on('error', $.sass.logError))
        .pipe($.if(/\-ie\.css$/, postLegacyPipe(), postPipe()))
        .pipe($.if(production, productionPipe()))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(options.assetsPath('dist.css')))
        .pipe($.size({title: 'styles'}));

    });

};