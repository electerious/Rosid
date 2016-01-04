'use strict'

let path     = require('path'),
    anymatch = require('anymatch')

/**
 * Match a rewrite a request.
 * @public
 * @param {array} routes - Array of route configurations.
 * @param {string} srcPath - Path to the source folder.
 * @param {function} next - The callback that handles the response. Receives the following properties: err.
 */
module.exports = function(routes, srcPath) {

	return (req, res, next) => {

		let found = false

		// Remove first character to convert URL to a relative path
		let url = req.url.substr(1)

		const send = (err, data, savePath) => {

			if (err!=null) {
				next(err)
				return false
			}

			if (data==null) {
				next(new Error('Handler of route returned without data'))
				return false
			}

			if (res.finished===true) {
				next(new Error('Data has already been sent to the client'))
				return false
			}

			res.end(data)
			return true

		}

		const match = (route) => {

			// Only rewrite request when URL matches a route
			if (anymatch(route.path, url)!==true) return false

			// Absolute path to the requested file
			let filePath = path.join(srcPath, url)

			found = true

			route.handler(filePath, srcPath, null, route, send)

		}

		routes.forEach(match)

		if (found===false) next()

	}

}