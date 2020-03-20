# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [11.0.0] - 2020-03-20

### Changed

- Updated dependencies
- Only support Node.js 10+
- Test with Node.js 10 and 12

## [10.0.0] - 2018-08-25

### Changed

- Only support Node.js 8+
- Test with Node.js 8 and 10

### Fixed

- `rosid -h`

## [9.0.3] - 2018-01-07

### Changed

- Removed `prepublish` script from `package.json`

### Fixed

- mime.lookup is not a function

## [9.0.2] - 2018-01-07

### Fixed

- Assert parameter order in tests

## [9.0.1] - 2017-08-08

### Changed

- Ignore `yarn.lock` and `package-lock.json` files

## [9.0.0] - 2017-07-31

### Added

- Added `static` option to disable browser reload for specific files
- CLI examples
- Helpful error when `rosidfile.js` or `rosidfile.json` is missing

### Changed

- Switched to a smaller package for parse CLI flags and arguments

### Removed

- Removed `polling` option

## [8.0.0] - 2017-07-19

### Added

- Documentation for patterns
- Reload browser when a file has been added or removed
- Inject images when an image changes instead of reloading the browser

### Changed

- Cache array of handlers must contain glob patterns
- Reduced number of cache calls
- Removed `async` or replaced it with a smaller module