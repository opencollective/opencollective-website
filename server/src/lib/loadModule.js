const req = __non_webpack_require__ // eslint-disable-line

export default (pathToModule) => {
  const result = req(pathToModule) // eslint-disable-line
  return result.default ? result.default : result
}
