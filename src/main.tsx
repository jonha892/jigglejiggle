import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { App } from './App'
import { AuthCallback } from './features/AuthCallback'
import { ExportPlaylists } from './features/ExportPlaylists'
import { Home } from './features/Home'
import PrivateRoute from './features/PrivateRoute'
import { Test } from './features/Test'
import { Welcome } from './features/Welcome'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Welcome />,
  },
  {
    path: '/test',
    element: <Test />,
  },
  {
    path: '/auth-callback',
    element: <AuthCallback />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/playlists',
        element: <ExportPlaylists />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  //<React.StrictMode>
  <App>
    <RouterProvider router={router} />
  </App>
  //</React.StrictMode>
)
