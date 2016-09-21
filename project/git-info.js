/**
 * Returns a hash of metadata about a git repository.
 *
 * This metadata is helpful in tracking information about releases / deployments.
 */
const fs   = require('fs')
const path = require('path')
const zlib = require('zlib')

const GIT_DIR = '.git'

function findRepo(startingPath) {
  let gitPath, lastPath
  let currentPath = startingPath

  if (!currentPath) { currentPath = process.cwd() }

  do {
    gitPath = path.join(currentPath, GIT_DIR)

    if (fs.existsSync(gitPath)) {
      return gitPath
    }

    lastPath = currentPath
    currentPath = path.resolve(currentPath, '..')
  } while (lastPath !== currentPath)

  return null
}

function findPackedTag(gitPath, sha) {
  const packedRefsFilePath = path.join(gitPath, 'packed-refs')
  if (fs.existsSync(packedRefsFilePath)) {
    const packedRefsFile = fs.readFileSync(packedRefsFilePath, {encoding: 'utf8'})
    const tagLine = packedRefsFile.split('\n').filter(function(line) {
      return line.indexOf('refs/tags') > -1 && line.indexOf(sha) > -1
    })[0]

    if (tagLine) {
      return tagLine.split('tags/')[1]
    }
  }
}

function commitForTag(gitPath, tag) {
  const tagPath = path.join(gitPath, 'refs', 'tags', tag)
  const taggedObject = fs.readFileSync(tagPath, { encoding: 'utf8' }).trim()
  const objectPath = path.join(gitPath, 'objects', taggedObject.slice(0, 2), taggedObject.slice(2))

  if (!zlib.inflateSync || !fs.existsSync(objectPath)) {
    // we cannot support annotated tags on node v0.10 because
    // zlib does not allow sync access
    return taggedObject
  }

  const objectContents = zlib.inflateSync(fs.readFileSync(objectPath)).toString()

  // 'tag 172\u0000object c1ee41c325d54f410b133e0018c7a6b1316f6cda\ntype commit\ntag awesome-tag\ntagger Robert Jackson <robert.w.jackson@me.com> 1429100021 -0400\n\nI am making an annotated tag.\n'
  if (objectContents.slice(0,3) === 'tag') {
    const sections = objectContents.split(/\0|\n/)
    const sha = sections[1].slice(7)

    return sha
  } else {
    // this will return the tag for lightweight tags
    return taggedObject
  }
}

function findTag(gitPath, sha) {
  let tag = findPackedTag(gitPath, sha)
  if (tag) { return tag }

  const tagsPath = path.join(gitPath, 'refs', 'tags')
  if (!fs.existsSync(tagsPath)) { return false }

  const tags = fs.readdirSync(tagsPath)

  for (let i = 0, l = tags.length; i < l; i++) {
    tag = tags[i]
    const commitAtTag = commitForTag(gitPath, tags[i])

    if (commitAtTag === sha) {
      return tag
    }
  }
}

module.exports = function(gitPath) {
  gitPath = findRepo(gitPath || process.cwd())

  const result = {
    sha: null,
    abbreviatedSha: null,
    branch: null,
    tag: null,
    root: path.resolve(gitPath, '..')
  }

  try {
    const headFilePath   = path.join(gitPath, 'HEAD')

    if (fs.existsSync(headFilePath)) {
      const headFile = fs.readFileSync(headFilePath, {encoding: 'utf8'})
      let branchName = headFile.split('/').slice(2).join('/').trim()
      if (!branchName) {
        branchName = headFile.split('/').slice(-1)[0].trim()
      }
      const refPath = headFile.split(' ')[1]

      // Find branch and SHA
      if (refPath) {
        const branchPath = path.join(gitPath, refPath.trim())

        result.branch  = branchName
        result.sha     = fs.readFileSync(branchPath, {encoding: 'utf8' }).trim()
      } else {
        result.sha = branchName
      }

      result.abbreviatedSha = result.sha.slice(0,10)

      // Find tag
      let tag = findTag(gitPath, result.sha)
      if (tag) {
        result.tag = tag
      }
    }
  } catch (e) {
    if (!module.exports._suppressErrors) {
      throw e // helps with testing and scenarios where we do not expect errors
    } else {
      // eat the error
    }
  }

  return result
}

module.exports._suppressErrors = true
module.exports._findRepo     = findRepo
