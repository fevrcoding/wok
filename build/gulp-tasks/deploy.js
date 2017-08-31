/**
 * Deploy Related Tasks
 * ===============================
 */

module.exports = (gulp, $, options) => {

    const { getDeployTarget } = options;
    const paths = require('../gulp-config/paths');

    const rsyncConf = {
        src: paths.get('rsync'),
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

    gulp.task('ftp', (done) => {
        const FTPS = require('ftps');
        const hasbin = require('hasbin');
        const host = getDeployTarget(options.target);

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
            username: host.username,
            protocol: 'ftp',
            escape: false
        });

        $.util.log($.util.colors.green('Deploying to target %s (%s)'), options.target, host.host);


        ftps.raw('mirror -p --reverse --delete --verbose --ignore-time ' + (host.src || paths.toPath('dist.root')) + ' ' + host.path).exec((err, response) => {
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
        const host = getDeployTarget(options.target);

        const sshCommands = {

            backup: template(
                'mkdir -p <%= paths.get("backup") %>;' +
                'filecount=$(ls -t <%= paths.get("backup") %> | grep .tgz | wc -l);' +
                'if [ $filecount -gt 2 ];' +
                'then for file in $(ls -t <%= paths.get("backup") %> | grep .tgz | tail -n $(($filecount-2)));' +
                'do rm <%= paths.get("backup") %>/$file;' +
                'printf "Removing old backup file $file";' +
                'done;' +
                'fi;' +
                'if [ -d <%= paths.get("rsync") %> ]; then ' +
                'printf "Backup folder <%= paths.get("rsync") %> in <%= paths.get("backup") %>/backup-<%= new Date().getTime() %>.tgz";' +
                'tar -cpzf <%= paths.get("backup") %>/backup-<%= new Date().getTime() %>.tgz ' +
                '<%= excludes.map(function (exc) { return " --exclude=\'" + exc + "\'";}).join(" ") %> <%= paths.get("rsync") %>;' +
                'printf "Backup completed";' +
                'fi;'
            )({ paths, excludes: rsyncConf.exclude }),

            rollback: template(
                'if [ -d <%= paths.get("backup") %> ];then ' +
                'rm -rf <%= paths.get("rsync") %>/;' +
                'for file in $(ls -tr <%= paths.get("backup") %> | tail -n 1);' +
                'do tar -xzpf <%= paths.get("backup") %>/$file;' +
                'done;' +
                'fi;'
            )({ paths })
        };

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
        const host = getDeployTarget(options.target);

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