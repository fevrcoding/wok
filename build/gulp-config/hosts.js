module.exports = {

    staging: {
        host: 'staging.host',
        username: 'username',
        password: 'fancypassword',
        path: '/home/httpd/virtualhost'
    },

    production: {
        host: 'production.host',
        username: 'username',
        password: 'fancypassword',
        path: '/home/httpd/virtualhost'
    },


    //remote host of developer box for mobile debug with weinre
    devbox: {
        ports: {
            weinre: 8080,
            connect: 8000 //optional port for standalone static server
        }
    }
};