# CLI

Rosid can be integrated into your project using its API *or* CLI. The CLI tool is located in the `bin` folder and allows you to run the `serve` and `compile` functions without adding JS files to your project. Only a single `rosidfile.json` or `rosidfile.js` is required in your current working directory.

## Usage

```
Usage:

  rosid [command] [options]

Commands:

  serve [srcPath] [options]               serve current or specified folder
  compile [srcPath] [distPath] [options]  compile current or specified folder to static files

Options:

  -p, --polling  use polling to watch files over a network or in other non-standard situations
  -v, --verbose  increase verbosity
  -V, --version  output the version number
  -h, --help     output usage information
```

## Commands

### Serve

Start a static site server and compile requested files on-the-fly. The site will reload automatically when files change.

```sh
rosid serve src/
```

### Compile

Export your site to a folder.

```sh
rosid serve src/ dist/
```

You can ignore files you don't want in the exported folder with `--ignore` (or `-i`).

```sh
rosid serve src/ dist/ -i '**/_*' -i '**/.bower.json' -i '**/assets/includes'
```