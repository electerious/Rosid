'use strict'

const log = require('./log')

/**
 * Executes a handler.
 * @public
 * @param {Object} route - A single route configuration.
 * @param {String} fileRoute - Relative path to a file (can be fictive).
 * @param {String} filePath - Absolute path to a file (must exist).
 * @param {Function} next - The callback that handles the response. Receives the following properties: err, data.
 */
module.exports = function(route, fileRoute, filePath, next) {

	log(`{cyan:Starting handler: {magenta:${ route.name } {grey:${ fileRoute }`)

	const processHandler = (data) => {

		log(`{cyan:Finished handler: {magenta:${ route.name } {grey:${ fileRoute }`)

		if (data==null) {
			return next(new Error(`Handler of route '${ route.name }' returned without data`))
		}

		next(null, data)

	}

	route
		.handler(filePath, route.opts)
		.then(processHandler, next)

}