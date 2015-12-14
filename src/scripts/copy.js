'use strict'

let path     = require('path'),
    anymatch = require('anymatch'),
    fse      = require('fs-extra')

/**
 * Get a list of all ignored files.
 * @param {array} routes - Array of route configurations.
 * @param {string} srcPath - Path to the source folder.
 * @returns {array} ignoredFiles
 */
const getIgnoredFiles = function(routes, srcPath) {

	// Ignore thr following files
	let ignoredFiles = [
		'**/.git',
		'**/CVS',
		'**/.svn',
		'**/.hg',
		'**/.lock-wscript',
		'**/.wafpickle-N',
		'**/*.swp',
		'**/.DS_Store',
		'**/._*',
		'**/npm-debug.log',
		'**/_*'
	]

	// Make route paths absolute and add them to the ignored files
	let ignoredRoutes = routes.map((route) => path.join(srcPath, route.path))

	// Return all ignored files
	return [
		...ignoredFiles,
		...ignoredRoutes
	]

}

/**
 * Copy an entire directory with all its files and folders. Specified files will be ignored.
 * @public
 * @param {array} routes - Array of route configurations.
 * @param {string} srcPath - Path to the source folder.
 * @param {string} distPath - Path to the destination folder.
 * @param {function} next - The callback that handles the response. Receives the following properties: err.
 */
module.exports = function(routes, srcPath, distPath, next) {

	let ignoredFiles = getIgnoredFiles(routes, srcPath),
	    matcher      = anymatch(ignoredFiles)

	let opts = {
		filter: (path) => !matcher(path)
	}

	fse.copy(srcPath, distPath, opts, next)

}