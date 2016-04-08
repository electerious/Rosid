'use strict'

/**
 * Serve a specified source folder.
 * @public
 * @param {Array} routes - Array of route configurations.
 * @param {string} srcPath - Path to the source folder.
 * @param {Object} opts - Additional optional options.
 * @param {function} next - The callback that handles the response. Receives the following properties: err.
 */
module.exports = function(routes, srcPath, opts, next) {

	// Require modules on function call to speed up the initial launch
	let async    = require('async')
	let validate = require('./validate')
	let rewrite  = require('./rewrite')
	let redirect = require('./redirect')
	let deliver  = require('./deliver')

	// Make opts optional and use opts as next when next is undefined
	// Next will be validated at a later juncture
	if (next==null) next = opts

	try {

		routes  = routes.map(validate.route)
		srcPath = validate.path(srcPath)
		opts    = validate.opts(opts)
		next    = validate.next(next)

	} catch (err) {

		if (next==null) throw err
		else next(err)

		return false

	}

	let _rewrite  = rewrite(routes, srcPath)
	let _redirect = redirect(srcPath)

	async.series([

		(next) => deliver(srcPath, _rewrite, _redirect, opts, next)

	], next)

}