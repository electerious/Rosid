# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [8.0.0] - 2017-07-19

### New

- Documentation for patterns
- Reload browser when a file has been added or removed
- Inject images when an image changes instead of reloading the browser

### Changed

- Cache array of handlers must contain glob patterns
- Reduced number of cache calls
- Removed `async` or replaced it with a smaller module