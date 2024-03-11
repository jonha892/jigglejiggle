import { create } from 'zustand'
import { LocalStorageService } from '../services/localstorage-service'
import { AuthDetails } from '../types/SpotifyAuth'

type AuthState = {
  authDetails: AuthDetails | null
  userId: string | null
}

type AuthActions = {
  initSession: (details: AuthDetails, userId: string) => void
  updateAuth: (details: AuthDetails) => void
  isLoggedIn: () => boolean
  //init: (authCode: string) => void
}

const localstorage_auth_details_key = 'session_auth_details'
const localstorage_user_id_key = 'session_user_id'

const useSpotifyAuthStore = create<AuthState & AuthActions>((set, get) => ({
  authDetails: LocalStorageService.loadItem<AuthDetails>(localstorage_auth_details_key),
  userId: LocalStorageService.loadItem<string>('session_user_id'),

  initSession: (details: AuthDetails, userId: string) => {
    set({ authDetails: { ...details }, userId })
    LocalStorageService.saveItem(localstorage_auth_details_key, details)
    LocalStorageService.saveItem(localstorage_user_id_key, userId)
  },
  updateAuth: (details: AuthDetails) => {
    set({ authDetails: { ...details } })
    LocalStorageService.saveItem(localstorage_auth_details_key, details)
  },
  isLoggedIn: () => {
    return get().authDetails !== null && get().authDetails!.accessToken !== undefined
  },
  //init: async (authCode: string) => {
  //    const newDetails = await SpotifyApiService.initAuth(authCode, Spotify.redirectUri + '/auth-callback', Spotify.clientId, Spotify.clientSecret);
  //    const user = await SpotifyApiService.getUserDetails(newDetails.accessToken);
  //    console.log("user details", user);
  //    set({ authDetails: newDetails, userId: user.id });
  //}
}))

export default useSpotifyAuthStore
