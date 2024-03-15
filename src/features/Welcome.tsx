import DoneIcon from '@mui/icons-material/Done'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import useSpotifyAuthStore from '../stores/authStore'
import { base64encode, generateRandomString, sha256 } from '../types/SpotifyAuth'
import { Spotify } from '../util/constants'

export const Welcome: React.FC = () => {
  const authStore = useSpotifyAuthStore()

  const connectWithSpotify = async () => {
    const redirectUri = Spotify.redirectUri + '/auth-callback'

    const codeVerifier = generateRandomString(64)
    window.localStorage.setItem('session_codeVerifier', codeVerifier)
    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64encode(hashed)

    const params = {
      response_type: 'code',
      client_id: Spotify.clientId,
      scope: Spotify.scopes,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
    }

    const url = new URL('https://accounts.spotify.com/authorize')
    url.search = new URLSearchParams(params).toString()
    window.location.href = url.toString()
  }

  const navigate = useNavigate()

  return (
    <div>
      <h1>Welcome</h1>
      <p>Spotify-connected: {authStore.isLoggedIn() ? <DoneIcon /> : <ErrorOutlineIcon />} </p>
      {<p>Click the button below to connect with Spotify</p>}
      {<Button onClick={connectWithSpotify}>Connect</Button>}
      {authStore.isLoggedIn() && <Button onClick={() => navigate('home')}>Home</Button>}
    </div>
  )
}
