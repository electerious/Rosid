'use strict'

let cache = new Map()

/**
 * Gets an object from the cache.
 * @public
 * @param {string} key - Identifier of the cached object.
 * @returns {?Object} obj - Cached object.
 */
const _get = function(key) {

	return cache.get(key)

}

/**
 * Saves an object in the cache.
 * @public
 * @param {string} key - Identifier for the cached object.
 * @param {Object} obj - Object which should be cached.
 */
const _set = function(key, obj) {

	obj = Object.assign({}, obj)

	cache.set(key, obj)

}

/**
 * Flush the cache and all of the stored data.
 * @public
 */
const _flush = function() {

	cache.clear()

}

/**
 * @public
 */
module.exports = {
	get   : _get,
	set   : _set,
	flush : _flush
}