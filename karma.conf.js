require('dotenv').load()

const argv = require('minimist')(process.argv.slice(2))
const join = require('path').join


module.exports = (config) => {
  config.set({
    frameworks: ['mocha'],
    reporters: ['mocha'],

    browsers: ['Chrome'],

    files: [{
      pattern: './test/unit/setup.js',
      watched: false,
      served: true,
      included: true
    }],

    preprocessors: {
      './test/unit/setup.js': ['webpack']
    },

    webpack: buildWebpackConfig(),

    // make Webpack bundle generation quiet
    webpackMiddleware: {
      stats: 'normal'
    },

    plugins:[
      require('karma-webpack'),
      require('karma-mocha'),
      require('karma-mocha-reporter'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-ie-launcher'),
      require('karma-safari-launcher'),
      require('karma-sourcemap-loader')
    ]

  });
};

function buildWebpackConfig() {
  const passThroughNodeModules = require('./project/config/webpack/node-module-externals')

  const config = require('@terse/webpack').api()
    .sourcemap('inline-source-map')
    .loader('null', ['.css', '.svg', '.jpg', '.gif', '.png'], {
      loader: 'null'
    })
    .loader('json', '.json', {
      loader: 'json'
    })
    .externals(passThroughNodeModules({pkg: require('./package.json')}))
    .loader('.js', ['.js'], {
      loader: 'babel',
      include: [
        join(__dirname, 'frontend', 'src'),
        join(__dirname, 'server', 'src'),
        join(__dirname, 'test')
      ],
      exclude: [
        /node_modules/
      ]
    })
    .getConfig()

  return Object.assign(config, {
    node: {
      fs: 'empty',
      child_process: 'empty',
      net: 'empty',
      tls: 'empty'
    }
  })
}
