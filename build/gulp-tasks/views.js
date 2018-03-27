/**
 * Views Compilation and use-ref Task
 * ===============================
 */



module.exports = (gulp, $, options) => {

    const path = require('path');
    const fs = require('fs');
    const _ = require('lodash');
    const glob = require('globby');
    const through = require('through2');
    const { map } = require('./lib/plugins');
    const { createRenderer } = require('./lib/view-helpers');

    const baseData = {};
    const paths = require('../gulp-config/paths');
    const viewPath = paths.toAbsPath('src.views');
    const fixturesPath = paths.toAbsPath('src.fixtures');
    const { production, viewmatch, banners } = options;

    let useRef = () => through.obj();


    baseData.PRODUCTION = production;
    baseData.page = {};

    const helpers = () => ({});

    const renderer = createRenderer([viewPath, paths.toPath('src.documents')], options, helpers);

    if (production) {

        const styleFilter = $.filter('**/*.min.css', { restore: true });
        const jsFilter = $.filter('**/*.min.js', { restore: true });
        const assetsFilter = $.filter(['**/*.*', `!**/${viewmatch}`], { restore: true });

        useRef = require('lazypipe')()
            .pipe($.useref, {
                types: ['css', 'js', 'replace', 'remove'],
                searchPath: [paths.toPath('dist.root'), paths.get('tmp')],
                //just replace src
                replace: (blockContent, target, attrs) => (
                    `<script src="${target}"${attrs ? ` ${attrs}` : ''}></script>`
                )
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
            .pipe($.header, banners.application, {})
            .pipe($.rev)
            .pipe(() => jsFilter.restore)
            .pipe(() => {
                const vendorRegexp = new RegExp(paths.get('vendors'));
                return $.if(vendorRegexp, $.header(banners.vendors, {}));
            })
            .pipe(() => assetsFilter)
            .pipe(gulp.dest, paths.toPath('dist.root'))
            .pipe(() => assetsFilter.restore);
    }

    return () => {

        const htmlFilter = $.filter(`**/${viewmatch}`, { restore: true });

        const data = glob.sync('{,*/}*.json', { cwd: fixturesPath }).reduce((obj, filename) => {
            const id = _.camelCase(filename.toLowerCase().replace('.json', ''));
            obj[id] = JSON.parse(fs.readFileSync(path.join(fixturesPath, filename), { encoding: 'utf8' })); //eslint-disable-line no-param-reassign
            return obj;
        }, {});

        return gulp.src([`${viewPath}/{,*/}${viewmatch}`, `!${viewPath}/{,*/}_*.*`])
            .pipe($.plumber({
                errorHandler: $.notify.onError('Error: <%= error.message %>')
            }))
            .pipe(map((code) => renderer.render(code, Object.assign({}, baseData, data || {}))))
            .pipe(useRef())
            .pipe($.rename((filepath) => {
                filepath.basename = filepath.basename.replace('.nunj', ''); //eslint-disable-line no-param-reassign
                filepath.extname = '.html'; //eslint-disable-line no-param-reassign
            }))
            .pipe(htmlFilter)
            .pipe(gulp.dest(paths.toPath('dist.views')))
            .pipe(htmlFilter.restore)
            .pipe($.if(production, $.rev.manifest(paths.toPath('dist.root/dist.revmap'), { merge: true })))
            .pipe($.if(production, gulp.dest('.')))
            .pipe($.if(options.isWatching, $.notify({ message: 'Views rendered', onLast: true })));
    };
};