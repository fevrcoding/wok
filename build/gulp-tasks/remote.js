/**
 * Deploy Related Tasks
 * ===============================
 */

const log = require('fancy-log');
const { red, green, cyan } = require('ansi-colors');
const paths = require('../gulp-config/paths');

const exclude = [
    '.svn*',
    '.tmp*',
    '.idea*',
    '.sass-cache*',
    '*.sublime-*'
];

const getDeployTarget = ({ target, hosts }) => {
    const targets = Object.keys(hosts).filter((host) => !!hosts[host].host);
    if (!target || targets.indexOf(target) === -1) {
        log.error(red('ERROR: Deploy target unavailable. Specify it via `--target` argument. Allowed targets are: ' + targets.join(', '))); //eslint-disable-line
        return false;
    }
    return hosts[target];
};

const ftp = (host) => {
    const FTPS = require('ftps');
    const hasbin = require('hasbin');

    if (!hasbin.sync('lftp')) {
        throw new Error('[deploy] FTP: required `lftp` binary not found in PATH.');
    }

    const {
        password, username, path, port = 21, protocol = 'ftp', src = paths.toPath('dist.root')
    } = host;

    const ftps = new FTPS({
        host: host.host,
        password,
        username,
        port,
        protocol,
        escape: false
    });


    return new Promise((resolve, reject) => {
        ftps.raw(`mirror -p --reverse --delete --verbose --ignore-time ${src} ${path}`).exec((err, { error, data }) => {
            if (error) {
                reject(error);
            } else {
                if (data.length === 0) {
                    log(`${cyan('[remote]')} Nothing to sync`);
                }
                resolve();
            }
        }).stdout.on('data', (res) => {
            res.toString().trim().split('\n').forEach((line) => {
                log(`${cyan('[remote]')} ${line.trim()}`);
            });
        });
    });
};

const remote = (command, host, { excludes }) => {

    const template = require('lodash/template');
    const { Client } = require('ssh2');
    const conn = new Client();

    const sshCommands = {

        /* eslint-disable function-paren-newline */
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
        )({ paths, excludes }),

        rollback: template(
            'if [ -d <%= paths.get("backup") %> ];then ' +
            'rm -rf <%= paths.get("rsync") %>/;' +
            'for file in $(ls -tr <%= paths.get("backup") %> | tail -n 1);' +
            'do tar -xzpf <%= paths.get("backup") %>/$file;' +
            'done;' +
            'fi;'
        )({ paths })
        /* eslint-enable function-paren-newline */
    };



    if (!command || !sshCommands[command]) {
        throw new Error('SSH command set not specified. Specifiy it via `--command` argument. Allowed commands are: ' + Object.keys(sshCommands).join(', '));
    }

    const { username, password, port = 22 } = host;

    return new Promise((resolve, reject) => {
        conn.on('ready', () => {
            conn.exec(`cd ${host.path};${sshCommands[command]}`, (err, stream) => {
                if (err) {
                    reject(err);
                    return;
                }

                stream.on('close', (code) => {
                    log(`REMOTE: close code: ${code}`);
                    resolve();
                    conn.end();
                }).on('data', (data) => {
                    log('REMOTE: ' + data);
                }).stderr.on('data', (data) => {
                    log(red('REMOTE: ' + data));
                });
            });
        }).connect({
            host: host.host,
            port,
            password,
            username
        });
    });


};

const rsync = (host) => {

    const rsyncWrapper = require('rsyncwrapper');

    const { username, port = 22, path } = host;

    const rsyncConf = {
        src: paths.get('rsync'),
        dest: path,
        host: `${username}@${host.host}`,
        recursive: true,
        compareMode: 'checksum',
        delete: true,
        args: ['--verbose', '--progress', '--cvs-exclude'],
        exclude,
        port
    };

    return remote('backup', host, { excludes: exclude }).then(() =>
        new Promise((resolve, reject) => {
            rsyncWrapper(rsyncConf, (error, stdout, sterr, cmd) => {
                log(green('Running command ' + cmd));
                if (error) {
                    // failed
                    log(red(error.message));
                    reject(error);
                } else {
                    log(stdout);
                    resolve();
                }
            });
        }));
};

const deployModules = {
    ftp,
    rsync
};

module.exports = (gulp, $, options) => () => {

    const { target, command } = options;
    const host = getDeployTarget(options);

    if (host === false) {
        throw new Error(`[deploy]: Unable to retrieve an host for target ${target}`);
    }

    const { deployStrategy = options.deployStrategy } = host;

    if (deployStrategy === 'rsync' && command) {
        return remote(command, host, { excludes: exclude });
    }

    const strategy = deployModules[deployStrategy];

    if (!strategy) {
        throw new Error(`[deploy]: Strategy "${deployStrategy}" is not a valid option. Use: ${Object.keys(deployModules).join(', ')} `);
    }

    log(green(`Deploying to target ${target} (${host.host})`));

    return strategy(host);

};