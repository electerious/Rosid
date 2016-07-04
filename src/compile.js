'use strict'

/**
 * Compile a specified source folder.
 * @public
 * @param {Array} routes - Array of route configurations.
 * @param {String} srcPath - Path to the source folder.
 * @param {String} distPath - Path to the destination folder.
 * @param {Object} opts - Additional optional options.
 * @param {Function} next - The callback that handles the response. Receives the following properties: err.
 */
module.exports = function(routes, srcPath, distPath, opts, next) {

	// Require modules on function call to speed up the initial launch
	const async    = require('async')
	const validate = require('./validate')
	const clean    = require('./clean')
	const copy     = require('./copy')
	const run      = require('./run')

	// Make opts optional and use opts as next when next is undefined
	// Next will be validated at a later juncture
	if (next==null) next = opts

	try {

		next     = validate.next(next)
		routes   = routes.map(validate.route)
		srcPath  = validate.path(srcPath)
		distPath = validate.path(distPath)
		opts     = validate.opts(opts)

	} catch (err) {

		return next(err)

	}

	// Handlers may use promises which could lead to unhandled rejections
	process.on('unhandledRejection', next)

	async.series([

		(next) => clean(distPath, next),
		(next) => copy(routes, srcPath, distPath, opts, next),
		(next) => run(routes, srcPath, distPath, next)

	], next)

}