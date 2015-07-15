/**
 * Deploy Related Tasks
 * ===============================
 */

var Ssh = require('ssh2').Client,
    rsync = require('rsyncwrapper').rsync,
    _ = require('lodash');

module.exports = function (gulp, $, options) {

    var paths = options.paths,
        hosts = options.hosts,
        sshCommands,
        rsyncConf;

    rsyncConf = {
        src: paths.rsync,
        recursive: true,
        compareMode: 'checksum',
        syncDestIgnoreExcl: true,
        args: ['--verbose', '--progress', '--cvs-exclude'],
        exclude: [
            '.svn*',
            '.tmp*',
            '.idea*',
            '.sass-cache*',
            '*.sublime-*'
        ]
    };


    sshCommands = {

        backup: _.template(
            'mkdir -p <%= paths.backup %>;' +
            'filecount=$(ls -t <%= paths.backup %> | grep .tgz | wc -l);' +
            'if [ $filecount -gt 2 ];' +
                'then for file in $(ls -t <%= paths.backup %> | grep .tgz | tail -n $(($filecount-2)));' +
                    'do rm <%= paths.backup %>/$file;' +
                    'printf "Removing old backup file $file";' +
                'done;' +
            'fi;' +
            'if [ -d <%= paths.rsync %> ]; then ' +
                'printf "Backup folder <%= paths.rsync %> in <%= paths.backup %>/backup-<%= new Date().getTime() %>.tgz";' +
                'tar -cpzf <%= paths.backup %>/backup-<%= new Date().getTime() %>.tgz ' +
                    '<%= excludes.map(function (exc) { return " --exclude=\'" + exc + "\'";}).join(" ") %> <%= paths.rsync %>;' +
                'printf "Backup completed";' +
            'fi;'
        )({paths: paths, excludes: rsyncConf.exclude}),

        rollback: _.template(
            'if [ -d <%= paths.backup %> ];then ' +
                'rm -rf <%= paths.rsync %>/;' +
                'for file in $(ls -tr <%= paths.backup %> | tail -n 1);' +
                    'do tar -xzpf <%= paths.backup %>/$file;' +
                'done;' +
            'fi;'
        )({paths: paths})
    };


    function getDeployTarget(target) {
        var targets = Object.keys(hosts).filter(function (host) { return !!hosts[host].host; });

        if (!target || targets.indexOf(target) === -1) {
            $.util.log($.util.colors.red('Deploy target unavailable. Specifiy it via `--remotehost` argument. Allowed targets are: ' + targets.join(', ')));
            return false;
        } else {
            return hosts[target];
        }
    }


    gulp.task('remote', function (done) {

        var conn = new Ssh(),
            host;

        host = getDeployTarget(options.remotehost);
        if (host === false) {
            done('Deploy target unavailable');
            return false;
        }

        if (!options.command || !sshCommands.hasOwnProperty(options.command)) {
            $.util.log($.util.colors.red('SSH command set not specified. Specifiy it via `--command` argument.Allowed commands are: ' + Object.keys(sshCommands).join(', ')));
            done('SSH command set not specified');
            return false;
        }

        conn.on('ready', function() {
            conn.exec('cd ' + host.path + ';' + sshCommands[options.command], function(err, stream) {
                if (err) {
                    return done(err);
                }

                stream.on('close', function(code) {
                    $.util.log('REMOTE: close code: ' + code);
                    done();
                    return conn.end();
                }).on('data', function(data) {
                    $.util.log('REMOTE: ' + data);
                }).stderr.on('data', function(data) {
                    $.util.log($.util.colors.red('REMOTE: ' + data));
                });
            });
        }).connect({
            host: host.host,
            port: 22,
            password: host.password,
            username: host.username
        });

    });


    gulp.task('rsync', function (done) {

        var conf,
            host;

        host = getDeployTarget(options.remotehost);
        if (host === false) {
            done('Deploy target unavailable');
            return false;
        }

        conf = _.extend({
            dest: host.path,
            host: host.username + '@' + host.host
        }, rsyncConf);

        rsync(conf, function (error, stdout, sterr, cmd) {
            $.util.log($.util.colors.green('Running command ' + cmd));
            if (error) {
                // failed
                $.util.log($.util.colors.red(error.message));
                done(error);
            } else {
                $.util.log(stdout);
                done();
            }
        });

    });
};

