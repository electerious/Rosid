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

  -i, --ignore   ignore given files when copying
  -s, --static   disable browser reload for given files
  -o, --open     open default or given URL automatically in default browser
  -v, --verbose  increase verbosity
  -V, --version  output the version number
  -h, --help     output usage information

Examples:

  $ rosid serve src/
  $ rosid serve src/ -o
  $ rosid serve src/ -o 'en/index.html'
  $ rosid serve src/ -s 'static.html'
  $ rosid compile src/ dist/
  $ rosid compile src/ dist/ -i '**/_*' -i '**/includes'
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

## Tips

Let Rosid open the URL automatically in your default browser with `--open` (or `-o`):

```sh
rosid serve src/ -o
```

Open a custom URL in your default browser with `--open` (or `-o`) followed by a path:

```sh
rosid serve src/ -o '/ui/index.html'
```

Prevent pages from reloading when the content changes by using `--static` (or `-s`):

```sh
rosid serve src/ dist/ -s 'static.html'
```

You can ignore files you don't want in the exported folder with `--ignore` (or `-i`):

```sh
rosid compile src/ dist/ -i '**/_*' -i '**/.bower.json' -i '**/assets/includes'
```