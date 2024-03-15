import { Box } from '@mui/material'
import { FC, PropsWithChildren } from 'react'

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return <Box sx={{ maxWidth: '1400px', marginLeft: 'auto', marginRight: 'auto' }}>{children}</Box>
}
