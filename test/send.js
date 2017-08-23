'use strict'

const assert = require('chai').assert
const send = require('./../src/send')

describe('send()', function() {

	it('should set content-type', function() {

		const contentType = 'text/css'

		const res = {
			end: () => {},
			setHeader: (key, value) => {

				assert.strictEqual(key, 'Content-Type')
				assert.strictEqual(value, contentType)

			}
		}

		send(res, contentType, '')

	})

	it('should send data', function() {

		const data = 'data'

		const res = {
			setHeader: () => {},
			end: (_data) => {

				assert.strictEqual(_data, data)

			}
		}

		send(res, null, data)

	})

})