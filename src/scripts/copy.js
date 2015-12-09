'use strict'

let anymatch = require('anymatch'),
    fse      = require('fs-extra')

/**
 * Copy an entire directory with all its files and folders. Specified files will be ignored.
 * @public
 * @param {array} routes - Array of route configurations.
 * @param {string} srcPath - Path to the source folder.
 * @param {string} distPath - Path to the destination folder.
 * @param {function} next - The callback that handles the response. Receives the following properties: err.
 */
module.exports = function(routes, srcPath, distPath, next) {

	// @todo Ignore default and route files

	let matcher = anymatch([])

	let opts = {
		filter: (path) => !matcher(path)
	}

	fse.copy(srcPath, distPath, opts, next)

}