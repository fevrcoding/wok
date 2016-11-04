/**
 * Views Compilation and use-ref Task
 * ===============================
 */



module.exports = function (gulp, $, options) {

    const path = require('path');
    const fs = require('fs');
    const _ = require('lodash');
    const glob = require('glob');
    const through = require('through2');
    const baseData = {};
    const paths = options.paths;
    const viewPath = path.join(process.cwd(), paths.src.views);
    const fixturesPath = path.join(process.cwd(), options.paths.src.fixtures);


    var userRefPipe; //eslint-disable-line no-var


    baseData.PRODUCTION = options.production;
    baseData.page = {};


    function map(renderFn) {

        return through.obj(function (file, enc, cb) { //eslint-disable-line consistent-return
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
                file.contents = new Buffer(renderFn(file.contents.toString(), file.path, file)); //eslint-disable-line no-param-reassign
            } catch (err) {
                this.emit('error', new $.util.PluginError('view-task', err.toString()));
            }
            this.push(file);
            cb();
        });

    }


    const env = require('./lib/view-helpers').nunjucks([viewPath, paths.src.documents], options);

    env.addGlobal('helpers', require('./lib/view-helpers').helpers(options));
    env.addGlobal('_', _);

    if (options.production) {

        const styleFilter = $.filter('**/*.min.css', { restore: true });
        const jsFilter = $.filter('**/*.min.js', { restore: true });

        userRefPipe = require('lazypipe')()
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
            .pipe(() => styleFilter)
            .pipe($.cleanCss, {
                advanced: false,
                aggressiveMerging: false,
                mediaMerging: false,
                rebase: false
            })
            .pipe($.rev)
            .pipe(() => styleFilter.restore)
            .pipe(() => jsFilter)
            .pipe($.uglify, { preserveComments: 'license' })
            .pipe($.header, options.banners.application, { pkg: options.pkg })
            .pipe($.rev)
            .pipe(() => jsFilter.restore)
            .pipe(() => {
                const vendorRegexp = new RegExp(paths.vendors);
                return $.if(vendorRegexp, $.header(options.banners.vendors, { pkg: options.pkg }));
            });

    } else {
        userRefPipe = $.util.noop;
    }

    gulp.task('views', () => {

        const data = {};

        glob.sync('{,*/}*.json', { cwd: fixturesPath }).forEach((filename) => {
            const id = _.camelCase(filename.toLowerCase().replace('.json', ''));
            data[id] = JSON.parse(fs.readFileSync(path.join(fixturesPath, filename), { encoding: 'utf8' }));
        });

        return gulp.src([viewPath + '/{,*/}' + options.viewmatch, '!' + viewPath + '/{,*/}_*.*'])
            .pipe($.plumber({
                errorHandler: $.notify.onError('Error: <%= error.message %>')
            }))
            .pipe(map((code) => env.renderString(code, Object.assign({}, baseData, data || {}))))
            .pipe(userRefPipe())
            .pipe($.rename((filepath) => {
                filepath.basename = filepath.basename.replace('.nunj', ''); //eslint-disable-line no-param-reassign
            }))
            .pipe(gulp.dest(paths.dist.views))
            .pipe($.if(options.production, $.rev.manifest(path.join(paths.dist.root, paths.dist.revmap), { merge: true })))
            .pipe($.if(options.production, gulp.dest('.')))
            .pipe($.if(options.isWatching, $.notify({ message: 'Views rendered', onLast: true })));
    });
};