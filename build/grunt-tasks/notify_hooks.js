/*jshint node:true */
module.exports = function (grunt, options) {
    return {
        options: {
            enabled: true,
            title: options.pkg.name, // defaults to the name in package.json, or will use project directory's name
            success: true, // whether successful grunt executions should be notified automatically
            duration: 3 // the duration of notification in seconds, for `notify-send only
        }
    };
};