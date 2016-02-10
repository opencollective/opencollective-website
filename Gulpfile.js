const gulp = require('gulp');
const postcss = require('gulp-postcss');
const changed = require('gulp-changed');
const autoprefixer = require('autoprefixer');

/**
 * Build css for main or widget
 */

gulp.task('build:css', () => {

  return gulp.src('./static/css/*.css')
    .pipe(changed('./static/dist'))
    .pipe(postcss([
      autoprefixer,
      require('postcss-import')(),
      require('postcss-cssnext')(),
      require('postcss-discard-comments')(),
      require('cssnano')(),
    ]))
    .pipe(gulp.dest('./static/dist'));
});

gulp.task('watch:css', () => {
  gulp.watch('./static/css/**/*.css', ['build:css']);
});
