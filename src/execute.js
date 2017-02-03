'use strict'

const log = require('./log')

/**
 * Executes a handler.
 * @public
 * @param {Object} route - A single route configuration.
 * @param {String} fileRoute - Relative path to a file (can be fictive).
 * @param {String} filePath - Absolute path to a file (must exist).
 * @param {?Boolean} optimize - Optimize option. Will be passed to handler when route opts don't contain optimize option.
 * @param {Function} next - The callback that handles the response. Receives the following properties: err, data.
 */
module.exports = function(route, fileRoute, filePath, optimize, next) {

	log(`{cyan:Starting handler: {magenta:${ route.name } {grey:${ fileRoute }`)

	const processHandler = (data) => {

		log(`{cyan:Finished handler: {magenta:${ route.name } {grey:${ fileRoute }`)

		if (data==null) {
			return next(new Error(`Handler of route '${ route.name }' returned without data`))
		}

		next(null, data)

	}

	const opts = Object.assign(route.opts, {
		optimize: (route.opts.optimize===undefined ? optimize : route.opts.optimize)
	})

	route
		.handler(filePath, opts)
		.then(processHandler, next)

}