
var path = require('path'),
    fs = require('fs'),
    _ = require('lodash'),
    autoprefixer = require('autoprefixer-core'),
    assets  = require('postcss-assets'),
    lazypipe = require('lazypipe'),
    sizeOf = require('image-size'),
    datauri = require('datauri'),
    types = require('gulp-sass/node_modules/node-sass').types;


module.exports = function (gulp, $, options) {

    var production = options.production,
        paths = options.paths,
        rootPath = path.join(process.cwd(), paths.src.root),
        baseRegExp = new RegExp('^' + _.escapeRegExp(rootPath + path.sep));


    var destPath = options.assetsPath('dist.css');

    if (production) {
        destPath = path.normalize(destPath.replace(paths.dist.root, paths.tmp));
    }

    var baseUrl = '/' + path.join(process.cwd(), options.assetsPath('src.images')).replace(baseRegExp, '').replace(path.sep, '/').trim('/') + '/';

    var sassFunctions = {
        'build-env()': function () {
            return new types.String('development');
        },
        'map-to-JSON($map)': function (map) {
            var obj = {};
            _.times(map.getLength(), function (i) {
                var key = map.getKey(i).getValue().toString();
                obj[key] = map.getValue(i).getValue();
            });
            return new types.String(JSON.stringify(obj));
        },
        'image-url($path)': function (filepath) {
            var imagePath = path.join(process.cwd(), options.assetsPath('src.images'), filepath.getValue());
            var imageUrl = (baseUrl + filepath.getValue());
            if (!fs.existsSync(imagePath)) {
                console.warn('File %s not found', imagePath);
                return false;
            }
            if (!production) {
                imageUrl += '?' + Date.now();
            }
            return new types.String('url(\'' + imageUrl + '\')');
        },
        'image-width($path)': function (filepath) {
            var imagePath = path.join(process.cwd(), options.assetsPath('src.images'), filepath.getValue());
            if (!fs.existsSync(imagePath)) {
                console.warn('File %s not found', imagePath);
                return false;
            }
            return new types.Number(sizeOf(imagePath).width, 'px');
        },
        'image-height($path)': function (filepath) {
            var imagePath = path.join(process.cwd(), options.assetsPath('src.images'), filepath.getValue());
            if (!fs.existsSync(imagePath)) {
                console.warn('File %s not found', imagePath);
                return false;
            }
            return new types.Number(sizeOf(imagePath).height, 'px');
        },
        'inline-image($path)': function (filepath) {
            var imagePath = path.join(process.cwd(), options.assetsPath('src.images'), filepath.getValue());
            if (!fs.existsSync(imagePath)) {
                console.warn('File %s not found', imagePath);
                return false;
            }
            return new types.String('url(\''+ datauri(imagePath) + '\')');

        }
    };

    var postLegacyPipe = lazypipe()
                    .pipe($.postcss, [
                        autoprefixer({ browsers: ['ie 8'] }),
                        require('postcss-pseudoelements')(),
                        require('postcss-color-rgba-fallback')()
                    ]);

    var postPipe = lazypipe()
                    .pipe($.postcss, [
                        autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'ie 9'] }),
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
                functions: sassFunctions
            }).on('error', $.sass.logError))
            .pipe($.if(/\-ie\.css$/, postLegacyPipe(), postPipe()))
            .pipe($.if(options.production, productionPipe()))
            .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest(options.assetsPath('dist.css')))
            .pipe($.size({title: 'styles'}));
    });

};