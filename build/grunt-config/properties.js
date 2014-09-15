/*jshint node:true */


module.exports = {
    //set to `true` to enable livereload
    livereload: true,
    //set to `true` to enable browsersync (will override livereload config)
    sync: false,
    //enable remote debug via weinre
    remoteDebug: false,
	//set to `true` when paired with Phing
	buildOnly: false,
    //for php projects use: '*.{html,php,phtml}'
	viewmatch: '*.html'
};