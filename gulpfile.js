/////////////////////////////////////
/////////// Gulpfile.js /////////////
/////////////////////////////////////

// Gulp plugin Variables
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano')
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    del = require('del'),
    runSequence = require('run-sequence');


var paths = {
  styles: {
    src: 'app/scss/**/*.scss',
    dest: 'app/css'
  }
}

  // Define tasks after requiring dependencies
  function style(){
    return gulp.src(paths.styles.src)
        // Initialize sourcemaps before compilation starts
          .pipe(sourcemaps.init())
        // Use sass with the files found, and log any errors
        .pipe(sass()).on('error', sass.logError)
        // Use postcss with autoprefixer and compress the compiled file using cssnano
        .pipe(postcss([
          autoprefixer(),
          cssnano()
        ]))
        // Now add/write the sourcemaps
        .pipe(sourcemaps.write())
        // What is the destination for the compiled file?
        .pipe(gulp.dest(paths.styles.dest))
        // Add browsersync stream pipe after compilation
        .pipe(browserSync.stream())
}

function reload(){
  browserSync.reload()
}

function watch(){
  browserSync.init({
    server: {
      baseDir: "app"
    }
  })
  gulp.watch(paths.styles.src, style)
  // Automatically reloads browser during any change from the root 'app'
  gulp.watch('app').on('change', reload)
}

// gulp watch //
exports.watch = watch

//// End of watch code /////

// gulp useref
// Note: This comman builds a compressed file only use when you want to build the site
gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    // Minifies only if it's a Javascript file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'))
});

// gulp compress-images
// Note: This command compresses iamges and sends them to the dist file
gulp.task('compress-images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});

// gulp fonts
// Note: This command compresses the fonts file and sends them to the dist file
gulp.task('fonts', function(){
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

// gulp cache:clear
// Note: This command clears the cached image files from your computer after images have been deleted
gulp.task('cache:clear', function (callback) {
  return cache.clearAll(callback)
  })

  // gulp clean:dist  
  // Note: This deletes the dist file beware!
gulp.task('clean:dist', function() {
  return del.sync('dist');
})
























