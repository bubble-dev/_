// @ts-ignore
import { linkConfig, projectConfig as getProjectConfig, dependencyConfig as getDepConfig } from '@react-native-community/cli-platform-ios'

export type TLinkDependencyIos = {
  projectPath: string,
  dependencyPath: string,
}

export const linkDependencyIos = ({ projectPath, dependencyPath }: TLinkDependencyIos) => {
  const projectConfig = getProjectConfig(projectPath, {})
  const depConfig = getDepConfig(dependencyPath, {})
  const { register } = linkConfig()

  register(null, depConfig, null, projectConfig)
}
