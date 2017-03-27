/**
 * Node Sass Functions
 */

const path = require('path');
const fs = require('fs');
const times = require('lodash/times');
const escapeRegExp = require('lodash/escapeRegExp');
const sizeOf = require('image-size');
const datauri = require('datauri').sync;

let types;

try {
    types = require('node-sass').types;
} catch (e) {
    types = require('gulp-sass/node_modules/node-sass').types; //eslint-disable-line import/no-unresolved
}

module.exports = (options) => {

    const paths = require('../../gulp-config/paths');
    const rootPath = paths.toAbsPath('src.root');
    const imgPath = paths.toAbsPath('src.assets/images');
    const baseRegExp = new RegExp('^' + escapeRegExp(rootPath + path.sep));

    const baseUrl = '/' + paths.toAbsPath('src.assets/images').replace(baseRegExp, '').replace(path.sep, '/').trim('/') + '/';


    const getFilePath = (filepath) => {
        const imagePath = path.join(imgPath, filepath.getValue());
        if (!fs.existsSync(imagePath)) {
            console.warn('File %s not found', imagePath); //eslint-disable-line no-console
            return false;
        }
        return imagePath;
    };

    return {

        'build-env()': function buildEnv() {
            return new types.String(options.production ? 'production' : 'development');
        },
        'map-to-JSON($map)': function toJSON(map) {
            const obj = {};
            times(map.getLength(), (i) => {
                const key = map.getKey(i).getValue().toString();
                obj[key] = map.getValue(i).getValue();
            });
            return new types.String(JSON.stringify(obj));
        },
        'image-url($path)': function imageUrlFn(filepath) {
            const imagePath = path.join(imgPath, filepath.getValue());
            let imageUrl = (baseUrl + filepath.getValue());
            if (!fs.existsSync(imagePath)) {
                console.warn('File %s not found', imagePath); //eslint-disable-line no-console
                return false;
            }
            if (!options.production) {
                imageUrl += '?' + Date.now();
            }
            return new types.String('url(\'' + imageUrl + '\')');
        },
        'image-width($path)': function imageWidth(filepath) {
            const imagePath = getFilePath(filepath);
            if (imagePath) {
                return new types.Number(sizeOf(imagePath).width, 'px');
            }
            return null;
        },
        'image-height($path)': function imageHeight(filepath) {
            const imagePath = getFilePath(filepath);
            if (imagePath) {
                return new types.Number(sizeOf(imagePath).height, 'px');
            }
            return null;
        },
        'inline-image($path)': function inlineImage(filepath) {
            const imagePath = getFilePath(filepath);
            if (imagePath) {
                return new types.String('url(\'' + datauri(imagePath) + '\')');
            }
            return null;
        }
    };
};