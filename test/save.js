'use strict'

const fs     = require('fs')
const assert = require('chai').assert
const temp   = require('temp').track()
const save   = require('./../src/save')

describe('save()', function() {

	it('should save a file', function(done) {

		const filePath = temp.openSync().path
		const data     = 'data'

		save(filePath, data, {}, (err) => {

			if (err!=null) done(err)

			assert.strictEqual(fs.readFileSync(filePath, 'utf8'), data)

			done()

		})

	})

	it('should save a file with verbose enabled', function(done) {

		const filePath = temp.openSync().path
		const data     = 'data'

		save(filePath, data, { verbose: true }, (err) => {

			if (err!=null) done(err)

			assert.strictEqual(fs.readFileSync(filePath, 'utf8'), data)

			done()

		})

	})

})