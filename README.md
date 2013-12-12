> OK, this is a rather original folder setup... here are some docs to make it work

#INSTALL DEPENDENCIES

Requirements

* Node 0.10+
* Ruby
* bundler (`gem install bundler`)
* bower (`npm install -g bower`)
* grunt-cli (`npm install -g grunt-cli`)


From project root

* `bundle install` (compass deps)
* `bower install` (vendors, though they should already be checked in svn repo)
* `npm install` (grunt deps)

#DEV & BUILD

From project root
`cd build`
`grunt` (builds in development mode and watches for change, other tasks: `dev`, `dist`, `deploy:[staging|production]`)