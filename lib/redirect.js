'use strict'

/**
 * Redirect to the main page when no file specified in the URL.
 * @public
 * @param {string} srcPath - Path to the source folder.
 */
module.exports = function(srcPath) {

	return (req, res, next) => {

		// Get the last char of the requested URL
		let lastChar = req.url.substr(-1)

		// Only redirect when no file specified
		if (lastChar==='/') {
			next()
			return false
		}

		res.statusCode = 302
		res.setHeader('Location', `${ req.url } + index.html`)
		res.setHeader('Content-Length', '0')
		res.end()

		return true

	}

}