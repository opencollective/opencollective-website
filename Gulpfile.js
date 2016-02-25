const gulp = require('gulp');
const postcss = require('gulp-postcss');
const changed = require('gulp-changed');
const autoprefixer = require('autoprefixer');

const SRC_DIR = 'frontend/src';
const DIST_DIR = 'frontend/dist';

gulp.task('build', ['build:assets','build:css']);

/**
 * Copy all static assets from ./frontend/src/assets/* to ./frontend/dist/
 * (includes /images, /fonts, /robots.txt)
 */
gulp.task('build:assets', () => {
  return gulp.src([`${SRC_DIR}/assets/**/*`])
    .pipe(changed(`${DIST_DIR}`))
    .pipe(gulp.dest(DIST_DIR));
});

gulp.task('watch:assets', () => {
  gulp.watch(`${SRC_DIR}/assets/**/*`, ['build:assets']);
});

/**
 * Build css for main or widget
 */
gulp.task('build:css', () => {

  return gulp.src(`${SRC_DIR}/css/*.css`)
    .pipe(postcss([
      autoprefixer,
      require('postcss-import')(),
      require('postcss-cssnext')(),
      require('postcss-discard-comments')(),
      require('cssnano')(),
    ]))
    .pipe(gulp.dest(`${DIST_DIR}/css`));
});

gulp.task('watch:css', () => {
  gulp.watch(`${SRC_DIR}/css/**/*.css`, ['build:css']);
});