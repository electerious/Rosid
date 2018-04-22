'use strict'

const path = require('path')
const fse = require('fs-extra')
const junk = require('junk')
const mm = require('micromatch')
const log = require('./log')

/**
 * Get a list of files which should not be copied.
 * @param {Array} routes - Array of route configurations.
 * @param {Array} customFiles - Array of user-defined globs.
 * @returns {Array} ignoredFiles
 */
const getIgnoredFiles = function(routes, customFiles) {

	// Always ignore the following files
	const ignoredFiles = [
		'**/CVS',
		'**/.git',
		'**/.svn',
		'**/.hg',
		'**/.lock-wscript',
		'**/.wafpickle-N'
	]

	// Extract the path out of the routes
	const ignoredRoutes = routes.map((route) => route.path)

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

	const ignoredFiles = getIgnoredFiles(routes, opts.ignore)

	const filter = (filePath) => {

		// The filePath is absolute, but should be relative as micromatch will
		// match against the relative path of the routes. Matching against
		// an absolute path requires the use of path.join which causes issues on Windows:
		// https://github.com/micromatch/micromatch/issues/95
		filePath = path.relative(srcPath, filePath)

		const fileName = path.parse(filePath).base

		const isIgnored = mm.any(filePath, ignoredFiles)
		const isJunk = junk.is(fileName)

		// Copy file when it's not ignored or not junk
		const copy = isIgnored === false && isJunk === false

		if (opts.verbose === true) {

			if (copy === false) log(`{cyan:Skipping file: {grey:${ filePath }`)
			if (copy === true) log(`{cyan:Copying file: {grey:${ filePath }`)

		}

		// Return true to include, false to exclude
		return copy

	}

	fse.copy(srcPath, distPath, { filter }, next)

}