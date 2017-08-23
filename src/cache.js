'use strict'

const mm = require('micromatch')
const cache = new Map()

/**
 * Gets an object from the cache.
 * @public
 * @param {String} key - Identifier of the cached object.
 * @returns {?Object} obj - Cached object.
 */
const _get = function(key) {

	return cache.get(key)

}

/**
 * Saves an object in the cache.
 * @public
 * @param {String} key - Identifier for the cached object.
 * @param {Object} obj - Object which should be cached.
 */
const _set = function(key, obj) {

	obj = Object.assign({}, obj)

	cache.set(key, obj)

}

/**
 * Deletes matching data when a file path is given or all data when no caching information given.
 * @public
 * @param {String} filePath - File that triggers a cache flush (relative).
 */
const _flush = function(filePath) {

	cache.forEach((value, key) => {

		// Delete entry directly when no caching information available
		if (value.cache==null) return cache.delete(key)

		// Look if the current entry is affected by the file path
		const isAffected = mm.any(filePath, value.cache)

		if (isAffected===true) cache.delete(key)

	})

}

/**
 * @public
 */
module.exports = {
	get: _get,
	set: _set,
	flush: _flush
}