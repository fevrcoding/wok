/**
 * Gulp Custom Plugins
 */

const through = require('through2');
const PluginError = require('plugin-error');
const notify = require('gulp-notify');

const map = function map(fn) {

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
                new PluginError('wok-map', 'Streaming not supported')
            );
        }

        try {
            file.contents = Buffer.from(mapFn(file.contents.toString(), file.path, file)); //eslint-disable-line no-param-reassign
        } catch (err) {
            this.emit('error', new PluginError('wok-map', err.toString()));
        }

        this.push(file);

        cb();
    });
};

const noop = () => through.obj();

let reloadStream;
const getReloadStream = ({ isWatching, livereload, buildHash }) => {
    if (isWatching && livereload) {
        return reloadStream || (reloadStream = require('browser-sync').get(buildHash).stream); //eslint-disable-line no-return-assign
    }
    return noop;
};

const getNotifier = ({ isWatching, enableNotify }) => {
    if (isWatching && enableNotify) {
        return {
            notify,
            errorHandler: notify.onError('Error: <%= error.message %>')
        };
    }
    return {
        notify: noop,
        errorHandler: true
    };
};

module.exports = {
    map,
    noop,
    getReloadStream,
    getNotifier
};