'use strict'

let path = require('path'),
    bs   = require('browser-sync').create()

/**
 * Get a list of files to watch.
 * @returns {array} files
 */
const getFiles = function() {

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
		'!**/npm-debug.log',
		'!**/node_modules',
		'!**/bower_components'
	]

	// Include the following files
	let includedFiles = [
		'**/*'
	]

	// Return all ignored files
	return [
		...excludedFiles,
		...includedFiles
	]

}

/**
 * Serve a directory and reload the page when files change.
 * @public
 * @param {string} srcPath - Path to the source folder.
 * @param {function} rewrite - URL rewriting middleware.
 * @param {function} next - The callback that handles the response. Receives the following properties: err.
 */
module.exports = function(srcPath, rewrite, next) {

	let server = {
		baseDir    : srcPath,
		middleware : rewrite
	}

	let defaults = {
		logPrefix : 'Invo',
		files     : getFiles(),
		notify    : false,
		ghostMode : false,
		server    : server,
		startPath : 'index.html'
	}

	bs.init(defaults)

	next()

}