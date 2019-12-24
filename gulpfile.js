const $ = require("@wok-cli/core");
const { deploy } = require("@wok-cli/tasks");

const preset = require("@wok-cli/preset-standard");
const ssh = require("@wok-cli/task-ssh");
const rsync = require("@wok-cli/plugin-deploy-rsync");
const lftp = require("@wok-cli/plugin-deploy-lftp");

const backup = $.task(ssh, { command: "backup" });
const sync = $.task(deploy, {
  src: "<%= paths.dist.root %>/",
  exclude: [".svn*", ".tmp*", ".idea*", ".sass-cache*", "*.sublime-*"]
});

sync.tap("strategy", "rsync", rsync);
sync.tap("strategy", "lftp", lftp);

const wok = preset($);

wok
  .globalHook("watcher", "notifier", require("@wok-cli/plugin-notifier"))
  .params("watch", {
    notifier: {
      message: "Updated!"
    }
  })
  .set("remote", ssh)
  .set("deploy")
  .compose(tasks => $.series(tasks.default, backup, sync));

module.exports = wok.resolve();
