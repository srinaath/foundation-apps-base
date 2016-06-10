// FOUNDATION FOR APPS TEMPLATE GULPFILE
// -------------------------------------
// This file processes all of the assets in the "client" folder, combines them with the Foundation for Apps assets, and outputs the finished files in the "build" folder as a finished app.

// 1. LIBRARIES
// - - - - - - - - - - - - - - -

var $        = require('gulp-load-plugins')();
var argv     = require('yargs').argv;
var gulp     = require('gulp');
var rimraf   = require('rimraf');
var router   = require('front-router');
var sequence = require('run-sequence');
var stylish  = require('jshint-stylish');

// Check for --production flag
var isProduction = !!(argv.production);

// 2. FILE PATHS
// - - - - - - - - - - - - - - -

var BUILD_DIR = 'build';
var APP_DIR   = 'client';

var paths = {
  assets: [
    './'+APP_DIR+'/**/*.*',
    '!./'+APP_DIR+'/templates/**/*.*',
    '!./'+APP_DIR+'/assets/{scss,js}/**/*.*'
  ],
  // Paths to CSS used for plugins and such; used in vendor:css task
  vendorCSS: [
  ],
  // Sass will check these folders for files when you use @import.
  sass: [
    APP_DIR+'/assets/scss',
    'bower_components/foundation-apps/scss'
  ],
  // These files include Foundation for Apps and its dependencies
  foundationJS: [
    'bower_components/fastclick/lib/fastclick.js',
    'bower_components/viewport-units-buggyfill/viewport-units-buggyfill.js',
    'bower_components/tether/dist/js/tether.js',
    'bower_components/hammerjs/hammer.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/foundation-apps/js/vendor/**/*.js',
    'bower_components/foundation-apps/js/angular/**/*.js',
    '!bower_components/foundation-apps/js/angular/app.js'
  ],
  pluginsJS: [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/nouislider/distribute/nouislider.js',
    'bower_components/d3/d3.js',
    'bower_components/c3/c3.js'
    // 'bower_components/'
  ],
  // These files are for your app's JavaScript
  appJS: [
    APP_DIR+'/assets/js/app.js',
    APP_DIR+'/assets/js/**/*.js'
  ]
};


// 3. TASKS
// - - - - - - - - - - - - - - -

// Cleans the build directory
gulp.task('clean', function(cb) {
  rimraf('./'+BUILD_DIR, cb);
});

// Copies everything in the client folder except templates, Sass, and JS
gulp.task('copy', function() {
  return gulp.src(paths.assets, {
    base: './'+APP_DIR+'/'
  })
    .pipe(gulp.dest('./'+BUILD_DIR))
  ;
});

// Copies your app's page templates and generates URLs for them
gulp.task('copy:templates', function() {
  return gulp.src('./'+APP_DIR+'/templates/**/*.html')
    .pipe(router({
      path: 'build/assets/js/routes.js',
      root: APP_DIR
    }))
    .pipe(gulp.dest('./'+BUILD_DIR+'/templates'))
  ;
});

// Compiles the Foundation for Apps directive partials into a single JavaScript file
gulp.task('copy:foundation', function(cb) {
  gulp.src('bower_components/foundation-apps/js/angular/components/**/*.html')
    .pipe($.ngHtml2js({
      prefix: 'components/',
      moduleName: 'foundation',
      declareModule: false
    }))
    .pipe($.uglify())
    .pipe($.concat('templates.js'))
    .pipe(gulp.dest('./'+BUILD_DIR+'/assets/js'))
  ;

  // Iconic SVG icons
  gulp.src('./bower_components/foundation-apps/iconic/**/*')
    .pipe(gulp.dest('./'+BUILD_DIR+'/assets/img/iconic/'))
  ;

  cb();
});

// Combines vendor CSS into one SASS file which is imported into app.scss on build
gulp.task('vendor:css', function () {
  return gulp.src(paths.vendorCSS)
    .pipe($.concat('_vendor.scss'))
    .pipe(gulp.dest('./'+APP_DIR+'/assets/scss'));
});

// Compiles Sass
gulp.task('sass', ['vendor:css'], function () {
  return gulp.src(APP_DIR+'/assets/scss/app.scss')
    .pipe($.sass({
      includePaths: paths.sass,
      outputStyle: (isProduction ? 'compressed' : 'nested'),
      errLogToConsole: true
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie 10']
    }))
    .pipe(gulp.dest('./'+BUILD_DIR+'/assets/css/'))
    .pipe(gulp.dest(APP_DIR+'/assets/css/'))

  ;
});

// Compiles and copies the Foundation for Apps JavaScript, as well as your app's custom JS
gulp.task('uglify', ['uglify:foundation', 'uglify:plugins', 'uglify:app']);

gulp.task('uglify:foundation', function(cb) {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    }));

  return gulp.src(paths.foundationJS)
    .pipe(uglify)
    .pipe($.concat('foundation.js'))
    .pipe(gulp.dest('./'+BUILD_DIR+'/assets/js/'))
  ;
});

// Added task for compiling minified versions of plugin scripts
gulp.task('uglify:plugins', ['lint:js'], function(cb) {
  var minifiedScripts = [];
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    }));

  for (var i = 0; i < paths.pluginsJS.length; i++) {
    var src = paths.pluginsJS[i];
    var minSrc = src.split('.js')[0]+'.min.js';
    minifiedScripts.push(minSrc);
  }

  return gulp.src(minifiedScripts)
    .pipe($.concat('plugins.js'))
    .pipe(gulp.dest('./'+BUILD_DIR+'/assets/js/'))
  ;
});

gulp.task('uglify:app', function() {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    }));

  return gulp.src(paths.appJS)
    .pipe($.ngAnnotate({remove: false, add: true}))
    .pipe(uglify)
    .pipe($.concat('app.js'))
    .pipe(gulp.dest('./'+BUILD_DIR+'/assets/js/'))
  ;
});


// Starts a test server, which you can view at http://localhost:8080
gulp.task('server', ['build'], function() {
  gulp.src('./'+BUILD_DIR)
    .pipe($.webserver({
      port: 8080,
      host: 'localhost',
      fallback: 'index.html',
      livereload: true,
      open: true
    }))
  ;
});

gulp.task('lint', ['lint:sass', 'lint:js']);

// Use scss_lint to check SCSS for standards
gulp.task('lint:sass', function() {
  return gulp.src([
    APP_DIR+'/assets/scss/**/*.scss',
    '!'+APP_DIR+'/assets/scss/_settings.scss',
    '!'+APP_DIR+'/assets/scss/_vendor.scss'
  ])
  .pipe($.if(isProduction, $.scssLint.failReporter()))
  ;
});

// Run the JavaScript linter
gulp.task('lint:js', function() {
  return gulp.src(paths.appJS)
    .pipe($.jshint())
    .pipe($.jshint.reporter(stylish))
    // halt the production build if a lint fails
    .pipe($.if(isProduction, $.jshint.reporter('fail')))
  ;
});

// Builds your entire app once, without starting a server
gulp.task('build', function(cb) {
  sequence('clean', 'lint', ['copy', 'copy:foundation', 'sass', 'uglify'], 'copy:templates', cb);
});

// Default task: builds your app, starts a server, and recompiles assets when they change
gulp.task('default', ['server'], function () {
  // Watch Sass
  gulp.watch(['./'+APP_DIR+'/assets/scss/**/*', './scss/**/*'], ['lint:sass', 'sass']);

  // Watch JavaScript
  gulp.watch(['./'+APP_DIR+'/assets/js/**/*', './js/**/*'], ['uglify:app']);

  // Watch static files
  gulp.watch(['./'+APP_DIR+'/**/*.*', '!./'+APP_DIR+'/templates/**/*.*', '!./'+APP_DIR+'/assets/{scss,js,css}/**/*.*'], ['copy']);

  // Watch app templates
  gulp.watch(['./'+APP_DIR+'/templates/**/*.html'], ['copy:templates']);
});
