'use strict'

let path   = require('path'),
    async  = require('async'),
    extend = require('extend')

/**
 * Parse and validate a route.
 * @public
 * @param {object} route - A single route configuration.
 * @returns {object} route - A single validated route configuration.
 */
const _route = function(route /*= {}*/) {

	// Copy object to prevent changes by reverence
	route = Object.assign({}, route)

	// Check if route has a name
	// The name is required to output informative messages and errors
	if (route.name==null || route.name==='') throw new Error('Missing name property in route')

	// Check if route has a path and a handler
	if (route.path==null)    throw new Error(`Missing path property in route '${ route.name }'`)
	if (route.handler==null) throw new Error(`Missing handler property in route '${ route.name }'`)

	// Check the property values
	if (path.isAbsolute(route.path)===true)  throw new Error(`Path in route '${ route.name }' must be relative`)
	if (typeof route.handler !== 'function') throw new Error(`Handler in route '${ route.name }' is not a function`)

	// Provide a fallback for the args and opts property
	if (route.args==null) route.args = {}
	if (route.opts==null) route.opts = {}

	return route

}

/**
 * Parse and validate a path.
 * @public
 * @param {string} path - Path to a folder or file.
 * @returns {array} path - Validated and absolute path to a folder or file.
 */
const _path = function(filePath /*= ''*/) {

	// Make filePath absolute
	filePath = path.resolve(filePath)

	return filePath

}

/**
 * Parse and validate options.
 * @public
 * @param {object} opts - Additional optional options.
 * @returns {object} opts - Validated additional optional options.
 */
const _opts = function(opts /*= {}*/) {

	// Copy-module options
	let copy = {
		skip  : false,
		files : []
	}

	// All default options
	let defaults = {
		copy
	}

	// Copy object to prevent changes by reverence
	opts = Object.assign({}, opts)

	// Merge custom opts with defaults
	opts = extend(true, defaults, opts)

	return opts

}

/**
 * Parse and validate callbacks.
 * @public
 * @param {function} Next - A callback that handles a response.
 * @returns {function} Next - A validated callback that handles a response.
 */
const _next = function(next) {

	// Ensure that next is a function
	if (typeof next !== 'function') next = () => {}

	return next

}

/**
 * @public
 */
module.exports = {
	route : _route,
	path  : _path,
	opts  : _opts,
	next  : _next
}