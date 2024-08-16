import { Navigate, Outlet } from 'react-router-dom'
import useSpotifyAuthStore from '../stores/authStore'

const PrivateRoute = () => {
  const isLoggedIn = useSpotifyAuthStore().isLoggedIn()

  console.log('private route', isLoggedIn)

  return isLoggedIn ? <Outlet /> : <Navigate to="/" />
}

export default PrivateRoute
