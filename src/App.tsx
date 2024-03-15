import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import { FC, PropsWithChildren } from 'react'
import { Layout } from './features/components/Layout'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

export const App: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Layout>{children}</Layout>
    </ThemeProvider>
  )
}
