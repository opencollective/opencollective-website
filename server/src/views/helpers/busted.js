const wantsHMR = process.env.ENABLE_HMR || process.argv.indexOf('--hot') >= 0

// We no longer need to manually use the cache-bust helper since webpack
// automatically hashes our filenames for us in production
export default (file) => {
  return wantsHMR && process.env.NODE_ENV === 'development'
    ? `http://localhost:8080/static${file}`
    : `/static${file}`
};
