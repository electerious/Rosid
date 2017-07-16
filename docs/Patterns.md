# Patterns

Rosid uses the same [patterns the shell uses](https://github.com/isaacs/node-glob). This document contains a few examples of valid patterns often used in Rosid.

| Pattern | Description |
|:-----------|:------------|
| `*.html` | Matches all HTML files in the root of your project |
| `[^_]*.html` | Matches all HTML files in the root of your project not starting with an underscore |
| `**/*.html` | Matches all HTML files |
| `**/*.{html,ejs}` | Matches all HTML and EJS files |
| `scripts/main.js` | Matches `scripts/main.js` |
| `scripts/*/*.js` | Matches all JS files located in a subdirectory of `scripts/` |
| `scripts/[^_]*/*.js` | Matches all JS files located in a subdirectory of `scripts/` when the subdirectory does not start with an underscore |
| `scripts/**/*.js` | Matches all JS files located in `scripts/` or in any subdirectory of `scripts/` |