module.exports = function (connect/*, options*/) {
    var app = connect();

    app.use('/api', function (req, res) {
        res.end('This is a custom API endpoint');
    });

    return app;
};