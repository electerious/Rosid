'use strict'

const url = require('url')

/**
 * Redirect to the main page when no file specified in the URL.
 * @public
 */
module.exports = function() {

	return (req, res, next) => {

		// Parse the URL
		const _url = url.parse(req.url)

		// Get the last char of the requested URL pathname
		const lastChar = _url.pathname.substr(-1)

		// Only continue when requested URL is a folder
		if (lastChar!=='/') return next()

		res.statusCode = 302
		res.setHeader('Location', `${ _url.pathname }index.html`)
		res.setHeader('Content-Length', '0')
		res.end()

	}

}