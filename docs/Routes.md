# Routes

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
		opts    : { custom: 'data' }
	},
	{
		name    : 'EJS',
		path    : '[^_]*.{html,ejs}',
		handler : require('rosid-handler-ejs')
	}
]
```

Store the routes in a variable or save them in a JSON file called `rosidfile.json`. This file must be placed in your current working directory when using the [CLI](CLI.md). Here's how it might look like:

```json
[
	{
		"name"    : "JS",
		"path"    : "assets/scripts/**/[^_]*.js",
		"handler" : "rosid-handler-js"
	},
	{
		"name"    : "SASS",
		"path"    : "assets/styles/[^_]*.{css,sass}",
		"handler" : "rosid-handler-sass"
	},
	{
		"name"    : "EJS",
		"path"    : "[^_]*.{html,ejs}",
		"handler" : "rosid-handler-ejs"
	}
]
```

## Name

Type: `String` Default: `null` Optional: `false`

Name of the route.

## Path

Type: `String` Default: `null` Optional: `false`

Rosid compares all requested URLs (when running the [development server](API.md#serve)) and all existing files (when [compiling a project](API.md#compile)) with the path. It executes the handler when the pattern matches. The path must be a relative. Query strings will be ignored. Rosid uses the same [patterns the shell uses](Patterns.md).

## Handler

Type: `Function|String` Default: `null` Optional: `false` Signature: `filePath, opts`

Should be a function which transforms and returns the content of a file. When a string is specified, Rosid tries to require the given module. [More about handlers...](Handlers.md)

## Opts

Type: `Object` Default: `{}` Optional: `true`

A save place to store route-specific properties, settings or data. All data is accessible inside the corresponding handler. It's the second parameter passed to the handler.

You can choose your property names freely. Only the following names are reserved by Rosid:

- Rosid automatically appends a `optimize` property. `optimize` is `false` when running the [development server](API.md#serve) *or* `true` when [compiling a project](API.md#compile). This option can be used to optimize the output of handlers depending on how Rosid has been executed. Set a custom `optimize` to use your option instead.
- Each handler has a predefined load (`in`) and save (`out`) extension. Specify a custom extension to overwrite the default of the handler.

`rosid-handler-sass` loads `.sass` files by default and only optimizes the output when necessary. The following `rosidfile.json` shows reserved options in action, forces a optimization and sets the `in` extension to `.scss`.

```json
[
	{
		"name"    : "SASS",
		"path"    : "assets/styles/[^_]*.{css,scss}",
		"handler" : "rosid-handler-sass",
		"opts"    : {
			"in"       : ".scss",
			"optimize" : true
		}
	}
]
```
