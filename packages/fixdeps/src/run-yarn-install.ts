import execa from 'execa'

export const runYarnInstall = async () => {
  await execa('yarn', ['install'], {
    stdout: process.stdout,
    stderr: process.stderr,
    env: { FORCE_COLOR: '1' },
  })
}
