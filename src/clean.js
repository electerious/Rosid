'use strict'

const fse          = require('fs-extra')
const pathIsInside = require('path-is-inside')
const log          = require('./log')

/**
 * Delete an entire directory with all its files and folders.
 * Will skip the deletion without an error when folder does not exist.
 * @public
 * @param {String} distPath - Path to the destination folder.
 * @param {Object} opts - Additional optional options.
 * @param {Function} next - The callback that handles the response. Receives the following properties: err.
 */
module.exports = function(distPath, opts, next) {

	// Check if CWD is inside the specified distPath. This prevents us from
	// deleting ourselves. pathIsInside also returns true when both paths are the same.
	const isUnsafePath = pathIsInside(process.cwd(), distPath)

	if (isUnsafePath===true) {
		return next(new Error('Current working directory can not be inside the specified distPath'))
	}

	if (opts.verbose===true) log(`{cyan:Deleting folder: {grey:${ distPath }`)

	fse.remove(distPath, (err) => {

		if (err!=null) return next(err)

		if (opts.verbose===true) log(`{cyan:Deleted folder: {grey:${ distPath }`)

		next()

	})

}