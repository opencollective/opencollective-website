import { resolve } from 'path'
import pickBy from 'lodash/pickBy'
import flatten from 'lodash/flatten'
import values from 'lodash/values'
import defaults from 'lodash/defaults'

export default (manifest = {}, options = {}) => {
  defaults(options, {
    importType: 'commonjs',
    context: process.cwd()
  })

  const dependencies = pickBy(manifest,
    (value, key) => key.match(/dependencies/i)
  )

  const moduleNames = flatten(
    values(dependencies).map((list) => Object.keys(list))
  )

  return (context, request, callback) => {
    const modulePath = resolve(context, request)
    const isNodeModule = modulePath.match(/node_modules/)
    const moduleName = getModuleName(modulePath)
    const isExternal = isNodeModule && moduleNames.indexOf(moduleName) >= 0

    if (isExternal) {
      callback(null, `${options.importType} ${request}`)
    } else {
      callback()
    }
  }
}

const getModuleName = (path) => (
  path.replace(/^.*?\/node_modules\//, '').split('/').shift()
)
