/**
 * Watcher Task
 * ===============================
 */
module.exports = (gulp, $, options) => {

    const paths = require('../gulp-config/paths');
    const { styleguideDriven, buildHash, viewmatch } = options;

    const del = require('del');
    const path = require('path');
    const log = require('fancy-log');
    const { cyan } = require('ansi-colors');

    const unlinkFactory = (fileType) => {

        const srcPath = paths.toPath(`src.assets/${fileType}`);
        const destPath = paths.toPath(`dist.assets/${fileType}`);

        return (filepath) => {

            // Simulating the {base: 'src'} used with gulp.src in the scripts task
            const filePathFromSrc = path.relative(srcPath, filepath);

            // Concatenating the 'build' absolute path used by gulp.dest in the scripts task
            const destFilePath = path.resolve(destPath, filePathFromSrc);
            console.log(destFilePath);
            del(destFilePath);
        };
    };

    const normalizePattern = (pattern) => {
        if (Array.isArray(pattern)) {
            return pattern.map(normalizePattern);
        }
        if (pattern.startsWith('!')) {
            return `!${paths.toPath(pattern.substr(1))}`;
        }
        return paths.toPath(pattern);
    };

    const list = [{
        pattern: 'src.assets/styles/**/*.{css,scss,sass}',
        task: styleguideDriven ? gulp.paralled('styles', 'styleguide') : 'styles',
        reload: false,
        unlink: unlinkFactory('styles')
    }, {
        pattern: 'src.assets/images/**/*.{png,jpg,jpeg,gif,svg,webp}',
        task: 'images',
        reload: true,
        unlink: unlinkFactory('images')
    }, {
        pattern: 'src.assets/fonts/**/*.{eot,svg,ttf,woff,woff2}',
        task: 'fonts',
        reload: true,
        unlink: unlinkFactory('fonts')
    }, {
        pattern: [
            'src.assets/media/video/{,*/}*.*',
            'src.assets/media/audio/{,*/}*.*'
        ],
        task: 'media',
        reload: true,
        unlink: unlinkFactory('media')
    }, {
        pattern: [
            'src.assets/js/**/*.js',
            '!src.assets/js/**/*.{spec,conf}.js'
        ],
        task: 'scripts',
        reload: true,
        unlink: unlinkFactory('js')
    }, {
        pattern: [
            `src.views/{,*/}${viewmatch}`,
            'src.documents/*.md',
            'src.fixtures/*.json'
        ],
        task: 'views',
        reload: true
    }];

    return (done) => {

        const BrowserSync = require('browser-sync');

        const bs = BrowserSync.has(buildHash) ? BrowserSync.get(buildHash) : false;

        options.isWatching = true; //eslint-disable-line no-param-reassign

        const livereload = (d) => {
            bs.reload();
            d();
        };

        if (bs === false) {
            log.warn(cyan('BrowserSync instance not found. Assets live-reload will not be available.'));
        }

        list.forEach(({
            pattern, task, reload, unlink
        }) => {
            const tasks = [task];
            if (reload && bs) {
                tasks.push(livereload);
            }
            const watcher = gulp.watch(normalizePattern(pattern), gulp.series(...tasks))
            if (typeof unlink === 'function') {
                watcher.on('unlink', unlink);
            }

        });
        done();
    };

};


//gulp.watch([paths.toPath()], (options. ? ['styles', ] : []));
// gulp.watch([paths.toPath()], ['-watch']).on('change', deleteListener('images'));
// gulp.watch([paths.toPath()], ['-watch']).on('change', deleteListener('fonts'));
// gulp.watch([paths.toPath()], ['-watch']).on('change', deleteListener('video'));
// gulp.watch([paths.toPath()], ['-watch']).on('change', deleteListener('audio'));
// gulp.watch([
//     paths.toPath(),
//     '!' + paths.toPath('')
// ], ['scripts-watch']);
// gulp.watch(, ['-watch']);