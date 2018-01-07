'use strict'

const path = require('path')
const mm = require('micromatch')
const mime = require('mime')
const rename = require('rename-extension')
const log = require('./log')
const cache = require('./cache')
const execute = require('./execute')
const send = require('./send')

/**
 * Match and rewrite a request.
 * @public
 * @param {Array} routes - Array of route configurations.
 * @param {String} srcPath - Path to the source folder.
 * @returns {Function} Middleware for Browsersync.
 */
module.exports = function(routes, srcPath) {

	return (req, res, next) => {

		// Remove first character and query to convert URL to a relative path
		const fileRoute = req.url.substr(1).split('?')[0]

		// Generate an array of matching routes and use the first matching route only
		const matches = routes.filter((route) => mm.isMatch(fileRoute, route.path))
		const route = matches[0]

		// Continue without a rewrite when no matching route has been found
		if (route==null) return next()

		// The cache might already contain the compiled file
		const fileCache = cache.get(fileRoute)

		// Use cached handler response when available
		if (fileCache!=null) {

			log(`{cyan:Using cached handler: {magenta:${ route.name } {grey:${ fileRoute }`)

			return send(res, fileCache.contentType, fileCache.data)

		}

		// Absolute path to the requested file
		const filePath = path.join(srcPath, fileRoute)

		// Load file with a different extension as filePath points to the target extension
		const fileLoad = (() => {

			const hasFn = (typeof route.handler.in==='function')

			return (hasFn===true ? rename(filePath, route.handler.in(route.opts)) : filePath)

		})()

		// Get mime type of request files
		const contentType = mime.getType(filePath)

		// Execute handler
		execute(route, fileRoute, fileLoad, false, (err, data) => {

			if (err!=null) return next(err)

			send(res, contentType, data)

			// Cache the response of the handler
			cache.set(fileRoute, {
				contentType: contentType,
				data: data,
				cache: route.handler.cache
			})

		})

	}

}