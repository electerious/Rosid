'use strict'

const assert  = require('chai').assert
const temp    = require('temp').track()
const execute = require('./../src/execute')

describe('execute()', function() {

	it('should execute handler with filePath and data', function(done) {

		const fileRoute = temp.openSync().path
		const filePath  = temp.openSync().path
		const data      = 'data'

		const opts = {
			key: 'value'
		}

		const handler = (_filePath, _opts) => {

			assert.strictEqual(_filePath, filePath)
			assert.deepEqual(_opts, opts)

			done()

		}

		const route = {
			name    : 'mocha',
			handler : handler,
			opts    : opts
		}

		execute(route, fileRoute, filePath, (err, data) => {})

	})

	it('should process the response of a handler', function(done) {

		const fileRoute = temp.openSync().path
		const filePath  = temp.openSync().path
		const data      = 'data'

		const handler = () => Promise.resolve(data)

		const route = {
			name    : 'mocha',
			handler : handler,
			opts    : {}
		}

		execute(route, fileRoute, filePath, (err, _data) => {

			if (err!=null) return done(err)

			assert.strictEqual(_data, data)

			done()

		})

	})

	it('should pass an error the callback when handler returns no data', function(done) {

		const fileRoute = temp.openSync().path
		const filePath  = temp.openSync().path

		const handler = () => Promise.resolve(null)

		const route = {
			name    : 'mocha',
			handler : handler,
			opts    : {}
		}

		execute(route, fileRoute, filePath, (err, _data) => {

			assert.isNotNull(err)
			assert.isDefined(err)

			done()

		})

	})

})