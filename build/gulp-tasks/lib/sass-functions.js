/**
 * Node Sass Functions
 */

'use strict';

var path = require('path'),
    fs = require('fs'),
    _ = require('lodash'),
    sizeOf = require('image-size'),
    datauri = require('datauri'),
    types = require('gulp-sass/node_modules/node-sass').types;

module.exports = function (options) {


    var rootPath = path.join(process.cwd(), options.paths.src.root),
        baseRegExp = new RegExp('^' + _.escapeRegExp(rootPath + path.sep));

    var baseUrl = '/' + path.join(process.cwd(), options.assetsPath('src.images')).replace(baseRegExp, '').replace(path.sep, '/').trim('/') + '/';

    return {

        'build-env()': function () {
            return new types.String(options.production ? 'production' : 'development');
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
            if (!options.production) {
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
            return new types.String('url(\'' + datauri(imagePath) + '\')');

        }
    };
};

