'use strict'

const assert = require('chai').assert
const log    = require('./../src/log')

describe('log()', function() {

	it('should be an executable function without a return value', function() {

		assert.isUndefined(log('mocha'))

	})

})