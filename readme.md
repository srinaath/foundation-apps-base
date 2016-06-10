# Foundation for apps base

## Requirements

You'll need the following software installed to get started.

  - [Node.js](http://nodejs.org): Use the installer for your OS.
  - [Gulp](http://gulpjs.com/) and [Bower](http://bower.io): Run `npm install -g gulp bower`
    - Depending on how Node is configured on your machine, you may need to run `sudo npm install -g gulp bower` instead, if you get an error with the first command.
  - SCSS Lint: Used for enforcing standards in SASS development and required to be run in gulp.
  - [Git](http://git-scm.com/downloads): Use the installer for your OS.
    - Windows users can also try [Git for Windows](http://git-for-windows.github.io/).

## Get Started

Install the dependencies. If you're running Mac OS or Linux, you may need to run `sudo npm install` instead, depending on how your machine is configured.

```bash
npm install && bower install
```

Install gem for SCSS Lint:
```bash
gem install scss_lint
```

While you're working on your project, run:

```bash
npm start
```

This will compile the Sass and assemble your Angular app, then open it. **Now go to `localhost:8080` in your browser to see it in action.** When you change any file in the `client` folder, the appropriate Gulp task will run to build new files.

To run the compiling process once, without watching any files, use the `build` command.

```bash
npm start build
```

## Gulp

The above processes are ran by gulp and therefore have individual tasks within gulp. There are a number of tasks added on to the default 'Foundation for Apps' gulpfile such as the SCSS and JavaScript linters. Further documentation will be added, but see **gulpfile.js** in the project root for more info.

