'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var chokidar = _interopDefault(require('chokidar'));

function wepackChokidarPlugin(options) {
  this.options = options;
}

wepackChokidarPlugin.prototype.apply = function (compiler) {
  var options = this.options;
  compiler.plugin('done', function (compilation) {
    var watcher = chokidar.watch(options.watchFilePaths, {
      persistent: options.persistance || true,
      ignored: options.ignored || false,
      ignoreInitial: options.ignoreInitial || false,
      followSymlinks: options.followSymlinks || true,
      cwd: options.cwd || '.',
      disableGlobbing: options.disableGlobbing || false,
      usePolling: options.usePolling || true,
      interval: options.interval || 100,
      binaryInterval: options.binaryInterval || 300,
      alwaysStat: options.alwaysStat || false,
      depth: options.depth || 99,
      awaitWriteFinish: {
        stabilityThreshold: options.stabilityThreshold || 2000,
        pollInterval: options.pollInterval || 100
      },
      ignorePermissionErrors: options.ignorePermissionErrors || false,
      atomic: options.atomic || true
    });
    watcher.on('add', function (path) {
      options.onAddCallback ? options.onAddCallback(path) : function () {
        return null;
      }();
    }).on('change', function (path) {
      options.onChangeCallback ? options.onChangeCallback(path) : function () {
        console.log("\n\n Compilation Started after change of - ".concat(path, " \n\n"));
        compiler.run(function (err) {
          if (err) throw err;
          watcher.close();
        });
        console.log("\n\n Compilation ended  for change of - ".concat(path, " \n\n"));
      }();
    }).on('unlink', function (path) {
      options.onUnlinkCallback ? options.onUnlinkCallback(path) : function () {
        return console.log("File ".concat(path, " has been removed"));
      }();
    });
    watcher.on('addDir', function (path) {
      options.onAddDirCallback ? options.onAddDirCallback(path) : function () {
        return console.log("Directory ".concat(path, " has been added"));
      }();
    }).on('unlinkDir', function (path) {
      options.unlinkDirCallback ? options.unlinkDirCallback(path) : function () {
        return console.log("Directory ".concat(path, " has been removed"));
      }();
    }).on('error', function () {
      options.onErrorCallback ? options.onErrorCallback() : function (error) {
        return console.log("Watcher error: ".concat(error));
      }();
    }).on('ready', function () {
      options.onReadyCallback ? options.onReadyCallback() : function () {
        return console.log("Initial scan complete. Ready for changes");
      }();
    }).on('raw', function (event, path, details) {
      options.onRawCallback ? options.onRawCallback(event, path, details) : function () {
        return null;
      }();
    });
  });
};

var src = wepackChokidarPlugin;

module.exports = src;
