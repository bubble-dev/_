import path from 'path'

export type TRunEmulator = {
  projectPath: string,
}

export const runEmulator = async ({ projectPath }: TRunEmulator) => {
  const avdPath = path.join(projectPath, 'avd')
  const reboxAvdPath = path.join(avdPath, 'rebox.avd')
  // await execa('bash', [require.resolve('@rebox/android/android/run-android-emulator.sh')], {
  //   stdout: process.stdout,
  //   stderr: process.stderr,
  //   env: {
  //     FORCE_COLOR: '1',
  //   },
  // })
}
