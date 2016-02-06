'use strict'

/**
 * Redirect to the main page when no file specified in the URL.
 * @public
 * @param {string} srcPath - Path to the source folder.
 */
module.exports = function(srcPath) {

	return (req, res, next) => {

		// Remove first character to convert URL to a relative path
		let url = req.url.substr(1)

		// Only redirect when no file specified
		if (url!=='') {
			next()
			return false
		}

		res.statusCode = 302
		res.setHeader('Location', 'index.html')
		res.setHeader('Content-Length', '0')
		res.end()

		return true

	}

}