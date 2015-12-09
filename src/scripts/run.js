'use strict'

let async = require('async'),
    fse   = require('fs-extra')

/**
 * Run multiple function in series. Each one running once the previous function has been completed.
 * @public
 * @param {array} routes - Array of route configurations.
 * @param {string} srcPath - Path to the source folder.
 * @param {string} distPath - Path to the destination folder.
 * @param {function} next - The callback that handles the response. Receives the following properties: err.
 */
module.exports = function(routes, srcPath, distPath, next) {

	let fns = []

	let items = []

	fse.walk(srcPath)
		.on('data', () => items.push(item.path))
		.on('end', () => {
			console.log(items)
			next(null)
		})

	// @todo run each handler for each matching file and pass paths object to the handler
	// async.parallel(fns, next)

}