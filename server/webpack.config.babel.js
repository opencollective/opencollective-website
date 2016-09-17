import project from '../project'

const { server } = project.paths

// Enabling HMR Requires either of these opt in
const wantsHMR = process.env.ENABLE_HMR || process.argv.indexOf('--hot')

export default () => {
  const builder = project.getWebpackBase('server')

  .entry({
    index: wantsHMR
      ? [server.join('src/index.js')]
      : [server.join('src/index.js')]
  }, __dirname)

  // Treat the src/ folder as if it has modules, allowing nicer require statements
  .modules(server.join('src'))

  // Instead of webpack's non-descript integer ids for our modules
  .plugin('webpack.NamedModulesPlugin')

  .plugin('webpack.DefinePlugin', {
    'process.env.NODE_CONFIG_DIR': './config'
  })

  if (wantsHMR) {
    builder.when('development', (builder) => builder
      .plugin('webpack.HotModuleReplacementPlugin')
      .plugin('webpack.NoErrorsPlugin') // NoErrorsPlugin prevents HMR from applying broken updates
    )
  }

  console.log("Builder", builder.getState())

  const config = builder.getConfig()

  return {
    ...config,
    module: {
      ...config.module,
      // This is required to silence warnings from dynamic requires in our dependencies
      exprContextRegExp: /$^/,
      exprContextCritical: false
    }
  }
}
