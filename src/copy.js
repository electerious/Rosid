'use strict'

const path = require('path')
const fse  = require('fs-extra')
const mm   = require('micromatch')

/**
 * Get a list of files which should not be copied.
 * @param {Array} routes - Array of route configurations.
 * @param {Array} customFiles - Array of user-defined globs.
 * @param {string} srcPath - Path to the source folder.
 * @returns {Array} ignoredFiles
 */
const getIgnoredFiles = function(routes, customFiles, srcPath) {

	// Always ignore the following files
	const ignoredFiles = [
		'**/.git',
		'**/CVS',
		'**/.svn',
		'**/.hg',
		'**/.lock-wscript',
		'**/.wafpickle-N',
		'**/*.swp',
		'**/.DS_Store',
		'**/._*',
		'**/npm-debug.log'
	]

	// Make route paths absolute and ignore them
	const ignoredRoutes = routes.map((route) => path.join(srcPath, route.path))

	// Return all ignored files
	return [
		...ignoredFiles,
		...ignoredRoutes,
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

	const ignoredFiles = getIgnoredFiles(routes, opts.copy, srcPath)

	const fseOpts = {
		// Copy file when it is not part of the ignored files
		filter: (path) => mm.any(path, ignoredFiles)===false
	}

	fse.copy(srcPath, distPath, fseOpts, next)

}