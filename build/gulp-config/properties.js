module.exports = {

    deployStrategy: 'rsync', //`rsync` or `ftp`

    livereload: true, //set to `true` to enable livereload

    styleguideDriven: false, //will rebuild the styleguide whenever stylesheets change

    buildOnly: false, //set to `true` when paired with Phing

    viewsExt: ['html', 'njk'], //for php projects use: '*.{html,php,phtml}'

    enableNotify: true //set to `false` to disable gulp-notify plugin
};