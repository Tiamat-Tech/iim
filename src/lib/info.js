const Fs = require('fs').promises
const Path = require('path')
const Os = require('os')
const explain = require('explain-error')
const pkg = require('../../package.json')

module.exports = async (ctx, binLinkPath, installPath) => {
  const { spinner } = ctx

  spinner.start('fetching current version info')
  let binPath
  try {
    binPath = await Fs.readlink(binLinkPath)
  } catch (err) {
    spinner.fail()
    throw explain(err, 'failed to read IPFS symlink')
  }
  spinner.succeed()
  spinner.stop()

  if (!binPath.startsWith(installPath)) {
    throw new Error('unmanaged IPFS install')
  }

  const [ implName, version ] = binPath
    .replace(installPath, '')
    .split(Path.sep)[1]
    .split('@')

  const ipfsPath = Path.join(Os.homedir(), `.${pkg.name}`, `${implName}@${version}`)

  return { implName, version, ipfsPath, implBinPath: binPath }
}
