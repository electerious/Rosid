'use strict'

const path  = require('path')
const mm    = require('micromatch')
const mime  = require('mime')
const log   = require('./log')
const cache = require('./cache')

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
		const url = req.url.substr(1).split('?')[0]

		// Generate an array of matching routes
		const matches = routes.filter((route) => mm.isMatch(url, route.path))

		// Continue without a rewrite when no matching route has been found
		if (matches.length===0) return next()

		// Rewrite request using the first matching route only
		const route = matches[0]

		// Absolute path to the requested file
		const filePath = path.join(srcPath, url)

		// Use cached handler response when available
		if (cache.get(filePath)!=null) {

			log(`{cyan:Using cached handler: {magenta:${ route.name } {grey:${ url }`)

			const cachedHandler = cache.get(filePath)

			return send(res, cachedHandler.contentType, cachedHandler.data)

		}

		log(`{cyan:Starting handler: {magenta:${ route.name } {grey:${ url }`)

		const processHandler = ({ data, savePath }) => {

			log(`{cyan:Finished handler: {magenta:${ route.name } {grey:${ url }`)

			const contentType = mime.lookup(savePath || filePath)

			if (data==null) {
				return next(new Error(`Handler of route '${ route.name }' returned without data`))
			}

			if (res.finished===true) {
				return next(new Error(`Data of route '${ route.name }' has already been sent to the client`))
			}

			// Cache the response of the handler
			cache.set(filePath, {
				contentType : contentType,
				data        : data,
				cache       : route.handler.cache
			})

			send(res, contentType, data)

		}

		route
			.handler(filePath, srcPath, null, route)
			.then(processHandler, next)

	}

}