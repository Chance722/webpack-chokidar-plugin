const chokidar = require('chokidar')

function wepackChokidarPlugin (options) {
  this.options = options
}

wepackChokidarPlugin.prototype.apply = function(compiler) {
  const options = this.options

  compiler.plugin('done', compilation => {
    const watcher = chokidar.watch(options.watchFilePaths, {
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
    })

    watcher
    .on('add', path => {
      options.onAddCallback ? options.onAddCallback(path)
        : (() => null)()
    })
    .on('change', path => {
      options.onChangeCallback ? options.onChangeCallback(path)
        : (() => {
          console.log(`\n\n Compilation Started after change of - ${path} \n\n`)
          compiler.run(err => {
            if (err) throw err
            watcher.close()
          })
          console.log(`\n\n Compilation ended  for change of - ${path} \n\n`)
        })()
    })
    .on('unlink', path => {
      options.onUnlinkCallback ? options.onUnlinkCallback(path)
        : (() => console.log(`File ${path} has been removed`))()
    })

    watcher
      .on('addDir', path => {
        options.onAddDirCallback ? options.onAddDirCallback(path)
          : (() => console.log(`Directory ${path} has been added`))()
      })
      .on('unlinkDir', path => {
        options.unlinkDirCallback ? options.unlinkDirCallback(path)
          : (() => console.log(`Directory ${path} has been removed`))()
      })
      .on('error', () => {
        options.onErrorCallback ? options.onErrorCallback()
          : (error => console.log(`Watcher error: ${error}`))()
      })
      .on('ready', () => {
        options.onReadyCallback ? options.onReadyCallback()
          : (() => console.log(`Initial scan complete. Ready for changes`))()
      })
      .on('raw', (event, path, details) => {
        options.onRawCallback ? options.onRawCallback(event, path, details)
          : (() => null)()
      })
  })
}

module.exports = wepackChokidarPlugin