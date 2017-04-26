# Get started

Rosid can be integrated into your project in two ways: Using the CLI version *or* using the API of Rosid. This guide covers the first way and shows you how create and serve a simple project.

## 1. Install Rosid

First, install or update to the newest version of [Node.js](https://nodejs.org). Rosid is written in Node.js, but you only need to know the basics of Node.js and JavaScript to use Rosid. Once it has finished installing, create a new folder, open it in the terminal and run the following npm commands. If you wonder what npm is: It's a package manager that ships with Node.js. You should already have it installed now :)

```sh
# Create a package.json file
npm init --yes
# Install Rosid and save it as a dependency in the newly created package.json
npm install rosid --save
```

## 2. Setup your project

Rosid is now installed in your project, but needs a few files to do anything useful. Create a new folder called `src` and add a `index.html` and `main.scss` to it. You can fill them with the following content:

```html
<!doctype html>
<html lang="en">
	<head>

		<meta charset="utf-8">
		<title>Rosid</title>

		<link rel="stylesheet" href="main.css">

	</head>
	<body>

		<h1>Hello Rosid!</h1>

	</body>
</html>
```

```scss
$background: #55c185;
$color: #fff;

body {
	background: $background;
}

h1 {
	color: $color;
}
```

## 3. Install a handler

Rosid is now installed and two files have been added to your project in a folder called `src`. The HTML needs no processing. It works out of the box and Rosid will send it straight to the browser. The SASS file on the other side needs to be transformed to CSS, because browser don't know anything about SASS.

Let's use npm again to install an existing handler that handles the transformation of SASS files.

```sh
# Install the SASS handler
npm install rosid-handler-sass --save
```

## 4. Create a configuration

The handler is now installed, but Rosid has no clue how to use it. It's up to you to tell Rosid about your newbie. You do so by creating a `rosidfile.json` in the root of the project. It should contain anything Rosid needs to know.

```json
[
	{
		"name": "SASS",
		"path": "*.{css,scss,sass}",
		"handler": "rosid-handler-sass",
		"opts": {
			"in": ".scss"
		}
	}
]
```

- `name` is just a help for you. Rosid logs the activity of the handler with the name you've chosen.
- `path` uses the same patterns the shell uses. It matches all files with a `css`, `scss` or `sass` extension. Your `main.scss` is a match and Rosid will transform it with the handler specified in the `handler` property.
- `opts` are options. They're different form handler to handler. `rosid-handler-sass` loads `.sass` files by default. The `in` option changes this behaviour to `.scss` as this is the extension of your file.

## 5. Start Rosid

It's time to fire up Rosid. Rosid has been installed into the `node_modules` directory and you can run the Rosid CLI it contains.

```sh
# Start Rosid
./node_modules/.bin/rosid serve src/
```

Rosid starts and opens your default browser. You should see "Hello Rosid!" in it with a white font on a green background.

## 6. Compile your project

You don't need to use the server of Rosid. Export static files using your existing transform-functions and host your site anywhere!

```sh
# Compile your project
./node_modules/.bin/rosid compile src/ dist/
```

## What's next

This was just a taste of what Rosid can do for you. Try the official [Skeleton](https://github.com/electerious/Skeleton) project for more practical examples. Skeleton is a HTML5 Boilerplate built upon Rosid. JS (with Babel, UglifyJS), SASS (with cssnano, Autoprefixer) and EJS can be used right out of the box.