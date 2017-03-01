const gulp = require('gulp');
const gutil = require("gulp-util");
const postcss = require('gulp-postcss');
const changed = require('gulp-changed');
const svgSprite = require('gulp-svg-sprite');

const SRC_DIR = 'frontend/src';
const DIST_DIR = 'frontend/dist';

const config = require('config');
const request = require('request');

gulp.task('purge', (cb) => {
  if (!config.cloudflare.email) {
    return gutil.log("purge", gutil.colors.yellow("CLOUDFLARE_EMAIL missing in the env. Skipping purging cloudflare cache"));
  }
  if (!config.cloudflare.key) {
    return gutil.log("purge", gutil.colors.yellow("CLOUDFLARE_KEY missing in the env. Skipping purging cloudflare cache"));
  }
  const options = {
    method: 'DELETE',
    uri: "https://api.cloudflare.com/client/v4/zones/37b6a50c4c5be74e5a6ab8e34620bb1b/purge_cache",
    headers: {
      'X-Auth-Email': config.cloudflare.email,
      'X-Auth-Key': config.cloudflare.key,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'purge_everything': true})
  }
  request(options, (err, res, body) => {
    if (err) return cb(JSON.stringify(err));
    const response = JSON.parse(body);
    if (!response.success) return cb(response.errors[0].message);
    return cb(null, "Success");
  });
});

gulp.task('build', ['build:assets','build:css', 'purge']);

/**
 * Copy all static assets from ./frontend/src/public/* to ./frontend/dist/
 * (includes /images, /fonts, /robots.txt)
 */
gulp.task('build:assets', () => {
  return gulp.src([`${SRC_DIR}/public/**/*`])
    .pipe(changed(`${DIST_DIR}`))
    .pipe(gulp.dest(DIST_DIR));
});

gulp.task('watch:assets', () => {
  gulp.watch(`${SRC_DIR}/public/**/*`, ['build:assets']);
});

/**
 * Build css for main or widget
 */
gulp.task('build:css', () => {

  return gulp.src(`${SRC_DIR}/css/*.css`)
    .pipe(postcss([
      require('postcss-import')(),
      require('postcss-nested'),
      require('postcss-cssnext')(),
      require('postcss-discard-comments')(),
      require('cssnano')(),
    ]))
    .pipe(gulp.dest(`${DIST_DIR}/css`));
});

gulp.task('watch:css', () => {
  gulp.watch(`${SRC_DIR}/css/**/*.css`, ['build:css']);
});

gulp.task('build:svg', () => {
  return gulp.src(`${SRC_DIR}/public/svg/*.svg`)
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: 'sprite.svg',
          inline: true,
          example: true,
          dest: 'partials'
        }
      },
      shape: {
        id: {
          generator: 'svg-%s'
        }
      }
    }))
    .pipe(gulp.dest('server/dist/views'));
});

gulp.task('watch:svg', () => {
  gulp.watch(`${SRC_DIR}/public/svg/*.svg`, ['build:svg']);
});
