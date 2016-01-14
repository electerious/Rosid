'use strict'

let async    = require('async')
let validate = require('./validate')
let rewrite  = require('./rewrite')
let deliver  = require('./deliver')

/**
 * Serve a specified source folder.
 * @public
 * @param {Array} routes - Array of route configurations.
 * @param {string} srcPath - Path to the source folder.
 * @param {Object} opts - Additional optional options.
 * @param {function} next - The callback that handles the response. Receives the following properties: err.
 */
module.exports = function(routes, srcPath /*= 'src/'*/, opts, next) {

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
		else            next(err)

		return false

	}

	async.series([

		(next) => deliver(srcPath, rewrite(routes, srcPath), next)

	], next)

}