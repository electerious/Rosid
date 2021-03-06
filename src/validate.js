'use strict'

const path = require('path')

/**
 * Parse and validate a route.
 * @public
 * @param {Object} route - A single route configuration.
 * @returns {Object} route - A single validated route configuration.
 * @throws {Error}
 */
const _route = function(route) {

	// Copy object to prevent changes by reverence
	route = Object.assign({}, route)

	// Check if route has a name
	// The name is required to output informative messages and errors
	if (route.name == null || route.name === '') throw new Error('Missing name property in route')

	// Check if route has a path and a handler
	if (route.path == null) throw new Error(`Missing path property in route '${ route.name }'`)
	if (route.handler == null) throw new Error(`Missing handler property in route '${ route.name }'`)

	// Check if path is relative
	if (path.isAbsolute(route.path) === true) throw new Error(`Path in route '${ route.name }' must be relative`)

	// Check if handler is a string or function
	if (typeof route.handler === 'string') route.handler = require(route.handler)
	if (typeof route.handler !== 'function') throw new Error(`Handler in route '${ route.name }' is not a function nor a string`)

	// Provide fallbacks
	if (route.opts == null) route.opts = {}

	return route

}

/**
 * Parse and validate a path.
 * @public
 * @param {String} filePath - Path to a folder or file.
 * @returns {String} filePath - Validated and absolute path to a folder or file.
 */
const _path = function(filePath) {

	// Make filePath absolute
	filePath = path.resolve(filePath)

	return filePath

}

/**
 * Parse and validate options.
 * @public
 * @param {?Object} opts - Additional optional options.
 * @returns {Object} opts - Validated additional optional options.
 */
const _opts = function(opts = {}) {

	// Set default value when an option is missing or has an incorrect type
	return {
		ignore: (Array.isArray(opts.ignore) === true ? opts.ignore : []),
		static: (Array.isArray(opts.static) === true ? opts.static : []),
		verbose: opts.verbose === true,
		open: typeof opts.open === 'string' || opts.open === true,
		path: (typeof opts.open === 'string' ? opts.open : null)
	}

}

/**
 * Parse and validate callbacks.
 * @public
 * @param {?Function} next - A callback that handles a response.
 * @returns {Function} next - A validated callback that handles a response and throws errors.
 */
const _next = function(next) {

	// Ensure that next is a function
	if (typeof next !== 'function') next = (err) => {

		if (err != null) throw err

	}

	return next

}

/**
 * @public
 */
module.exports = {
	route: _route,
	path: _path,
	opts: _opts,
	next: _next
}