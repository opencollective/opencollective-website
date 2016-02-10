const gulp = require('gulp');
const postcss = require('gulp-postcss');
const changed = require('gulp-changed');
const autoprefixer = require('autoprefixer');

/**
 * Build css for main or widget
 */

gulp.task('build:css', () => {

  return gulp.src('./frontend/src/css/*.css')
    .pipe(changed('./frontend/dist/css'))
    .pipe(postcss([
      autoprefixer,
      require('postcss-import')(),
      require('postcss-cssnext')(),
      require('postcss-discard-comments')(),
      require('cssnano')(),
    ]))
    .pipe(gulp.dest('./frontend/dist/css'));
});

gulp.task('watch:css', () => {
  gulp.watch('./frontend/src/css/**/*.css', ['build:css']);
});