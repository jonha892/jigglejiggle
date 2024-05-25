import { ConfigProvider } from 'antd'

import { FC, PropsWithChildren } from 'react'

export const App: FC<PropsWithChildren> = ({ children }) => {
  return <ConfigProvider>{children}</ConfigProvider>
}
