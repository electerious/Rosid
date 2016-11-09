'use strict'

const path       = require('path')
const fse        = require('fs-extra')
const mm         = require('micromatch')
const globEscape = require('glob-escape')
const log        = require('./log')

/**
 * Get a list of files which should not be copied.
 * @param {Array} routes - Array of route configurations.
 * @param {Array} customFiles - Array of user-defined globs.
 * @param {String} srcPath - Path to the source folder.
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

	// Escape glob patterns. srcPath should not glob.
	const saveSrcPath = globEscape(srcPath)

	// Make route paths absolute and ignore them
	const ignoredRoutes = routes.map((route) => path.join(saveSrcPath, route.path))

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
 * @param {String} srcPath - Path to the source folder.
 * @param {String} distPath - Path to the destination folder.
 * @param {Object} opts - Additional optional options.
 * @param {Function} next - The callback that handles the response. Receives the following properties: err.
 */
module.exports = function(routes, srcPath, distPath, opts, next) {

	const ignoredFiles = getIgnoredFiles(routes, opts.ignore, srcPath)

	const fseOpts = {
		filter: (path) => {

			const isIgnored = mm.any(path, ignoredFiles)

			if (opts.verbose===true) {

				if (isIgnored===true)  log(`{cyan:Skipping file: {grey:${ path }`)
				if (isIgnored===false) log(`{cyan:Copying file: {grey:${ path }`)

			}

			// Copy file when it is not part of the ignored files
			// Return true to include, false to exclude
			return isIgnored===false

		}
	}

	fse.copy(srcPath, distPath, fseOpts, next)

}