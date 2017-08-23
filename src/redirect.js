'use strict'

const url = require('url')

/**
 * Redirect to the main page when no file specified in the URL.
 * @public
 */
module.exports = function() {

	return (req, res, next) => {

		const parsedURL = url.parse(req.url)
		const lastChar = parsedURL.pathname.substr(-1)

		// Only continue when requested URL is a folder
		if (lastChar!=='/') return next()

		res.statusCode = 302
		res.setHeader('Location', `${ parsedURL.pathname }index.html`)
		res.setHeader('Content-Length', '0')
		res.end()

	}

}