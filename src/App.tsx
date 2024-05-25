import { ConfigProvider } from 'antd'

import { FC, PropsWithChildren } from 'react'
import { Layout } from './features/components/Layout'

export const App: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ConfigProvider>
      <Layout>{children}</Layout>
    </ConfigProvider>
  )
}
