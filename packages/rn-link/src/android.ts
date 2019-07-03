// @ts-ignore
import { linkConfig, projectConfig as getProjectConfig, dependencyConfig as getDepConfig } from '@react-native-community/cli-platform-android'

export type TLinkDependencyAndroid = {
  projectPath: string,
  dependencyName: string,
  dependencyPath: string,
}

export const linkDependencyAndroid = ({ projectPath, dependencyName, dependencyPath }: TLinkDependencyAndroid) => {
  const projectConfig = getProjectConfig(projectPath, {})
  const depConfig = getDepConfig(dependencyPath, {})
  const { register } = linkConfig()

  register(dependencyName, depConfig, {}, projectConfig)
}
