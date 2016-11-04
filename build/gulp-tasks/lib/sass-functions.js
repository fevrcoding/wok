/**
 * Node Sass Functions
 */

const path = require('path');
const fs = require('fs');
const times = require('lodash/times');
const escapeRegExp = require('lodash/escapeRegExp');
const sizeOf = require('image-size');
const datauri = require('datauri').sync;

var types; //eslint-disable-line no-var

try {
    types = require('node-sass').types;
} catch (e) {
    types = require('gulp-sass/node_modules/node-sass').types; //eslint-disable-line import/no-unresolved
}

module.exports = function (options) {


    const rootPath = path.join(process.cwd(), options.paths.src.root);
    const baseRegExp = new RegExp('^' + escapeRegExp(rootPath + path.sep));

    const baseUrl = '/' + path.join(process.cwd(), options.assetsPath('src.images')).replace(baseRegExp, '').replace(path.sep, '/').trim('/') + '/';

    return {

        'build-env()': function () {
            return new types.String(options.production ? 'production' : 'development');
        },
        'map-to-JSON($map)': function (map) {
            const obj = {};
            times(map.getLength(), (i) => {
                const key = map.getKey(i).getValue().toString();
                obj[key] = map.getValue(i).getValue();
            });
            return new types.String(JSON.stringify(obj));
        },
        'image-url($path)': function (filepath) {
            const imagePath = path.join(process.cwd(), options.assetsPath('src.images'), filepath.getValue());
            var imageUrl = (baseUrl + filepath.getValue()); //eslint-disable-line no-var
            if (!fs.existsSync(imagePath)) {
                console.warn('File %s not found', imagePath); //eslint-disable-line no-console
                return false;
            }
            if (!options.production) {
                imageUrl += '?' + Date.now();
            }
            return new types.String('url(\'' + imageUrl + '\')');
        },
        'image-width($path)': function (filepath) {
            const imagePath = path.join(process.cwd(), options.assetsPath('src.images'), filepath.getValue());
            if (!fs.existsSync(imagePath)) {
                console.warn('File %s not found', imagePath); //eslint-disable-line no-console
                return false;
            }
            return new types.Number(sizeOf(imagePath).width, 'px');
        },
        'image-height($path)': function (filepath) {
            const imagePath = path.join(process.cwd(), options.assetsPath('src.images'), filepath.getValue());
            if (!fs.existsSync(imagePath)) {
                console.warn('File %s not found', imagePath); //eslint-disable-line no-console
                return false;
            }
            return new types.Number(sizeOf(imagePath).height, 'px');
        },
        'inline-image($path)': function (filepath) {
            const imagePath = path.join(process.cwd(), options.assetsPath('src.images'), filepath.getValue());
            if (!fs.existsSync(imagePath)) {
                console.warn('File %s not found', imagePath); //eslint-disable-line no-console
                return false;
            }
            return new types.String('url(\'' + datauri(imagePath) + '\')');

        }
    };
};