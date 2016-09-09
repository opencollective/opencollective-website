export default (app) => {
  const webpackConfig = require('../../webpack.web')('development', {
    publicPath: '/static/'
  })

  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(webpackConfig);
  const middleware = webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    silent: true,
    stats: 'errors-only'
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
}
