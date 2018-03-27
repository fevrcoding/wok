const nunjucks = require('./nunjucks');

module.exports = (...args) => {
    const entries = [nunjucks].map(({ createRenderer }) => createRenderer(...args));

    return {
        entries,
        match(filepath) {
            return entries.find(({ match }) => match(filepath));
        }
    };

};