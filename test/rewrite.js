'use strict'

const assert = require('chai').assert
const rewrite = require('./../src/rewrite')

describe('rewrite', function() {

	it('should return a function', function() {

		assert.isFunction(rewrite())

	})

})