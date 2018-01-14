# Handlers

Handlers are functions which load and transform files. Rosid doesn't care about how they transform them, but requires them to return a promise. The promise should resolve a string that contains the content of the transformed file.

## Existing handlers

[See all handlers &#187;](https://www.npmjs.com/search?q=rosid-handler-)

## Custom handler

Check out our "[Writing a handler](Writing%20a%20handler.md)" guide to learn how to build your own handler.

Example:

```js
/*
 * A handler that always returns 'Hello World!'.
 */
module.exports = function(filePath, opts) {

	return Promise.resolve('Hello World!')

}
```

Parameters:

- `filePath` `{String}` Absolute path to file.
- `route` `{Object}` Options from the route.

Returns:

- `{Promise<String|Buffer>}` The transformed file content.

## Distributing a handler

Handlers should be distributed through npm. The recommended prefix is `rosid-handler-` and the `package.json` of your handler should at least contain the tags `rosid` and `handler`.
