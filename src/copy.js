'use strict'

const path       = require('path')
const fse        = require('fs-extra')
const junk       = require('junk')
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
		'**/CVS',
		'**/.git',
		'**/.svn',
		'**/.hg',
		'**/.lock-wscript',
		'**/.wafpickle-N'
	]

	// Escape glob patterns. srcPath should not glob.
	// const saveSrcPath = globEscape(srcPath)

	// Make route paths absolute and ignore them
	const ignoredRoutes = routes.map((route) => path.resolve(srcPath, route.path))

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
		filter: (filePath) => {

			const fileName = path.parse(filePath).base

			const isIgnored = mm.any(filePath, ignoredFiles)
			const isJunk    = junk.is(fileName)

			// Copy file when it's not ignored or not junk
			const copy = isIgnored===false && isJunk===false

			if (opts.verbose===true) {

				if (copy===false) log(`{cyan:Skipping file: {grey:${ filePath }`)
				if (copy===true)  log(`{cyan:Copying file: {grey:${ filePath }`)

			}

			// Return true to include, false to exclude
			return copy

		}
	}

	fse.copy(srcPath, distPath, fseOpts, next)

}