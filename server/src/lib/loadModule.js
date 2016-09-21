const req = typeof __non_webpack_require__ !== 'undefined'
  ? __non_webpack_require__ // eslint-disable-line
  : require

export default (pathToModule) => {
  const result = req(pathToModule)
  return result.default ? result.default : result
}
