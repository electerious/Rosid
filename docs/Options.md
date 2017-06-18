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
	 * true  = Log additional messages
	 * false = Only log important messages
	 */
	verbose: false,
	/*
	 * Option for the deliver-module which will only run when serving your site.
	 * It is typically necessary to set this to true to successfully watch files over a network,
	 * and it may be necessary to successfully watch files in other non-standard situations.
	 * true  = Use fs.watch
	 * false = Use fs.watchFile (backed by polling)
	 */
	polling: false,
	/*
	 * Decide if Rosid should open the URL automatically in your default browser.
	 * true  = Open URL
	 * false = Don't open URL
	 */
	open: false,
	/*
	 * Open the first browser window with a custom URL path.
	 * Should only be used together with the 'open' option.
	 * ''   = URL to open. Should be a string starting with '/'.
	 * null = Open '/index.html'
	 */
	open: null
}
```

Not all options are available in the [CLI of Rosid](CLI.md).