import path from 'path'
import { writeFile } from 'pifs'
import execa from 'execa'

export type TRunEmulator = {
  projectPath: string,
  isHeadless: boolean,
  portsToForward: number[],
}

export const runEmulator = async (options: TRunEmulator): Promise<() => void> => {
  const avdHomePath = path.join(options.projectPath, 'avd')
  const reboxAvdPath = path.join(avdHomePath, 'rebox.avd')
  const reboxIniPath = path.join(avdHomePath, 'rebox.ini')

  let iniData = 'avd.ini.encoding=UTF-8\n'
  iniData += `path=${reboxAvdPath}\n`
  iniData += 'path.rel=avd/rebox.avd\n'
  iniData += 'target=android-28'

  await writeFile(reboxIniPath, iniData)

  const emulatorProcess = execa(
    `${process.env.ANDROID_HOME}/emulator/emulator`,
    [
      '-avd',
      'rebox',
      '-gpu',
      'host',
      // empty string doesn't work
      ...(options.isHeadless ? ['-no-window'] : []),
      '-no-audio',
      '-memory',
      '2048',
      '-partition-size',
      '1024',
      '-netfast',
      '-accel',
      'on',
      '-no-boot-anim',
    ],
    {
      stderr: process.stderr,
      env: {
        ANDROID_AVD_HOME: avdHomePath,
      },
    }
  )

  await execa(
    `${process.env.ANDROID_HOME}/platform-tools/adb`,
    [
      'wait-for-device',
      'shell',
      'while [[ -z $(getprop sys.boot_completed) ]]; do sleep 1; done;',
    ]
  )

  for (const port of options.portsToForward) {
    await execa(
      `${process.env.ANDROID_HOME}/platform-tools/adb`,
      ['reverse', `tcp:${port}`, `tcp:${port}`]
    )
  }

  return () => {
    emulatorProcess.kill('SIGKILL')
  }
}
