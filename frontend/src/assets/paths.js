/**
 * Creates helpers for the following:
 *  $assets.image('default_avatar.svg')
 * http://localhost:8080/static/0904043535a621fe822ff4d6e741277d.svg
 */

const contexts = {
  images: require.context('./images', true, /\.(svg|gif|png|jpg)$/),
  svg: require.context('./svg', true, /\.svg$/)
}

export default {
  // returns the URL to an image
  image: (assetId) => contexts.images(`./${assetId}`),

  // the svg extension is optional since we know
  svg: (assetId) => {
    assetId = assetId.match(/\.svg$/) ? assetId : `${assetId}.svg`
    return contexts.svg(`./${assetId}`)
  }
}
