# Invo

A just-in-time development server and static site exporter written in [Node.js](https://nodejs.org/).

## Contents

- [Description](#description)
	- [What is Invo?](#what-is-invo)
	- [Why Invo?](#why-invo)
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

## Description

### What is Invo?

Invo is a framework that focus on two features:

1. A **development server with live-reloading**, which transforms files as soon as you request them.
2. A **static site generator**, which transforms files using defined transform-functions.

### Why Invo?

- It doesn't force you to use a defined directory structure
- It's build on popular modules like [Browsersync](https://www.browsersync.io)
- It integrates nicely with tools you are are already using to transform your files (e.g. [Gulp](http://gulpjs.com), [Grunt](http://gruntjs.com) or Vanilla JS)
- It's lightweight and only includes what it really needs
- Transformed files don't need to be saved along their source files
- It lets you compile code to static files to host them anywhere

### How does it work?

Invo starts a server and compares requested URLs with user-defined patterns. A associated file handler will be executed when a pattern matches. The handler receives information about the request and can transform the file, which will be send to the browser.

## Requirements

Invo dependents on...

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com)

Make sure to install and update all dependencies before you setup Invo.

## Setup

Install Invo using [npm](https://npmjs.com).

```sh
npm install invo
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
 * Invo compares all requested URLs with the following patterns.
 * The associated file-handler will be executed when a pattern matches.
 */
const routes = [{...}, {...}]

/*
 * Require and initialize Invo.
 */
let Invo = require('invo')(routes)
```

Both the file-handlers and routes are placeholders and Invo hasn't been executed, yet. Read more about [routes](#routes), [handlers](#handlers) and how to [execute](#execute) Invo to get started.

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

Invo compares all requested URLs with the path and executes the handler when the pattern matches. The path must be a relative. Invo uses the same [patterns the shell uses](https://github.com/isaacs/node-glob).

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
	 * Only run the handler once.
	 * Helpful when the file-handler combines multiple files.
	 */
	once: false
}
```

## Handlers

Handlers are functions which load and transform files. Invo doesn't care about how you transform them, but requires you to call the callback with the content of a file and a path where it should be saved. The `savePath` must be specified for the [compilation](#compile).

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
	- `savePath` `{String | null}` Where to save the file when compiling.

## Execute

### Initialize

You must require and initialize Invo before you can use the `serve` and `compile` functions.

Syntax:
```js
Invo = require('invo')(routes)
```

Parameters:
- `routes` `{Array}` An array of [routes](#routes).

### Serve

Start a static site server and compile requested files on-the-fly. The site will reload automatically when files change.

Syntax:
```js
Invo.serve(srcPath, opts, callback)
```

Example:
```js
Invo.serve('src/', (err) => {})
```

Parameters:
- `srcPath` `{String}` Path to the folder containing your site and untransformed files.
- `opts` `{Object | {}}`
- `callback` `{Function | null}`
	- `err` `{Error | null}`

### Compile

Export your site to a folder.

Syntax:
```js
Invo.compile(srcPath, distPath, opts, callback)
```

Example:
```js
Invo.compile('src/', 'dist/', (err) => {})
```

Parameters:
- `srcPath` `{String}` Path to the folder containing your site and untransformed files.
- `distPath` `{String}` Path where Invo should save your site and transformed files. The folder is automatically created and is assumed to be empty.
- `opts` `{Object | {}}`
- `callback` `{Function | null}`
	- `err` `{Error | null}`