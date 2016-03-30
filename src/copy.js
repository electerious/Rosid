'use strict'

let path     = require('path')
let anymatch = require('anymatch')
let fse      = require('fs-extra')

/**
 * Get a list of files to copy.
 * @param {Array} routes - Array of route configurations.
 * @param {Array} customFiles - Array of user-defined globs.
 * @param {string} srcPath - Path to the source folder.
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
 * @param {Object} opts - Additional optional options.
 * @param {function} next - The callback that handles the response. Receives the following properties: err.
 */
module.exports = function(routes, srcPath, distPath, opts, next) {

	if (opts.copy===false) {
		next(null)
		return false
	}

	let files   = getFiles(routes, opts.copy, srcPath)
	let matcher = anymatch(files)

	let fseOpts = {
		filter: (path) => matcher(path)
	}

	fse.copy(srcPath, distPath, fseOpts, next)

}