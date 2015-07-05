var path = require('path'),
    _ = require('lodash'),
    glob = require('glob'),
    map = require('vinyl-map'),
    loremIpsum = require('lorem-ipsum'),
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

    gulp.task('views', function (done) {
        return gulp.src([viewPath + '/{,*/}' + options.viewmatch, '!' + viewPath + '/{,*/}_*.*'])
            .pipe(render)
            .pipe(gulp.dest(paths.dist.views));
    });
};