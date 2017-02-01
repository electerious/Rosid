'use strict'

const path    = require('path')
const mm      = require('micromatch')
const mime    = require('mime')
const rename  = require('rename-extension')
const log     = require('./log')
const cache   = require('./cache')
const execute = require('./execute')

/**
 * Sends a chunk of the response body and signals the server
 * that all of the response headers and body have been sent.
 * @param {Object} res - Object which was created internally by a HTTP server.
 * @param {String} contentType - MIME-Type of the data.
 * @param {String|Buffer} data
 */
const send = function(res, contentType, data) {

	res.setHeader('Content-Type', contentType)
	res.end(data)

}

/**
 * Match and rewrite a request.
 * @public
 * @param {Array} routes - Array of route configurations.
 * @param {String} srcPath - Path to the source folder.
 */
module.exports = function(routes, srcPath) {

	return (req, res, next) => {

		// Remove first character and query to convert URL to a relative path
		const fileRoute = req.url.substr(1).split('?')[0]

		// Absolute path to the requested file
		const filePath = path.join(srcPath, fileRoute)

		// Generate an array of matching routes and use the first matching route only
		const matches = routes.filter((route) => mm.isMatch(fileRoute, route.path))
		const route   = matches[0]

		// Continue without a rewrite when no matching route has been found
		if (route==null) return next()

		// Use cached handler response when available
		if (cache.get(fileRoute)!=null) {

			log(`{cyan:Using cached handler: {magenta:${ route.name } {grey:${ fileRoute }`)

			const cachedHandler = cache.get(fileRoute)

			// Send file to browser
			return send(res, cachedHandler.contentType, cachedHandler.data)

		}

		// Get mime type of request files
		const contentType = mime.lookup(filePath)

		// Load file with a different extension as filePath points to the target extension
		const fileLoad = rename(filePath, route.in(route.opts))

		// Execute handler
		execute(route, fileRoute, fileLoad, (err, data) => {

			if (err!=null) return next(err)

			// Send file to browser
			send(res, contentType, data)

			// Cache the response of the handler
			cache.set(fileRoute, {
				contentType : contentType,
				data        : data,
				cache       : route.handler.cache
			})

		})

	}

}