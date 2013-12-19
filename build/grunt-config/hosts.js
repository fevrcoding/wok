/*jshint node:true */

module.export = {

	staging: {
		host: 'devug.intesys.it',
		username: 'web',
		password: 'rezzonico',
		path: '/home/httpd/virtualhost'
	},

	production: {
		host: 'mississippi.intesys.it',
		username: 'web',
		password: 'rezzonico',
		path: '/home/httpd/virtualhost'
	},

	//remote host of developer box for mobile debug with weinre
	devbox: {
		host: 'pilcomayo.intesys.it',
		ports: {
			livereload: 35729,
			weinre: 8080
		}
	}

};