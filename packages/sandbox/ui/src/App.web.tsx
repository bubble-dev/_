import React, { FC } from 'react'
import { Root } from './components/root'
import { ThemeProvider } from './components/theme-provider'
import { Sandbox } from './components/sandbox'
import { StoreProvider } from './store'
import { TApp } from './types'
import { NotificationProvider } from './components/notification-provider'
import { AlertProvider } from './components/alert-provider'
import { PortalProvider } from './components/portal-provider'

export const App: FC<TApp> = ({ components, theme, copyImportPackageName, plugin }) => (
  <Root>
    <StoreProvider>
      <ThemeProvider theme={theme}>
        <AlertProvider>
          <NotificationProvider>
            <PortalProvider>
              <Sandbox
                components={components}
                copyImportPackageName={copyImportPackageName}
                plugin={plugin}
              />
            </PortalProvider>
          </NotificationProvider>
        </AlertProvider>
      </ThemeProvider>
    </StoreProvider>
  </Root>
)

// const MyText = component(
//   startWithType<{}>(),
//   mapState('state', 'setState', () => false, []),
//   mapWithProps(({ state }) => ({
//     content: state ? 'as da sd as as as as da sd as da sd as sd as ds ad as da sd' : 'ad as da sd',
//   })),
//   mapHandlers({
//     onPress: ({ state, setState }) => () => {
//       setState(!state)
//     },
//   })
// )(({ content, onPress }) => (
//   <Button onPress={onPress}>
//     <SizeContent>
//       <Text>
//         {content}
//       </Text>
//     </SizeContent>
//   </Button>
// ))

// const MyItem = component(
//   startWithType<{ color: TColor }>(),
//   mapState('state', 'setState', () => true, []),
//   mapWithProps(({ state }) => ({
//     width: state ? 50 : 150,
//   })),
//   mapHandlers({
//     onPress: ({ state, setState }) => () => {
//       setState(!state)
//     },
//   })
// )(({ color, width, onPress }) => (
//   <Layout>
//     <Layout_Item width={width}>
//       <Button onPress={onPress}>
//         <Background color={color}/>
//       </Button>
//     </Layout_Item>
//   </Layout>
// ))

// MyItem.componentSymbol = SYMBOL_LAYOUT_ITEM

// export const App = () => (
//   <Root>
//     <ThemeProvider>
//       <PortalProvider>
//         <Layout direction="horizontal">
//           <Background color={[255, 0, 0, 0.2]}/>

//           <Layout_Item width={LAYOUT_SIZE_FIT}>
//             <MyItem color={[0, 255, 0, 0.2]}/>
//           </Layout_Item>

//           <Layout_Item width={LAYOUT_SIZE_3} hAlign="right">
//             <Layout direction="horizontal">

//               <Layout_Item vAlign="center">
//                 <Background color={[255, 0, 0, 0.5]}/>
//                 <MyText/>
//               </Layout_Item>

//               <Layout_Item vAlign="center">
//                 <Background color={[255, 255, 0, 0.5]}/>
//                 <MyText/>
//               </Layout_Item>

//               <Layout_Item width={LAYOUT_SIZE_FIT} height={LAYOUT_SIZE_FIT}>
//                 <Background color={[255, 0, 255, 0.5]}/>
//                 <SizeContent shouldPreventWrap>
//                   <Text>
//                     |||
//                   </Text>
//                 </SizeContent>
//               </Layout_Item>

//               <Layout_Item vAlign="center">
//                 <Background color={[0, 255, 255, 0.5]}/>
//                 <MyText/>
//               </Layout_Item>

//               <Layout_Item vAlign="center">
//                 <Background color={[0, 255, 0, 0.5]}/>
//                 <MyText/>
//               </Layout_Item>

//             </Layout>
//           </Layout_Item>
//           <Layout_Item>
//             <Background color={[0, 255, 0, 0.2]}/>
//           </Layout_Item>
//         </Layout>
//       </PortalProvider>
//     </ThemeProvider>
//   </Root>
// )
