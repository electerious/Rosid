'use strict'

const fs     = require('fs')
const path   = require('path')
const assert = require('chai').assert
const temp   = require('temp').track()
const copy   = require('./../src/copy')

const newFile = function(opts) {

	const file = temp.openSync(opts)

	fs.writeFileSync(file.path, opts.content || '')

	return file.path

}

describe('copy()', function() {

	it('should copy a directory without ignored files', function(next) {

		const srcPath  = temp.mkdirSync()
		const distPath = temp.mkdirSync()

		const fileEJS = newFile({ dir: srcPath, suffix: '.ejs' })
		const fileJS  = newFile({ dir: srcPath, suffix: '.js' })
		const fileSWP = newFile({ dir: srcPath, suffix: '.swp' })
		const fileCSS = newFile({ dir: srcPath, suffix: '.css' })

		const distFileEJS = path.resolve(distPath, path.parse(fileEJS).base)
		const distFileJS  = path.resolve(distPath, path.parse(fileJS).base)
		const distFileSWP = path.resolve(distPath, path.parse(fileSWP).base)
		const distFileCSS = path.resolve(distPath, path.parse(fileCSS).base)

		const routes = [
			{ path: '[^_]*.{html,ejs}*' }
		]

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