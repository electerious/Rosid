'use strict'

const assert = require('chai').assert
const index  = require('./../src/index')

describe('index()', function() {

	it('should return an object with two functions', function() {

		const obj = index()

		assert.isObject(obj)
		assert.isFunction(obj.compile)
		assert.isFunction(obj.serve)

	})

})