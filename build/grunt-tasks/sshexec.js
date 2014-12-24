/**
 * SSH Commands
 * ===============================
 */
/*jshint node:true, camelcase:false */
module.exports = {
    backup: {
        command: [
            'mkdir -p <%= paths.backup %>',
            'filecount=$(ls -t <%= paths.backup %> | grep .tgz | wc -l)',
            'if [ $filecount -gt 2 ];' +
            'then for file in $(ls -t <%= paths.backup %> | grep .tgz | tail -n $(($filecount-2)));' +
            'do rm <%= paths.backup %>/$file;' +
            'done;' +
            'fi',
            'if [ -d <%= paths.relRsync %> ]; then ' +
            'tar -cpzf <%= paths.backup %>/backup-<%= new Date().getTime() %>.tgz ' +
            '<%= grunt.config.get("rsync.options.exclude").map(function (exc) { return " --exclude=\'" + exc + "\'";}).join(" ") %> <%= paths.relRsync %>',
            'fi;'
        ].join('; ')
    },
    rollback: {
        command: [
            'if [ -d <%= paths.backup %> ];then ' +
            'rm -rf <%= paths.relRsync %>/;' +
            'for file in $(ls -tr <%= paths.backup %> | tail -n 1);' +
            'do tar -xzpf <%= paths.backup %>/$file;' +
            'rm <%= paths.backup %>/$file;' +
            'done;' +
            'fi;'
        ].join('; ')
    }
};