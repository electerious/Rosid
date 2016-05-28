'use strict'

const path  = require('path')
const bs    = require('browser-sync').create()
const cache = require('./cache')

/**
 * Get a list of files to watch.
 * @returns {Array} files
 */
const getFiles = function() {

	// Exclude the following files
	const excludedFiles = [
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
	const includedFiles = [
		'**/*'
	]

	// Return all ignored files
	return [
		...excludedFiles,
		...includedFiles
	]

}

/**
 * Flushes the cache and reloads the site.
 * Should be executed when a file gets updated.
 * @param {String} event
 * @param {String} file
 */
const eventHandler = function(event, file) {

	// Get the extension of the file
	const extension = path.extname(file)

	// Flush the cache no matter what event was send by Chokidar.
	// This ensures that we serve the latest files when the user reloads the site.
	cache.flush(extension)

	// Chokidar always sends an 'event' property - which could be 'add',
	// 'unlink' etc so we need to check for that and only respond to 'change'.
	if (event==='change') bs.reload()

}

/**
 * Serve a directory and reload the page when files change.
 * @public
 * @param {String} srcPath - Path to the source folder.
 * @param {Function} rewrite - URL rewrite middleware.
 * @param {Function} redirect - URL redirect middleware.
 * @param {Object} opts - Additional optional options.
 * @param {Function} next - The callback that handles the response. Receives the following properties: err.
 */
module.exports = function(srcPath, rewrite, redirect, opts, next) {

	const server = {
		baseDir    : srcPath,
		middleware : [
			rewrite,
			redirect
		]
	}

	const files = {
		match   : getFiles(),
		fn      : eventHandler,
		options : {
			usePolling: opts.polling
		}
	}

	const defaults = {
		logPrefix : 'Rosid',
		server    : server,
		files     : [ files ],
		notify    : false,
		ghostMode : false
	}

	bs.init(defaults)

	next()

}