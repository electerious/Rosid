# Rosid

Just-in-time development server and static site exporter written in [Node.js](https://nodejs.org/). Rosid invokes functions before serving files to the browser. This allows you to pre-process anything on-the-fly, without saving it.

## Contents

- [Description](#description)
	- [What is Rosid?](#what-is-rosid)
	- [Why Rosid?](#why-rosid)
	- [How does it work?](#how-does-it-work)
- [Requirements](#requirements)
- [Setup](#setup)
- [Routes](#routes)
	- [Path](#path)
	- [Handler](#handler)
	- [Args](#args)
	- [Opts](#opts)
- [Handlers](#handlers)
- [Execute](#execute)
	- [Initialize](#initialize)
	- [Serve](#serve)
	- [Compile](#compile)
- [Options](#options)

## Description

### What is Rosid?

Rosid is a framework that focus on two features:

1. A **development server with live-reloading**, which transforms files as soon as you request them.
2. A **static site generator**, which transforms files using defined transform-functions.

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

- [Node.js](https://nodejs.org/en/)
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

The route-configuration is an array of objects. Each object must contain a path and a file handler.

```js
const routes = [{
		path    : 'assets/scripts/**/*.js',
		handler : transfromJS
	},
	{
		path    : 'assets/styles/**/*.{css,scss}',
		handler : transfromSASS,
		args    : { custom: 'data' }
		opts    : { once: true }
	}
]
```

### Path

Type: `String` Default: `null` Optional: `false`

Rosid compares all requested URLs with the path and executes the handler when the pattern matches. The path must be a relative. Rosid uses the same [patterns the shell uses](https://github.com/isaacs/node-glob).

### Handler

Type: `Function` Default: `null` Optional: `false` Signature: `filePath, srcPath, distPath, route, next`

Must be a function which transforms and returns the content of a file. [More about handlers...](#handlers)

### Args

Type: `Object` Default: `{}` Optional: `true`

A save place to store route-specific properties, settings or data. All args are accessible inside the corresponding handler.

### Opts

Type: `Object` Default: `{}` Optional: `true`

Custom options for the route.

```js
{
	/*
	 * Only run handler once.
	 * On compilation, Rosid runs the handler for each matching file.
	 * Use this option when the file-handler combines multiple files and should only run once.
	 */
	once: false
}
```

## Handlers

Handlers are functions which load and transform files. Rosid doesn't care about how you transform them, but requires you to call the callback with the content of a file and a path where it should be saved. The `savePath` must be specified for the [compilation](#compile).

Existing handlers:

| Supported Files | Description | Link |
|:-----------|:------------|:------------|
| *.js | Load, transform and compress JS. | [GitHub](https://github.com/electerious/rosid-handler-js) |
| *.scss | Load SCSS and transform to CSS, add vendor prefixes and minify. | [GitHub](https://github.com/electerious/rosid-handler-scss) |
| *.ejs | Load EJS and transform to HTML. | [GitHub](https://github.com/electerious/rosid-handler-ejs) |

Example:
```js
/*
 * The following handler transforms SASS to CSS.
 */
const transfromSASS = function(filePath, srcPath, distPath, route, next) {

	/*
	 * 1. Load requested file (filePath)
	 * 2. Transform the file
	 * 3. Return the transformed contents of the file
	 */

	next(null, css, path.join(distPath + 'assets/styles/main.css'))

}
```

Parameters:
- `filePath` `{String}` Absolute path to the requested file.
- `srcPath` `{String}` Absolute path to the source folder.
- `distPath` `{String | null}` Absolute path to the export folder.
- `route` `{Object}` The route which matched the request URL.
- `next` `{Function}`
	- `err` `{Error | null}`
	- `result` `{String | Buffer}` The transformed file content.
	- `savePath` `{String | null}` Where to save the file when compiling. If the parent directory does not exist, it's created.

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
- `opts` `{Object | {}}` An object of [options](#options).
- `callback` `{Function | null}`
	- `err` `{Error | null}`

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
- `opts` `{Object | {}}` An object of [options](#options).
- `callback` `{Function | null}`
	- `err` `{Error | null}`

## Options

If you want more control over the [serve](#serve)- or [compile](#compile)-function, you can pass an object with the following parameters to them:

```js
{
	/*
	 * Options for the copy-module.
	 * This module will only run when compiling your site.
	 */
	copy: {
		/*
		 * Don't copy anything to the distPath.
		 */
		skip: false,
		/*
		 * Ignore the following files when copying.
		 * Must be an array of strings, which will be matched against absolute paths.
		 */
		files: []
	}
}
```