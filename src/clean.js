'use strict'

const fse = require('fs-extra')

/**
 * Delete an entire directory with all its files and folders.
 * @public
 * @param {String} distPath - Path to the destination folder.
 * @param {Function} next - The callback that handles the response. Receives the following properties: err.
 */
module.exports = function(distPath, next) {

	// @todo Check if path is where app currently runs
	// @todo What happens when dist does not exist?

	fse.remove(distPath, next)

}