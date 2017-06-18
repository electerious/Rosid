'use strict'

const path        = require('path')
const niceTry     = require('nice-try')
const junk        = require('junk')
const browserSync = niceTry(() => require('browser-sync'))
const cache       = require('./cache')

/**
 * Get a list of files to watch.
 * @returns {Array} files
 */
const getFiles = function() {

	// Exclude the following files
	const excludedFiles = [
		'!**/CVS',
		'!**/.git',
		'!**/.svn',
		'!**/.hg',
		'!**/.lock-wscript',
		'!**/.wafpickle-N',
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
 * @param {Object} bs - Browsersync instance.
 * @param {String} event - Event sent by Chokidar.
 * @param {String} filePath - File affected by event.
 */
const eventHandler = function(bs, event, filePath) {

	const fileName = path.parse(filePath).base

	// Ignore change when filePath is junk
	if (junk.is(fileName)===true) return

	// Get the extension of the filePath
	const extension = path.extname(filePath)

	// Flush the cache no matter what event was send by Chokidar.
	// This ensures that we serve the latest files when the user reloads the site.
	cache.flush(extension)

	// Chokidar always sends an 'event' property - which could be 'add',
	// 'unlink' etc so we need to check for that and only respond to 'change'.
	if (event==='change') {

		const styleExtensions = [
			'.css',
			'.scss',
			'.sass',
			'.less'
		]

		// Reload stylesheets only when the extension is a known style extension
		if (styleExtensions.includes(extension)===true) return bs.reload('*.css')

		return bs.reload()

	}

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

	if (browserSync==null) {
		return next(new Error('Rosid has been installed without optionalDependencies. Make sure that all optionalDependencies are installed before serving a site.'))
	}

	const bs = browserSync.create()

	const server = {
		baseDir    : srcPath,
		middleware : [
			rewrite,
			redirect
		]
	}

	const files = {
		match   : getFiles(),
		fn      : eventHandler.bind(null, bs),
		options : {
			usePolling: opts.polling
		}
	}

	const defaults = {
		logPrefix : 'Rosid',
		server    : server,
		files     : [ files ],
		notify    : false,
		ghostMode : false,
		open      : opts.open,
		startPath : opts.path
	}

	bs.init(defaults, next)

}