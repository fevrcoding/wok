/**
 * Use static JSON as a fake API.
 *
 * URL: /api/users --> application/fixtures/api/users.json
 *
 */
//function APIMiddleware(options) {
//    var url = require('url'),
//        path = require('path'),
//        fs = require('fs'),
//        fixturePath = path.join(process.cwd(), options.paths.src.fixtures, 'api'),
//        fixturePathRegEx = /^\/api\/(.+)/;
//
//    return function fixturesAPI(req, res, next) {
//
//
//        var parserUrl = url.parse(req.url, false);
//
//        var match = parserUrl.path.match(fixturePathRegEx),
//            filepath = match !== null ? path.join(fixturePath, match[1]) + '.json' : null;
//
//        if (filepath) {
//            fs.readFile(filepath, 'utf8', function (err, data) {
//                res.end(data);
//            });
//            return;
//        }
//        next();
//
//    };
//}


module.exports = function (/*options*/) {

    const middlewares = [];

    //middlewares.push(APIMiddleware(options));

    return middlewares;

};