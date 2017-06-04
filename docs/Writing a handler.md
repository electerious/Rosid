# Writing a handler

Handlers are an essential part of Rosid. They're functions which load and transform files. This guide shows you how to build your own handler.

## 1. Setup

Run `npm init` in an empty folder to interactively create a package.json file with the name `rosid-handler-helloworld`.

The created `package.json` should point to a non-existing `index.js`. Let's create the `index.js`:

```js
module.exports = function(filePath, opts) {

	return Promise.resolve().then(() => {

		return 'Hello World!'

	})

}
```

Our handler is a function that returns a Promise. The Promise resolve the string `Hello World!`.

The function has two parameters:

- `filePath` is an absolute path to a file. Let's say you specified that this handler should run for every HTML file. When your browser requests a `index.html`, the handler runs and the browser receives the output.
- `opts` is an object that contains options from the route. [Routes](Routes.md) tell Rosid which handler should run for which file. The `opts` property in a route is a save place to store route-specific properties, settings or data. All data is accessible inside the corresponding handler. [More about opts &#187;](Routes.md#opts)

The function can do what you want it to do. Here're just a few examples of what's possible:

- Load `filePath` and transform it with [Babel](https://babeljs.io), [Sass](http://sass-lang.com) or [Less.js](http://lesscss.org)
- Append something to the content of `filePath`
- Generate a UI (like [rosid-handler-components](https://github.com/comwrap/rosid-handler-components))

## 2. Test

Your handler is now ready to use. It's not very useful as it always returns `Hello World!`, but it's enough to get started.

[Link your handler](https://docs.npmjs.com/cli/link) to test it locally: Run `npm link` inside the handler directory and `npm link rosid-handler-helloworld` inside a project that uses Rosid. Your project now contains a symlink to your handler. This is handy for installing your own stuff, so that you can work on it and test it iteratively without having to publish the module on npm.

Rosid still needs to know when to use your handler so you need to add it to the [routes](Routes.md):

```json
[
  {
    "name"    : "Hello World",
    "path"    : "**/*.html",
    "handler" : "rosid-handler-helloworld"
  }
]
```

This route will run the handler for every HTML file in your project. Start Rosid and open a URL ending with `.html`. You should now get `Hello World!` as a response from the server.

## 3. Caching

Rosid caches the output of handlers. Adding, saving or deleting files flushes the cache. You can enhance the experience of your handler by telling Rosid which files should trigger a cache refresh. This isn't necessary, but recommended.

Attach an array to the function in `index.js`, which contains a list of extensions used by the handler. This array would be empty as `rosid-handler-helloworld` doesn't depend on other files. The output would be cached as long as Rosid runs:

```js
module.exports.cache = []
```

Here's another example where only SASS files trigger a cache flush:

```js 
module.exports.cache = [
	'.sass',
	'.scss'
]
```

## 4. Distribution

Handlers should be distributed through npm. The recommended prefix is `rosid-handler-` and the `package.json` of your handler should at least contain the tags `rosid` and `handler`.

Run `npm publish` inside the handler directory to publish it on npm.