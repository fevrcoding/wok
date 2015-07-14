/**
 * A raw adapter to use grunt-modernizr in gulp...
 */

var fs = require('fs'),
    path = require('path'),
    glob = require('glob'),
    through = require('through2'),
    mkdirp = require('mkdirp'),
    Gruntifier = require('grunt-modernizr/lib/gruntifier'),
    _ = require('lodash');

var noop = function () {};
var log = function () {
    console.log.apply(console, arguments);
};

var processPatterns = function(patterns, fn) {
    // Filepaths to return.
    var result = [];
    // Iterate over flattened patterns array.
    _.flatten(patterns).forEach(function(pattern) {
        // If the first character is ! it should be omitted
        var exclusion = pattern.indexOf('!') === 0;
        // If the pattern is an exclusion, remove the !
        if (exclusion) { pattern = pattern.slice(1); }
        // Find all matching files for this pattern.
        var matches = fn(pattern);
        if (exclusion) {
            // If an exclusion, remove matching files.
            result = _.difference(result, matches);
        } else {
            // Otherwise add matching files.
            result = _.union(result, matches);
        }
    });
    return result;
};


module.exports = function modernizr(config) {

    //shimming grunt
    var grunt = {
        config: function () {
            //task config
            return {
                dist: _.extend({
                    files: {
                        src: []
                    }
                }, config)
            };
        },
        option: function (option) {
            switch (option) {
                case 'quiet':
                    return true;
            }
        },
        log: {
            subhead: noop,
            ok: log,
            error: log,
            writeln: log
        },
        fail: {
            warn: function (msg) {
                console.warn(msg);
                return false;
            },
            fatal: function (msg) {
                console.error(msg);
                return false;
            }
        },

        template: {
            process: function (str) {
                return str;
            }
        },

        file: {
            read: function (filename) {
                return fs.readFileSync(filename, {encoding: 'utf8'});
            },

            write: function (filename, data) {
                mkdirp.sync(path.dirname(filename));
                return fs.writeFileSync(filename, data);
            },

            // Return an array of all file paths that match the given wildcard patterns.
            expand: function() {
                var args = Array.prototype.slice.call(arguments);
                // If the first argument is an options object, save those options to pass
                // into the file.glob.sync method.
                var options = _.isPlainObject(args[0]) ? args.shift() : {};
                // Use the first argument if it's an Array, otherwise convert the arguments
                // object to an array and use that.
                var patterns = Array.isArray(args[0]) ? args[0] : args;
                // Return empty set if there are no patterns or filepaths.
                if (patterns.length === 0) { return []; }
                // Return all matching filepaths.
                var matches = processPatterns(patterns, function(pattern) {
                    // Find all matching files for this pattern.
                    return glob.sync(pattern, options);
                });
                // Filter result set?
                if (options.filter) {
                    matches = matches.filter(function(filepath) {
                        filepath = path.join(options.cwd || '', filepath);
                        try {
                            if (typeof options.filter === 'function') {
                                return options.filter(filepath);
                            } else {
                                // If the file is of the right type and exists, this should work.
                                return fs.statSync(filepath)[options.filter]();
                            }
                        } catch(e) {
                            // Otherwise, it's probably not the right type.
                            return false;
                        }
                    });
                }
                return matches;
            }
        }
    };


    return through.obj(function (file, enc, cb) {

        new Gruntifier(grunt, 'dist', function () {
            file.contents = new Buffer(fs.readFileSync(config.outputFile, {encoding: 'utf8'}));
            this.push(file);
            cb();
        }.bind(this), false);
    });
};