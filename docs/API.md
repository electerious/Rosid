# API

Rosid can be integrated into your project using its API *or* CLI. The API gives you more flexibility and allows you to use Rosid in your existing asset pipeline or toolset.

## Initialize

You must require and initialize Rosid before you can use the `serve` and `compile` functions.

Syntax:

```js
const Rosid = require('rosid')(routes)
```

Parameters:

- `routes` `{Array}` An array of [routes](Routes.md).

Returns:

- `{Object}` An instance of Rosid.

## Serve

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
- `opts` `{?Object}` An object of [options](Options.md).
- `callback` `{?Function}`
	- `err` `{?Error}`

## Compile

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
- `opts` `{?Object}` An object of [options](Options.md).
- `callback` `{?Function}`
	- `err` `{?Error}`