/**
 * Views Compilation and use-ref Task
 * ===============================
 */



module.exports = (gulp, $, options) => {

    const path = require('path');
    const fs = require('fs');
    const _ = require('lodash');
    const glob = require('glob');
    const map = require('./lib/plugins').map;

    const baseData = {};
    const paths = require('../gulp-config/paths');
    const viewPath = paths.toAbsPath('src.views');
    const fixturesPath = paths.toAbsPath('src.fixtures');


    let useRef; //eslint-disable-line no-var


    baseData.PRODUCTION = options.production;
    baseData.page = {};

    const env = require('./lib/view-helpers').nunjucks([viewPath, paths.toPath('src.documents')], options);

    env.addGlobal('helpers', require('./lib/view-helpers').helpers(options));
    env.addGlobal('_', _);

    if (options.production) {

        const styleFilter = $.filter('**/*.min.css', { restore: true });
        const jsFilter = $.filter('**/*.min.js', { restore: true });
        const assetsFilter = $.filter(['**/*.*', '!**/' + options.viewmatch], { restore: true });

        useRef = require('lazypipe')()
            .pipe($.useref, {
                types: ['css', 'js', 'replace', 'remove'],
                searchPath: [paths.toPath('dist.root'), paths.get('tmp')],
                //just replace src
                replace(blockContent, target, attrs) {
                    if (attrs) {
                        return `<script src="${target}" ${attrs}></script>`;
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
            .pipe($.uglify, { output: { comments: 'some' } })
            .pipe($.header, options.banners.application, { pkg: options.pkg })
            .pipe($.rev)
            .pipe(() => jsFilter.restore)
            .pipe(() => {
                const vendorRegexp = new RegExp(paths.get('vendors'));
                return $.if(vendorRegexp, $.header(options.banners.vendors, { pkg: options.pkg }));
            })
            .pipe(() => assetsFilter)
            .pipe(gulp.dest, paths.toPath('dist.root'))
            .pipe(() => assetsFilter.restore);

    } else {
        useRef = $.util.noop;
    }

    gulp.task('views', () => {

        const data = {};
        const htmlFilter = $.filter('**/' + options.viewmatch, { restore: true });


        glob.sync('{,*/}*.json', { cwd: fixturesPath }).forEach((filename) => {
            const id = _.camelCase(filename.toLowerCase().replace('.json', ''));
            data[id] = JSON.parse(fs.readFileSync(path.join(fixturesPath, filename), { encoding: 'utf8' }));
        });

        return gulp.src([viewPath + '/{,*/}' + options.viewmatch, '!' + viewPath + '/{,*/}_*.*'])
            .pipe($.plumber({
                errorHandler: $.notify.onError('Error: <%= error.message %>')
            }))
            .pipe(map((code) => env.renderString(code, Object.assign({}, baseData, data || {}))))
            .pipe(useRef())
            .pipe($.rename((filepath) => {
                filepath.basename = filepath.basename.replace('.nunj', ''); //eslint-disable-line no-param-reassign
            }))
            .pipe(htmlFilter)
            .pipe(gulp.dest(paths.toPath('dist.views')))
            .pipe(htmlFilter.restore)
            .pipe($.if(options.production, $.rev.manifest(paths.toPath('dist.root/dist.revmap'), { merge: true })))
            .pipe($.if(options.production, gulp.dest('.')))
            .pipe($.if(options.isWatching, $.notify({ message: 'Views rendered', onLast: true })));
    });
};