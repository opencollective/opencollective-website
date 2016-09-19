const allAssets = require.context('.', true, /\.(png,gif,jpg,svg,txt,ttf,eot,woff,woff2)$/)

export const getPath = (assetId) => {
  assetId = assetId.startsWith('./') ? assetId : `./${assetId}`
  return allAssets(assetId)
}

export default {
  all: allAssets,
  getPath,
  image (assetId) {
    return getPath(`./images/${assetId}`)
  }
}
