import { homedir } from 'os'
import { resolve } from 'path'

const humanizePath = (path: string) => {
  const resolved: string = resolve(path)
  const _homedir = homedir()
  if (resolved.indexOf(_homedir) === 0) {
    return `~${resolved.substr(_homedir.length)}`
  }
  return resolved
}

export default humanizePath
