import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SpotifyApiService from '../services/spotify-api-service'
import useSpotifyAuthStore from '../stores/authStore'
import { Spotify } from '../util/constants'

export const AuthCallback: React.FC = () => {
  const authStore = useSpotifyAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const performInit = async (authCode: string) => {
      const codeVerifier = window.localStorage.getItem('session_codeVerifier')
      console.log('codeVerifier', codeVerifier)
      const authDetails = await SpotifyApiService.initAuth(authCode, Spotify.redirectUri + '/auth-callback', Spotify.clientId, codeVerifier!)
      console.log('authDetails', authDetails)
      const user = await SpotifyApiService.getUserDetails(authDetails.accessToken)
      authStore.initSession(authDetails, user.id)
      navigate('/home')
    }

    const params = new URLSearchParams(window.location.search)
    if (params.has('code')) {
      console.log('code', params.get('code'))

      const code = params.get('code')!
      performInit(code)
    }
  }, [])

  return (
    <div>
      <h1>Auth Callback</h1>
    </div>
  )
}
