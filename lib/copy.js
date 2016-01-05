'use strict'

let path     = require('path'),
    anymatch = require('anymatch'),
    fse      = require('fs-extra')

/**
 * Get a list of files to copy.
 * @param {Array} routes - Array of route configurations.
 * @param {string} srcPath - Path to the source folder.
 * @param {Array} customFiles - Array of user-defined globs.
 * @returns {Array} ignoredFiles
 */
const getFiles = function(routes, customFiles, srcPath) {

	// Exclude the following files
	let excludedFiles = [
		'!**/.git',
		'!**/CVS',
		'!**/.svn',
		'!**/.hg',
		'!**/.lock-wscript',
		'!**/.wafpickle-N',
		'!**/*.swp',
		'!**/.DS_Store',
		'!**/._*',
		'!**/npm-debug.log'
	]

	// Make route paths absolute and exclude them
	let excludedRoutes = routes.map((route) => '!' + path.join(srcPath, route.path))

	// Include the following files
	let includedFiles = [
		'**/*'
	]

	// Return all ignored files
	return [
		...excludedFiles,
		...excludedRoutes,
		...includedFiles,
		...customFiles
	]

}

/**
 * Copy an entire directory with all its files and folders. Specified files will be ignored.
 * @public
 * @param {Array} routes - Array of route configurations.
 * @param {string} srcPath - Path to the source folder.
 * @param {string} distPath - Path to the destination folder.
 * @param {Object} copyOpts - Additional optional options for the copy-task.
 * @param {function} next - The callback that handles the response. Receives the following properties: err.
 */
module.exports = function(routes, srcPath, distPath, copyOpts, next) {

	if (copyOpts.skip===true) {
		next(null)
		return false
	}

	let files   = getFiles(routes, copyOpts.files, srcPath),
	    matcher = anymatch(files)

	let fseOpts = {
		filter: (path) => matcher(path)
	}

	fse.copy(srcPath, distPath, fseOpts, next)

}