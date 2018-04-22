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

	const processResolve = (data) => {

		log(`{cyan:Finished handler: {magenta:${ route.name } {grey:${ fileRoute }`)

		next(null, data)

	}

	const processReject = (err) => {

		log(`{red:Handler failed: {magenta:${ route.name } {grey:${ fileRoute }`)

		return next(err)

	}

	const opts = Object.assign({}, route.opts, {
		optimize: (route.opts.optimize === undefined ? optimize : route.opts.optimize)
	})

	route
		.handler(filePath, opts)
		.then(processResolve, processReject)

}