'use strict'

const async = require('async')
const path  = require('path')
const mm    = require('micromatch')
const fse   = require('fs-extra')
const log   = require('./log')

/**
 * Run multiple route functions parallel.
 * @public
 * @param {Array} routes - Array of route configurations.
 * @param {String} srcPath - Path to the source folder.
 * @param {String} distPath - Path to the destination folder.
 * @param {Function} next - The callback that handles the response. Receives the following properties: err.
 */
module.exports = function(routes, srcPath, distPath, next) {

	const handlers = []

	const addFile = (file) => {

		// Absolute path to the requested file
		const filePath = file.path

		// Set file path relative to the src path as route paths are relative, too
		const fileRoute = path.relative(srcPath, filePath)

		// Generate an array of matching routes
		const matches = routes.filter((route) => mm.isMatch(fileRoute, route.path))

		// Only add handler to fn queue when fileRoute and route path matches
		if (matches.length===0) return false

		// Rewrite request using the first matching route only
		const route = matches[0]

		const fn = (next) => {

			log(`{cyan:Starting handler: {magenta:${ route.name } {grey:${ fileRoute }`)

			const processHandler = ({ data, savePath }) => {

				log(`{cyan:Finished handler: {magenta:${ route.name } {grey:${ fileRoute }`)

				if (data==null) {
					return next(new Error(`Handler of route '${ route.name }' returned without data`))
				}

				if (savePath==null || savePath==='') {
					return next(new Error(`File of route '${ route.name }' could not be saved as no path has been specified by the handler`))
				}

				fse.outputFile(savePath, data, next)

			}

			route
				.handler(filePath, srcPath, distPath, route)
				.then(processHandler, next)

		}

		// Add fn to final list of handlers
		handlers.push(fn)

	}

	const executeHandlers = () => {

		// Run each file handler and continue with next
		async.parallel(handlers, next)

	}

	fse
		.walk(srcPath)
		.on('data', addFile)
		.on('end', executeHandlers)

}