'use strict'

let path     = require('path'),
    anymatch = require('anymatch'),
    log      = require('./log')

/**
 * Match a rewrite a request.
 * @public
 * @param {Array} routes - Array of route configurations.
 * @param {string} srcPath - Path to the source folder.
 * @param {function} next - The callback that handles the response. Receives the following properties: err.
 */
module.exports = function(routes, srcPath) {

	return (req, res, next) => {

		let found = false

		// Remove first character to convert URL to a relative path
		let url = req.url.substr(1)

		const match = (route) => {

			// Do not run another handler when a handler has already been found
			if (found===true) return false

			// Only rewrite request when URL matches a route
			if (anymatch(route.path, url)!==true) return false

			// Absolute path to the requested file
			let filePath = path.join(srcPath, url)

			// Indicate that a handler has been found
			found = true

			log(`{cyan:Starting handler: {magenta:${ route.name } {grey:${ url }`)

			route.handler(filePath, srcPath, null, route, (err, data, savePath) => {

				if (err!=null) {
					next(err)
					return false
				}

				if (data==null) {
					next(new Error(`Handler of route '${ route.name }' returned without data`))
					return false
				}

				if (res.finished===true) {
					next(new Error(`Data of route '${ route.name }' has already been sent to the client`))
					return false
				}

				log(`{cyan:Finished handler: {magenta:${ route.name } {grey:${ url }`)

				res.end(data)
				return true

			})

		}

		routes.forEach(match)

		if (found===false) next()

	}

}