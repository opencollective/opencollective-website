import { readFileSync } from 'fs'

export const generate = (pathToStats, formatName) => {
  const json = readFileSync(pathToStats).toString()
  const data = JSON.parse(json)
  const modulesWithAssets = data.modules.filter(
    mod => mod.assets.length !== 0
  )

  return modulesWithAssets
    .filter(mod => mod.assets.length > 0).map(m => [m.name, m.assets[0]])
    .reduce((memo, data) => (
      memo[formatName(data[0])] = data[1]
    ))
}
