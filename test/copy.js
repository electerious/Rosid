'use strict'

const fs     = require('fs')
const path   = require('path')
const assert = require('chai').assert
const temp   = require('temp').track()
const copy   = require('./../src/copy')

let srcPath = null

let fileEJS = null
let fileJS  = null
let fileSWP = null
let fileCSS = null

describe('copy()', function() {

	before(function() {

		srcPath = temp.mkdirSync()

		fileEJS = temp.openSync({
			dir    : srcPath,
			suffix : '.ejs'
		}).path

		fileJS = temp.openSync({
			dir    : srcPath,
			suffix : '.js'
		}).path

		fileSWP = temp.openSync({
			dir    : srcPath,
			suffix : '.swp'
		}).path

		fileCSS = temp.openSync({
			dir    : srcPath,
			suffix : '.css'
		}).path

		fs.writeFileSync(fileEJS)
		fs.writeFileSync(fileJS)
		fs.writeFileSync(fileSWP)
		fs.writeFileSync(fileCSS)

	})

	it('should copy a directory without ignored files', function(next) {

		const distPath = temp.mkdirSync()

		const distFileEJS = path.resolve(distPath, path.parse(fileEJS).base)
		const distFileJS  = path.resolve(distPath, path.parse(fileJS).base)
		const distFileSWP = path.resolve(distPath, path.parse(fileSWP).base)
		const distFileCSS = path.resolve(distPath, path.parse(fileCSS).base)

		const routes = [{
			path: '[^_]*.{html,ejs}*'
		}]

		const opts = {
			verbose : true,
			ignore  : [
				'**/*.css'
			]
		}

		copy(routes, srcPath, distPath, opts, (err) => {

			assert.throws(fs.readFileSync.bind(null, distFileEJS))
			assert.doesNotThrow(fs.readFileSync.bind(null, distFileJS))
			assert.throws(fs.readFileSync.bind(null, distFileSWP))
			assert.throws(fs.readFileSync.bind(null, distFileCSS))

			next(err)

		})

	})

})