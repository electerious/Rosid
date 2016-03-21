'use strict'

let path     = require('path')
let anymatch = require('anymatch')
let mime     = require('mime')
let log      = require('./log')
let cache    = require('./cache')

/**
 * Sends a chunk of the response body and signals the server
 * that all of the response headers and body have been sent.
 * @param {Object} res - Object which was created internally by a HTTP server.
 * @param {string} contentType - MIME-Type of the data.
 * @param {string|Buffer} data
 */
const send = function(res, contentType, data) {

	res.setHeader('Content-Type', contentType)
	res.end(data)

}

/**
 * Match and rewrite a request.
 * @public
 * @param {Array} routes - Array of route configurations.
 * @param {string} srcPath - Path to the source folder.
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

			// Use cached handler response when available
			if (cache.get(filePath)!=null) {

				log(`{cyan:Using cached handler: {magenta:${ route.name } {grey:${ url }`)

				let cachedHandler = cache.get(filePath)

				send(res, cachedHandler.contentType, cachedHandler.data)
				return true

			}

			log(`{cyan:Starting handler: {magenta:${ route.name } {grey:${ url }`)

			route.handler(filePath, srcPath, null, route, (err, data, savePath) => {

				let contentType = mime.lookup(savePath || filePath)

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

				// Cache the response of the handler
				cache.set(filePath, {
					contentType,
					data
				})

				log(`{cyan:Finished handler: {magenta:${ route.name } {grey:${ url }`)

				send(res, contentType, data)
				return true

			})

		}

		routes.forEach(match)

		if (found===false) next()

	}

}