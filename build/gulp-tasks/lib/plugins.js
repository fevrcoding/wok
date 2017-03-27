/**
 * Gulp Custom Plugins
 */

const through = require('through2');
const gutils = require('gulp-util');

module.exports.map = function map(fn) {

    const mapFn = typeof fn === 'function' ? fn : (val) => val;

    return through.obj(function mapIterator(file, enc, cb) {
        if (file.isNull()) {
            this.push(file);
            cb();
            return;
        }
        if (file.isStream()) {
            this.emit(
                'error',
                new gutils.PluginError('gulp-boilerplate', 'Streaming not supported')
            );
        }

        try {
            file.contents = new Buffer(mapFn(file.contents.toString(), file.path, file)); //eslint-disable-line no-param-reassign
        } catch (err) {
            this.emit('error', new gutils.PluginError('gulp-boilerplate', err.toString()));
        }

        this.push(file);

        cb();
    });
};