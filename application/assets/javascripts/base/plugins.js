/**
 * Global JavaScript Plugins
 */

/* eslint no-console: 0, no-var: 0 */
// @see https://raw.github.com/h5bp/html5-boilerplate/master/js/plugins.js
// Avoid `console` errors in browsers that lack a console.
(function consoleFallback() {
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {}); //eslint-disable-line no-multi-assign
    var method;

    function noop() {}

    while (length--) { //eslint-disable-line no-plusplus
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method] || typeof console[method] !== 'function') {
            console[method] = noop;
        }
    }
}());



// Place any jQuery/helper plugins in here.