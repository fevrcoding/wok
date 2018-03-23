/**
 * Watcher Task
 * ===============================
 */
module.exports = (gulp, $, options) => {

    const paths = require('../gulp-config/paths');
    const { styleguideDriven, buildHash, viewmatch } = options;

    //const del = require('del');
    //const path = require('path');
    // function deleteListener(fileType) {

    //     return (event) => {

    //         if (event.type === 'deleted') {
    //             // Simulating the {base: 'src'} used with gulp.src in the scripts task
    //             const filePathFromSrc = path.relative(paths.toPath(`src.assets/${fileType}`), event.path);

    //             // Concatenating the 'build' absolute path used by gulp.dest in the scripts task
    //             const destFilePath = path.resolve(paths.toPath(`dist.assets/${fileType}`), filePathFromSrc);

    //             del.sync(destFilePath);
    //         }
    //     };
    // }

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
        task: styleguideDriven ? gulp.paralled('styles', 'styleguide') : 'styles'
    }, {
        pattern: 'src.assets/images/**/*.{png,jpg,jpeg,gif,svg,webp}',
        task: 'images'
    }, {
        pattern: 'src.assets/fonts/**/*.{eot,svg,ttf,woff,woff2}',
        task: 'fonts'
    }, {
        pattern: 'src.assets/{video,audio}/{,*/}*.*',
        task: 'media'
    }, {
        pattern: [
            'src.assets/js/**/*.js',
            'src.assets/js/**/*.{spec,conf}.js'
        ],
        task: 'scripts'
    }, {
        pattern: [
            `src.views/{,*/}${viewmatch}`,
            'src.documents/*.md',
            'src.fixtures/*.json'
        ],
        task: 'views'
    }];

    return (done) => {

        const bs = require('browser-sync').get(buildHash);

        options.isWatching = true; //eslint-disable-line no-param-reassign

        const reload = (d) => {
            bs.reload();
            d();
        };

        list.forEach(({ pattern, task }) => {
            gulp.watch(normalizePattern(pattern), gulp.series(task, reload));
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