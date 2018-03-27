const nunjucks = require('./nunjucks');
const uniq = require('lodash/uniq');

module.exports = (...args) => {
    const entries = [nunjucks].map(({ createRenderer }) => createRenderer(...args));
    //const viewMatchArray = entries.reduce((vm, { extensions }) => vm.concat(extensions), ['html']);
    //const viewmatch = `*.{${uniq(viewMatchArray.filter(Boolean)).join(',')}}`;

    return {
        entries,
        //viewmatch,
        match(filepath) {
            return entries.find(({ match }) => match(filepath));
        }
    };

};