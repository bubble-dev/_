import React from 'react'
import { startWithType, mapContext, pureComponent } from 'refun'
import { isUndefined } from 'tsfn'
import { Layout, Layout_Item } from '../layout'
import { LAYOUT_SIZE_FIT } from '../../symbols'
import { SizeText } from '../size-text'
import { SizeLink } from '../size-link'
import { TPackageInfo } from '../../types'
import { ThemeContext, mapContextOverride, TextThemeContext } from '../theme-provider'

export type TInfo = {
  packageInfo?: TPackageInfo,
}

export const Info = pureComponent(
  startWithType<TInfo>(),
  mapContext(ThemeContext),
  mapContextOverride('LinkThemeProvider', TextThemeContext, ({ theme }) => ({ color: theme.linkColor }))
)(({
  theme,
  packageInfo,
  LinkThemeProvider,
}) => {
  if (isUndefined(packageInfo)) {
    return null
  }

  return (
    <Layout direction="vertical" hPadding={10} vPadding={10} spaceBetween={10}>
      <Layout_Item height={LAYOUT_SIZE_FIT}>
        <Layout>
          <Layout_Item>
            <SizeText>
              Version
            </SizeText>
          </Layout_Item>
          <Layout_Item>
            <SizeText>
              {packageInfo.version}
            </SizeText>
          </Layout_Item>
        </Layout>
      </Layout_Item>
      <Layout_Item height={LAYOUT_SIZE_FIT}>
        <Layout>
          <Layout_Item>
            <SizeText>
              Stability
            </SizeText>
          </Layout_Item>
          <Layout_Item>
            <SizeText>
              {packageInfo.stability}
            </SizeText>
          </Layout_Item>
        </Layout>
      </Layout_Item>
      <Layout_Item height={LAYOUT_SIZE_FIT}>
        <Layout>
          <Layout_Item>
            <SizeText>
              Platform
            </SizeText>
          </Layout_Item>
          <Layout_Item>
            <SizeText>
              {packageInfo.platform}
            </SizeText>
          </Layout_Item>
        </Layout>
      </Layout_Item>
      <Layout_Item height={LAYOUT_SIZE_FIT}>
        <Layout>
          <Layout_Item>
            <SizeText>
              Learn More
            </SizeText>
          </Layout_Item>
          <Layout_Item>
            <LinkThemeProvider>
              <Layout spaceBetween={10} direction="vertical">
                <Layout_Item height={LAYOUT_SIZE_FIT}>
                  <SizeLink target="_blank" href={packageInfo.designDocsUrl} color={theme.linkColor} isUnderlined>
                    Design docs
                  </SizeLink>
                </Layout_Item>
                <Layout_Item height={LAYOUT_SIZE_FIT}>
                  <SizeLink target="_blank" href={packageInfo.sourceCodeUrl} color={theme.linkColor} isUnderlined>
                    Codebase
                  </SizeLink>
                </Layout_Item>
              </Layout>
            </LinkThemeProvider>
          </Layout_Item>
        </Layout>
      </Layout_Item>
    </Layout>
  )
})

Info.displayName = 'Info'
Info.componentSymbol = Symbol('CONTROLS_SIDEBAR_INFO')
