/**
 * Deploy Related Tasks
 * ===============================
 */

module.exports = function (gulp, $, options) {

    const paths = options.paths;
    const hosts = options.hosts;

    const rsyncConf = {
        src: paths.rsync,
        recursive: true,
        compareMode: 'checksum',
        delete: true,
        args: ['--verbose', '--progress', '--cvs-exclude'],
        exclude: [
            '.svn*',
            '.tmp*',
            '.idea*',
            '.sass-cache*',
            '*.sublime-*'
        ]
    };



    function getDeployTarget(target) {
        const targets = Object.keys(hosts).filter((host) => !!hosts[host].host);

        if (!target || targets.indexOf(target) === -1) {
            $.util.log($.util.colors.red('Error: Deploy target unavailable. Specifiy it via `--remotehost` argument. Allowed targets are: ' + targets.join(', ')));
            return false;
        }
        return hosts[target];
    }

    gulp.task('ftp', (done) => {
        const FTPS = require('ftps');
        const hasbin = require('hasbin');
        const host = getDeployTarget(options.remotehost);



        if (host === false) {
            done();
            return;
        }

        if (!hasbin.sync('lftp')) {
            $.util.log($.util.colors.red('Error: required `lftp` binary not found in PATH.'));
            done();
            return;
        }

        const ftps = new FTPS({
            host: host.host,
            password: host.password,
            username: host.username
        });

        $.util.log($.util.colors.green('Deploying to target %s (%s)'), options.remotehost, host.host);


        ftps.raw('mirror -p --reverse --delete --verbose --ignore-time ' + paths.dist.root + ' ' + host.path).exec((err, response) => {
            if (response.error) {
                done(response.error);
            } else {
                if (response.data.length === 0) {
                    $.util.log($.util.colors.cyan('[remote] ') + ' Nothing to sync');
                }
                done();
            }
        }).stdout.on('data', (res) => {
            res.toString().trim().split('\n').forEach((line) => {
                $.util.log($.util.colors.cyan('[remote] ') + line.trim());
            });
        });
    });


    gulp.task('remote', (done) => {

        const template = require('lodash/template');
        const Ssh = require('ssh2').Client;
        const conn = new Ssh();

        const sshCommands = {

            backup: template(
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
            )({ paths: paths, excludes: rsyncConf.exclude }),

            rollback: template(
                'if [ -d <%= paths.backup %> ];then ' +
                'rm -rf <%= paths.rsync %>/;' +
                'for file in $(ls -tr <%= paths.backup %> | tail -n 1);' +
                'do tar -xzpf <%= paths.backup %>/$file;' +
                'done;' +
                'fi;'
            )({ paths: paths })
        };

        const host = getDeployTarget(options.remotehost);

        if (host === false) {
            done();
            return;
        }

        if (!options.command || !sshCommands.hasOwnProperty(options.command)) { //eslint-disable-line no-prototype-builtins
            $.util.log($.util.colors.red(
                'SSH command set not specified. Specifiy it via `--command` argument.Allowed commands are: ' + Object.keys(sshCommands).join(', ')
            ));
            done('SSH command set not specified');
            return;
        }

        conn.on('ready', () => {
            conn.exec('cd ' + host.path + ';' + sshCommands[options.command], (err, stream) => {
                if (err) {
                    done(err);
                    return;
                }

                stream.on('close', (code) => {
                    $.util.log('REMOTE: close code: ' + code);
                    done();
                    conn.end();
                }).on('data', (data) => {
                    $.util.log('REMOTE: ' + data);
                }).stderr.on('data', (data) => {
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


    gulp.task('rsync', (done) => {

        const rsync = require('rsyncwrapper');
        const host = getDeployTarget(options.remotehost);

        if (host === false) {
            done('Deploy target unavailable');
            return;
        }

        const conf = Object.assign({
            dest: host.path,
            host: host.username + '@' + host.host
        }, rsyncConf);

        rsync(conf, (error, stdout, sterr, cmd) => {
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

