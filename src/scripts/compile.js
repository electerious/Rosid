'use strict'

let async    = require('async'),
    validate = require('./validate'),
    copy     = require('./copy'),
    run      = require('./run')

/**
 * Compile a specified source folder.
 * @public
 * @param {array} routes - Array of route configurations.
 * @param {string} srcPath - Path to the source folder.
 * @param {string} distPath - Path to the destination folder.
 * @param {objects} opts - Additional optional options.
 * @param {function} next - The callback that handles the response. Receives the following properties: err.
 */
module.exports = function(routes, srcPath, distPath, opts, next) {

	// Make opts optional and use opts as next when next is undefined
	// Next will be validated at a later juncture
	if (next==null) next = opts

	routes   = routes.map(validate.route)
	srcPath  = validate.path(srcPath)
	distPath = validate.path(distPath)
	opts     = validate.options(opts)
	next     = validate.next(next)

	async.series([

		(next) => copy(routes, srcPath, distPath, next),
		(next) => run(routes, srcPath, distPath, next)

	], next)

}