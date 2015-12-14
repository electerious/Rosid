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

		const send = (err, data) => {

			if (res.finished===true) return false
			else                     res.end(data)

		}

		const match = (item) => {

			// Only rewrite request when url matches a route
			if (anymatch(item.path, req.url)!==true) return false

			found = true

			let paths = {
				route : item.path,
				src   : srcPath,
				dist  : '',
				file  : path.join(srcPath, req.url)
			}

			item.handler(paths, send)

		}

		routes.forEach(match)

		if (found===false) next()

	}

}