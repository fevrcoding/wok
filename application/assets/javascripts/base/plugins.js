/**
 * Global JavaScript Plugins
 */

/*eslint no-console: 0*/
// @see https://raw.github.com/h5bp/html5-boilerplate/master/js/plugins.js
// Avoid `console` errors in browsers that lack a console.
(function () {
    var methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ],
        length = methods.length,
        console = (window.console = window.console || {}),
        method;

    function noop() {}

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method] || typeof console[method] !== 'function') {
            console[method] = noop;
        }
    }
}());



// Place any jQuery/helper plugins in here.