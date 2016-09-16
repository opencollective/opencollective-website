import defaults from 'lodash/defaults'
import { join } from 'path'

export function websiteViews(options = {}) {
  const { knownHelpers } = require(
    join(process.cwd(), 'server', 'src', 'views')
  )

  defaults(options, {
    helperDirs: [
      join(process.cwd(), 'server', 'src', 'views', 'helpers')
    ].concat(options.helperDirs || []),
    partialDirs: [
      join(process.cwd(), 'server', 'src', 'views', 'partials')
    ].concat(options.partialDirs || []),
    knownHelpers: knownHelpers.concat(options.knownHelpers || [])
  })

  return {
    test: /\.(hbs|handlebars|svg)$/,
    loader: 'handlebars',
    query: {
      helperDirs: options.helperDirs,
      partialDirs: options.partialDirs,
      knownHelpers: options.knownHelpers.concat('cachebust')
    }
  }
}
