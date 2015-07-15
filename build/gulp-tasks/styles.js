/**
 * Sass and Stylesheets Related Task
 * ===============================
 */

var path = require('path'),
    autoprefixer = require('autoprefixer-core'),
    browserSync = require('browser-sync'),
    lazypipe = require('lazypipe');


module.exports = function (gulp, $, options) {

    var production = options.production,
        paths = options.paths,
        sassFunctions = require('./lib/sass-functions')(options);


    var destPath = options.assetsPath('dist.css');

    if (production) {
        destPath = path.normalize(destPath.replace(paths.dist.root, paths.tmp));
    }

    var postLegacyPipe = lazypipe()
        .pipe($.postcss, [
            autoprefixer({ browsers: ['ie 8'] }),
            require('postcss-pseudoelements')(),
            require('postcss-color-rgba-fallback')()
        ]);

    var postPipe = lazypipe()
        .pipe($.postcss, [
            autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'ie 9'] })
        ]);

    var productionPipe = lazypipe()
        .pipe($.header, options.banners.application, {pkg: options.pkg})
        .pipe(function () {
            return gulp.dest(destPath);
        })
        .pipe(function () {
            return $.if(/\-ie\.css$/, $.minifyCss({compatibility: 'ie8'}), $.minifyCss());
        })
        .pipe($.rename, {suffix: '.min'});



    gulp.task('styles', function () {


        // For best performance, don't add Sass partials to `gulp.src`
        return gulp.src([
              options.assetsPath('src.sass', '**/*.{sass,scss}'),
              '!' + options.assetsPath('src.sass', '**/*scsslint_tmp*.{sass,scss}') //exclude scss lint files
            ])
            .pipe($.plumber({
                errorHandler: $.notify.onError('Error: <%= error.message %>')
            }))
            .pipe($.sourcemaps.init())
            .pipe($.sass({
                precision: 10,
                includePaths: [options.assetsPath('src.vendors')],
                outputStyle: 'expanded',
                functions: sassFunctions
            }).on('error', $.sass.logError))
            .pipe($.if(/\-ie\.css$/, postLegacyPipe(), postPipe()))
            .pipe($.if(production, productionPipe()))
            .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest(options.assetsPath('dist.css')))
            .pipe($.if(options.isWatching && options.livereload, browserSync.stream({match: '**/*.css'})))
            .pipe($.if(options.isWatching, $.notify({ message: 'SASS Compiled', onLast: true })))
            .pipe($.size({title: 'styles'}));
    });

};