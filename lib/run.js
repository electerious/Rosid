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

		routes.forEach((route, index) => {

			// Absolute path to the requested file
			let filePath = file.path

			// Set file path relative to the src path as route paths are relative, too
			let fileRoute = path.relative(srcPath, filePath)

			// Only add handler to fn queue when fileRoute and route path matches
			if (anymatch(route.path, fileRoute)===false) return false

			let fn = (next) => {

				route.handler(filePath, srcPath, distPath, route, (err, data, savePath) => {

					if (err!=null) {
						next(err)
						return false
					}

					if (data==null) {
						next(new Error(`Handler of route '${ route.name }' returned without data`))
						return false
					}

					if (savePath==null || savePath==='') {
						next(new Error(`File of route '${ route.name }' could not be saved as no path has been specified by the handler`))
						return false
					}

					fse.outputFile(savePath, data, next)

				})

			}

			handlers.push(fn)

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