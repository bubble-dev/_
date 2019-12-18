import React, { Fragment } from 'react'
import { component, startWithType, mapHandlers, mapState, mapContext } from 'refun'
import nanoid from 'nanoid'
import { Layout, Layout_Item, Layout_Spacer } from '../layout'
import { LayoutContext } from '../layout-context'
import { LAYOUT_SIZE_FIT } from '../../symbols'
import { NotificationContext } from './NotificationContext'
import { NotificationItem } from './NotificationItem'

const NOTIFICATION_WIDTH = 360

type TNotification = {
  id: string,
  message: string,
}

export type TNotificationProvider = {}

export const NotificationProvider = component(
  startWithType<TNotificationProvider>(),
  mapState('notifications', 'setNotifications', () => [] as TNotification[], []),
  mapContext(LayoutContext),
  mapHandlers({
    sendNotification: ({ notifications, setNotifications }) => (message: string) => {
      setNotifications(
        notifications.concat({
          id: nanoid(),
          message,
        })
      )
    },
    onItemClose: ({ notifications, setNotifications }) => (id: string) => {
      setNotifications(
        notifications.filter((notification) => id !== notification.id)
      )
    },
  })
)(({
  sendNotification,
  notifications,
  children,
  onItemClose,
}) => (
  <Fragment>
    <NotificationContext.Provider value={{ sendNotification }}>
      {children}
    </NotificationContext.Provider>
    <Layout hPadding={10} vPadding={10}>
      <Layout_Spacer/>
      <Layout_Item width={NOTIFICATION_WIDTH}>
        <Layout direction="vertical">
          <Layout_Spacer/>
          <Layout_Item height={LAYOUT_SIZE_FIT}>
            <Layout direction="vertical" spaceBetween={10}>
              {notifications.map(({ id, message }) => (
                <Layout_Item id={id} key={id}>
                  <NotificationItem id={id} onClose={onItemClose}>
                    {message}
                  </NotificationItem>
                </Layout_Item>
              ))}
            </Layout>
          </Layout_Item>
        </Layout>
      </Layout_Item>
    </Layout>
  </Fragment>
))
