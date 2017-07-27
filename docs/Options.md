## Options

If you want more control over the `serve` or `compile` function, pass an object with the following parameters to them:

```js
{
	/*
	 * Don't copy this files when Rosid is compiling your site.
	 * [] = Ignore the following files when copying.
	 *      Must be an array of strings, which will be matched against absolute paths.
	 */
	ignore: [],
	/*
	 * Disable browser reload for this files when Rosid is serving your site.
	 * [] = Never reload this files when content changes.
	 *      Must be an array of strings, which will be matched against a URL.
	 */
	static: [],
	/*
	 * Increase verbosity.
	 * true  = Log additional messages
	 * false = Only log important messages
	 */
	verbose: false,
	/*
	 * Decide if Rosid should automatically open your default browser.
	 * true  = Open '/index.html'
	 * false = Don't open URL
	 * ''    = Open custom URL
	 */
	open: false
}
```

Not all options are available in the [CLI of Rosid](CLI.md).