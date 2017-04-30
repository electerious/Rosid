# Handlers

Handlers are functions which load and transform files. Rosid doesn't care about how they transform them, but requires them to return a promise. The promise should resolve a string that contains the content of the transformed file.

## Existing handlers

| Type | Description | Link |
|:-----------|:------------|:------------|
| JS => JS | Load, transform, bundle and compress JS. | [GitHub](https://github.com/electerious/rosid-handler-js) |
| JS => HTML | Load JS and transform to HTML. | [GitHub](https://github.com/electerious/rosid-handler-node) |
| SASS => CSS | Load SASS and transform to CSS, add vendor prefixes and minify. | [GitHub](https://github.com/electerious/rosid-handler-sass) |
| EJS => HTML | Load EJS templates and render them. | [GitHub](https://github.com/electerious/rosid-handler-ejs) |
| Nunjucks => HTML | Load Nunjucks templates and render them. | [GitHub](https://github.com/electerious/rosid-handler-njk) |

[See all handlers &#187;](https://www.npmjs.com/search?q=rosid-handler-)

## Custom handler

Example:

```js
/*
 * The following handler transforms SASS to CSS.
 */
const transfromSASS = function(filePath, opts) {

	/*
	 * 1. Load requested file (filePath)
	 * 2. Transform the file
	 * 3. Return the transformed contents of the file
	 */

	return Promise.resolve(`
		.css { display: none; }
	`)

}
```

Parameters:

- `filePath` `{String}` Absolute path to file.
- `route` `{Object}` Options from the route.

Returns:

- `{Promise}({String|Buffer})` The transformed file content.

## Distributing a handler

Handlers should be distributed through npm. The recommended prefix is `rosid-handler-` and the `package.json` of your handler should at least contain the tags `rosid` and `handler`.