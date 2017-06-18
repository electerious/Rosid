'use strict'

const os     = require('os')
const fs     = require('fs')
const pify   = require('pify')
const assert = require('chai').assert
const uuid   = require('uuid/v4')
const copy   = require('./../src/copy')

const fsify = require('fsify')({
	cwd: os.tmpdir()
})

describe('copy()', function() {

	it('should copy a directory without ignored files', function() {

		const structure = [
			{
				type: fsify.DIRECTORY,
				name: uuid(),
				contents: [
					{
						type: fsify.FILE,
						name: `${ uuid() }.ejs`
					},
					{
						type: fsify.FILE,
						name: `_${ uuid() }.ejs`
					},
					{
						type: fsify.FILE,
						name: `.${ uuid() }.swp`
					},
					{
						type: fsify.FILE,
						name: `${ uuid() }.css`
					},
					{
						type: fsify.FILE,
						name: `${ uuid() }.js`
					}
				]
			},
			{
				type: fsify.DIRECTORY,
				name: uuid()
			}
		]

		const routes = [
			{ path: '[^_]*.html' },
			{ path: '[^_]*.ejs' }
		]

		const opts = {
			verbose : true,
			ignore  : [
				'**/*.css'
			]
		}

		return fsify(structure).then((structure) => {

			const srcPath  = structure[0].name
			const distPath = structure[1].name

			const distFileEJS        = structure[0].contents[0].name.replace(srcPath, distPath)
			const distFileIgnoredEJS = structure[0].contents[1].name.replace(srcPath, distPath)
			const distFileSWP        = structure[0].contents[2].name.replace(srcPath, distPath)
			const distFileCSS        = structure[0].contents[3].name.replace(srcPath, distPath)
			const distFileJS         = structure[0].contents[4].name.replace(srcPath, distPath)

			return pify(copy)(routes, srcPath, distPath, opts).then(() => {

				assert.throws(fs.readFileSync.bind(null, distFileEJS))
				assert.doesNotThrow(fs.readFileSync.bind(null, distFileIgnoredEJS))
				assert.throws(fs.readFileSync.bind(null, distFileSWP))
				assert.throws(fs.readFileSync.bind(null, distFileCSS))
				assert.doesNotThrow(fs.readFileSync.bind(null, distFileJS))

			})

		})

	})

	it('should copy a directory with verbose enabled', function() {

		const structure = [
			{
				type: fsify.DIRECTORY,
				name: uuid()
			},
			{
				type: fsify.DIRECTORY,
				name: uuid()
			}
		]

		const routes = []

		const opts = {
			ignore: []
		}

		return fsify(structure).then((structure) => {

			const srcPath  = structure[0].name
			const distPath = structure[1].name

			return pify(copy)(routes, srcPath, distPath, opts)

		})

	})

})