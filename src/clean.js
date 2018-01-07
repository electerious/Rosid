'use strict'

const fse = require('fs-extra')
const isPathInside = require('is-path-inside')
const log = require('./log')

/**
 * Delete an entire directory with all its files and folders.
 * Will skip the deletion without an error when folder does not exist.
 * @public
 * @param {String} distPath - Path to the destination folder.
 * @param {String} cwdPath - Current working directory.
 * @param {Object} opts - Additional optional options.
 * @param {Function} next - The callback that handles the response. Receives the following properties: err.
 * @returns {?*}
 */
module.exports = function(distPath, cwdPath, opts, next) {

	// Check if distPath is inside cwdPath. This prevents us from deleting ourselves.
	// isPathInside returns false when both paths are the same.
	const isSafePath = isPathInside(distPath, cwdPath)

	if (isSafePath===false) {
		return next(new Error(`Specified distPath must be inside the current working directory to prevent us from deleting ourself`))
	}

	if (opts.verbose===true) log(`{cyan:Deleting folder: {grey:${ distPath }`)

	fse.remove(distPath, (err) => {

		if (err!=null) return next(err)

		if (opts.verbose===true) log(`{cyan:Deleted folder: {grey:${ distPath }`)

		next()

	})

}