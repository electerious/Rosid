# Rosid

[![Travis Build Status](https://travis-ci.org/electerious/rosid.svg?branch=master)](https://travis-ci.org/electerious/rosid) [![Coverage Status](https://coveralls.io/repos/github/electerious/rosid/badge.svg?branch=master)](https://coveralls.io/github/electerious/rosid?branch=master) [![Dependencies](https://david-dm.org/electerious/rosid.svg)](https://david-dm.org/electerious/rosid#info=dependencies)

Just-in-time development server and static site generator written in [Node.js](https://nodejs.org/). Rosid invokes functions before serving files to the browser. This allows you to transform anything on-the-fly, without saving.

## Contents

- [Description](#description)
	- [What is Rosid?](#what-is-rosid)
	- [Why Rosid?](#why-rosid)
	- [How does it work?](#how-does-it-work)
- [Requirements](#requirements)
- [Setup](#setup)
- [Routes](#routes)
	- [Name](#name)
	- [Path](#path)
	- [Handler](#handler)
	- [Args](#args)
- [Handlers](#handlers)
- [Execute](#execute)
	- [Initialize](#initialize)
	- [Serve](#serve)
	- [Compile](#compile)
	- [CLI](#cli)
- [Options](#options)
- [Tips](#tips)

## Description

### What is Rosid?

Rosid is a framework that focus on two features:

1. A **development server with live reloading**, which transforms files as soon as you request them.
2. A **static site generator**, which transforms files using defined transform functions.

### Why Rosid?

- It doesn't force you to use a defined directory structure
- It's build on popular modules like [Browsersync](https://www.browsersync.io)
- It integrates nicely with tools you are are already using to transform your files (e.g. [Gulp](http://gulpjs.com), [Grunt](http://gruntjs.com) or Vanilla JS)
- It's lightweight and only includes what it really needs
- Transformed files don't need to be saved along their source files
- It lets you compile code to static files to host them anywhere

### How does it work?

Rosid starts a server and compares requested URLs with user-defined patterns. A associated file handler will be executed when a pattern matches. The handler receives information about the request and can transform the file, which will be send to the browser.

## Requirements

Rosid dependents on...

- [Node.js](https://nodejs.org/en/) (v6.2.0 or newer)
- [npm](https://www.npmjs.com)

Make sure to install and update all dependencies before you setup Rosid.

## Setup

Install Rosid using [npm](https://npmjs.com).

```sh
npm install rosid
```

Create a new JS-file and add insert the following code:

```js
'use strict'

/*
 * Your file-handlers.
 */
const transfromJS = (...) => {...}
const transfromSASS = (...) => {...}

/*
 * Rosid compares all requested URLs with the following patterns.
 * The associated file-handler will be executed when a pattern matches.
 */
const routes = [{...}, {...}]

/*
 * Require and initialize Rosid.
 */
let Rosid = require('rosid')(routes)
```

Both the file-handlers and routes are placeholders and Rosid hasn't been executed, yet. Read more about [routes](#routes), [handlers](#handlers) and how to [execute](#execute) Rosid to get started.

## Routes

The route-configuration is an array of objects. Each object must contain a name, path and handler.

```js
const routes = [
	{
		name    : 'JS',
		path    : 'assets/scripts/**/*.js',
		handler : 'rosid-handler-js'
	},
	{
		name    : 'SCSS',
		path    : 'assets/styles/**/[^_]*.{css,scss}',
		handler : transfromSCSS,
		args    : { custom: 'data' }
	},
	{
		name    : 'EJS',
		path    : '[^_]*.{html,ejs}',
		handler : require('rosid-handler-ejs')
	}
]
```

Store the routes in a variable or save them in a JSON file called `rosidfile.json`. This file must be placed in your current working directory when using the [CLI](#cli). Here's how it might look like:

```json
[
	{
		"name"    : "JS",
		"path"    : "assets/scripts/**/[^_]*.js",
		"handler" : "rosid-handler-js"
	},
	{
		"name"    : "SCSS",
		"path"    : "assets/styles/[^_]*.{css,scss}",
		"handler" : "rosid-handler-scss"
	},
	{
		"name"    : "EJS",
		"path"    : "[^_]*.{html,ejs}",
		"handler" : "rosid-handler-ejs"
	}
]
```

### Name

Type: `String` Default: `null` Optional: `false`

Name of the route.

### Path

Type: `String` Default: `null` Optional: `false`

Rosid compares all requested URLs (when running the [development server](#serve)) and all existing files (when [compiling the project](#compile)) with the path. It executes the handler when the pattern matches. The path must be a relative. Query strings will be ignored. Rosid uses the same [patterns the shell uses](https://github.com/isaacs/node-glob).

### Handler

Type: `Function|String` Default: `null` Optional: `false` Signature: `filePath, srcPath, distPath, route, callback`

Should be a function which transforms and returns the content of a file. When a string is specified, Rosid tries to require the given module. [More about handlers...](#handlers)

### Args

Type: `Object` Default: `{}` Optional: `true`

A save place to store route-specific properties, settings or data. All args are accessible inside the corresponding handler using `route.args`.

## Handlers

Handlers are functions which load and transform files. Rosid doesn't care about how you transform them, but requires you to return a promise which resolves an object with two properties: The content of a file (`data`) and a path where it should be saved (`savePath`). The `savePath` must be specified for the [compilation](#compile).

Existing handlers:

| Supported Files | Description | Link |
|:-----------|:------------|:------------|
| *.js | Load, transform, bundle and compress JS. | [GitHub](https://github.com/electerious/rosid-handler-js) |
| *.scss | Load SCSS and transform to CSS, add vendor prefixes and minify. | [GitHub](https://github.com/electerious/rosid-handler-scss) |
| *.ejs | Load EJS and transform to HTML. | [GitHub](https://github.com/electerious/rosid-handler-ejs) |

Example:

```js
/*
 * The following handler transforms SCSS to CSS.
 */
const transfromSCSS = function(filePath, srcPath, distPath, route) {

	/*
	 * 1. Load requested file (filePath)
	 * 2. Transform the file
	 * 3. Return the transformed contents of the file and a save path
	 */

	return Promise.resolve({
		data     : css
		savePath : path.join(distPath + 'assets/styles/main.css')
	})

}
```

Parameters:

- `filePath` `{String}` Absolute path to the requested file.
- `srcPath` `{String}` Absolute path to the source folder.
- `distPath` `{?String}` Absolute path to the export folder.
- `route` `{Object}` The route which matched the request URL.

Returns:

- `{Promise}({Object})`
	- `data` `{String | Buffer}` The transformed file content.
	- `savePath` `{?String}` Where to save the file when compiling. If the parent directory does not exist, it's created.

## Execute

### Initialize

You must require and initialize Rosid before you can use the `serve` and `compile` functions.

Syntax:

```js
Rosid = require('rosid')(routes)
```

Parameters:

- `routes` `{Array}` An array of [routes](#routes).

### Serve

Start a static site server and compile requested files on-the-fly. The site will reload automatically when files change.

Syntax:

```js
Rosid.serve(srcPath, opts, callback)
```

Example:

```js
Rosid.serve('src/', (err) => {})
```

Parameters:

- `srcPath` `{String}` Path to the folder containing your site and untransformed files.
- `opts` `{?Object}` An object of [options](#options).
- `callback` `{?Function}`
	- `err` `{?Error}`

### Compile

Export your site to a folder.

Syntax:

```js
Rosid.compile(srcPath, distPath, opts, callback)
```

Example:

```js
Rosid.compile('src/', 'dist/', (err) => {})
```

Parameters:

- `srcPath` `{String}` Path to the folder containing your site and untransformed files.
- `distPath` `{String}` Path where Rosid should save your site and transformed files. The folder is automatically created and is assumed to be empty.
- `opts` `{?Object}` An object of [options](#options).
- `callback` `{?Function}`
	- `err` `{?Error}`

### CLI

Rosid can be used as a library or as a command line utility. The tool is located in the `bin` folder and allows you to run the `serve` and `compile` functions without adding JS files to your project. Only a single `rosidfile.json` is required in your current working directory. Execute `rosid --help` for additional information.

## Options

If you want more control over the `serve` or `compile` function, pass an object with the following parameters to them:

```js
{
	/*
	 * Option for the copy-module which will only run when compiling your site.
	 * [] = Ignore the following files when copying.
	 *      Must be an array of strings, which will be matched against absolute paths.
	 */
	ignore: [],
	/*
	 * Increase verbosity.
	 * true  = Log additional messages.
	 * false = Only log important messages.
	 */
	verbose: false,
	/*
	 * Option for the deliver-module which will only run when serving your site.
	 * It is typically necessary to set this to true to successfully watch files over a network,
	 * and it may be necessary to successfully watch files in other non-standard situations.
	 * true  = Use fs.watch
	 * false = Use fs.watchFile (backed by polling)
	 */
	polling: false
}
```

## Tips

- Install Rosid without optional dependencies using npm's `--no-optional` flag. This speeds up the installation and skips a lot of dependencies. It's perfect when used in production. The downside: Running the `serve` function isn't possible anymore.