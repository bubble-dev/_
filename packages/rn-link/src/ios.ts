/* eslint-disable no-sync */
import path from 'path'
// @ts-ignore
import xcode from 'xcode'
import plistParser, { PlistValue } from 'plist'
import { isUndefined } from 'tsfn'
import { pReadDir, pReadFile, pWriteFile } from './utils'

const plistBuildOptions = {
  indent: '\t',
  offset: -1,
}

const getTargets = (project) => {
  const projectTargetSection = project.pbxNativeTargetSection()

  return project.getFirstProject().firstProject.targets
    .filter((target) => !isUndefined(projectTargetSection[target.value]))
    .map((target) => ({
      uuid: target.value,
      target: projectTargetSection[target.value],
      name: projectTargetSection[target.value].productReference_comment,
    }))
}

export const linkLibIos = async (projectPath: string, libPath: string) => {
  const projectFiles = await pReadDir(projectPath)
  const xcodeProjectPath = projectFiles.find((file) => path.extname(file) === '.xcodeproj')

  if (typeof xcodeProjectPath !== 'string') {
    throw new Error('Unable to locate iOS project files')
  }

  const projectName = path.basename(xcodeProjectPath, '.xcodeproj')
  const plistPath = path.join(projectPath, projectName, 'Info.plist')
  const pbxprojPath = path.join(projectPath, xcodeProjectPath, 'project.pbxproj')
  const project = xcode.project(pbxprojPath).parseSync()
  const plistData = await pReadFile(plistPath, 'utf8')
  const plist = plistParser.parse(plistData) as PlistValue & { UIAppFonts?: string[] }

  const libProj = xcode.project(libPath).parseSync()
  const projTargets = getTargets(project)
  const libTargets = getTargets(libProj)

  for (const libTarget of libTargets) {
    for (const projTarget of projTargets) {
      project.addStaticLibrary(libTarget.name, {
        target: projTarget.uuid,
      })
    }
  }

  await pWriteFile(plistPath, `${plistParser.build(plist, plistBuildOptions)}\n`)
  await pWriteFile(pbxprojPath, project.writeSync())
}
