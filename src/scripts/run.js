'use strict'

let path     = require('path'),
    async    = require('async'),
    anymatch = require('anymatch'),
    fse      = require('fs-extra')

/**
 * Run multiple function in series. Each one running once the previous function has been completed.
 * @public
 * @param {array} routes - Array of route configurations.
 * @param {string} srcPath - Path to the source folder.
 * @param {string} distPath - Path to the destination folder.
 * @param {function} next - The callback that handles the response. Receives the following properties: err.
 */
module.exports = function(routes, srcPath, distPath, next) {

	let handlers = []

	const addFile = (file) => {

		routes.forEach((route) => {

			// Convert file path to route path
			let fileRoute = '/' + path.relative(srcPath, file.path)

			// Only add handler to fn queue when fileRoute and route path matches
			if (anymatch(route.path, fileRoute)===false) return false

			// Skip file when handler should only run once and has already been added
			if (route.opts.once===true && route._executed===true) return false

			// Create paths object with all necessary information
			let paths = {
				route : route.path,
				src   : srcPath,
				dist  : distPath,
				file  : file.path
			}

			let fn = (next) => route.handler(paths, next)

			handlers.push(fn)
			route._executed = true

		})

	}

	const executeHandlers = () => {

		// Run each file handler and continue with next
		async.parallel(handlers, next)

	}

	fse.walk(srcPath)
	   .on('data', addFile)
	   .on('end', executeHandlers)

}