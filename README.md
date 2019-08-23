# webpack-chokidar-plugin

[![Build Status](https://travis-ci.org/Chance722/webpack-chokidar-plugin.svg?branch=master)](https://travis-ci.org/Chance722/webpack-chokidar-plugin)

> A webpack plugin for Watching files / folders, powered by chokidar. 

### [Getting started]

Install with npm or yarn:
```
yarn add webpack-chokidar-plugin
```

Then rquire and use it in your code:
```
const path = require('path')
const WebpackChokidarPlugin = require('webpack-chokidar-plugin')
...
plugins: [
  new WebpackChokidarPlugin({
    watchFilePaths: [
      path.resolve(__dirname, 'src/assets/**'),
      ...
    ],
  }),
],
```

### [API]

#### Persistence
- persistent (default: true). Indicates whether the process should continue to run as long as files are being watched. If set to false when using fsevents to watch, no more events will be emitted after ready, even if the process continues to run.

#### Path filtering
- ignored (anymatch-compatible definition) Defines files/paths to be ignored. The whole relative or absolute path is tested, not just filename. If a function with two arguments is provided, it gets called twice per path - once with a single argument (the path), second time with two arguments (the path and the fs.Stats object of that path).
- ignoreInitial (default: false). If set to false then add/addDir events are also emitted for matching paths while instantiating the watching as chokidar discovers these file paths (before the ready event).
- followSymlinks (default: true). When false, only the symlinks themselves will be watched for changes instead of following the link references and bubbling events through the link's path.
- cwd (no default). The base directory from which watch paths are to be derived. Paths emitted with events will be relative to this.
- disableGlobbing (default: false). If set to true then the strings passed to .watch() and .add() are treated as literal path names, even if they look like globs.

#### Performance

- usePolling (default: false). Whether to use fs.watchFile (backed by polling), or fs.watch. If polling leads to high CPU utilization, consider setting this to false. It is typically necessary to set this to true to successfully watch files over a network, and it may be necessary to successfully watch files in other non-standard situations. Setting to true explicitly on MacOS overrides the useFsEvents default. You may also set the CHOKIDAR_USEPOLLING env variable to true (1) or false (0) in order to override this option.
- Polling-specific settings (effective when usePolling: true)
interval (default: 100). Interval of file system polling. You may also set the CHOKIDAR_INTERVAL env variable to override this option.
binaryInterval (default: 300). Interval of file system polling for binary files. (see list of binary extensions)
- useFsEvents (default: true on MacOS). Whether to use the fsevents watching interface if available. When set to true explicitly and fsevents is available this supercedes the usePolling setting. When set to false on MacOS, usePolling: true becomes the default.
- alwaysStat (default: false). If relying upon the fs.Stats object that may get passed with add, addDir, and change events, set this to true to ensure it is provided even in cases where it wasn't already available from the underlying watch events.
- depth (default: undefined). If set, limits how many levels of subdirectories will be traversed.
- awaitWriteFinish (default: false). By default, the add event will fire when a file first appears on disk, before the entire file has been written. Furthermore, in some cases some change events will be emitted while the file is being written. In some cases, especially when watching for large files there will be a need to wait for the write operation to finish before responding to a file creation or modification. Setting awaitWriteFinish to true (or a truthy value) will poll file size, holding its add and change events until the size does not change for a configurable amount of time. The appropriate duration setting is heavily dependent on the OS and hardware. For accurate detection this parameter should be relatively high, making file watching much less responsive. Use with caution.
   + options.awaitWriteFinish can be set to an object in order to adjust timing params:
   + awaitWriteFinish.stabilityThreshold (default: 2000). Amount of time in milliseconds for a file size to remain constant before emitting its event.
   + awaitWriteFinish.pollInterval (default: 100). File size polling interval.
  
#### [Methods]

Supported Options | Details
------------- | -------------
onAddCallback | Must be a function . Callback to be executed when a new file added which matches the path mentioned in `watchFilePaths` . defaults to ``` function(path) { return null;} ```
onChangeCallback | Must be a function . Callback to be executed when any file, under file-watcher's purview, is changed  . defaults to ``` function(path) {console.log(`\n\n Compilation Started  after change of - ${path} \n\n`);compiler.run(function(err) {if (err) throw err;watcher.close();});console.log(`\n\n Compilation ended  for change of - ${path} \n\n`);} ``` . [Compiler](https://github.com/webpack/docs/wiki/plugins) is webpack object.
onUnlinkCallback | Must be a function . Callback to be executed when a file is unlinked . defaults to ``` function(path) { console.log(`File ${path} has been removed`);} ```
onAddDirCallback | Must be a function . Callback to be executed when a new folder added . defaults to ``` function(path) { console.log(`Directory ${path} has been added`);} ```
onReadyCallback | Must be a function . Callback to be executed when all the files are added to the watcher and watcher is ready to monitor change . defaults to ``` function() { console.log('Initial scan complete. Ready for changes');} ```
onRawCallback | Must be a function . Callback to be executed when a raw event is encountered . defaults to ``` function(event, path, details) { return null;} ```
onErrorCallback | Must be a function . Callback to be executed when watcher thows an error . Defaults to ``` function(error) { console.log(`Watcher error: ${error}`);} ```


#### [Example]

```
const webpackChokidarPlugin = require("webpack-chokidar-plugin");
...
plugins: [
        new webpackChokidarPlugin({
            watchFilePaths: [
              '../js/**/*.js', '../style/**/*.css'
            ], 
            onReadyCallback: () => console.log('Yo Im ready!'),
            onChangeCallback: () => console.log('Yeah I changed!'),
            usePolling: false,
            ignored: '/node_modules/',
        }),
    ],
...


``` 