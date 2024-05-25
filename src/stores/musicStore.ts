import { create } from 'zustand'
import { LocalStorageService } from '../services/localstorage-service'
import { Artist } from '../types/schemas/Track'
import { SavedTrackObject } from '../types/schemas/UserSavedTracksResponse'

type State = {
  favoriteTracks: SavedTrackObject[]
  localstorageCacheDate: number | null
  artists: Artist[]
}

type Action = {
  updateTracks: (tracks: SavedTrackObject[]) => void
  updateArtists: (artists: Artist[]) => void
}

const initFavoriteTracks = () => {
  const storedTracks = LocalStorageService.loadItem<SavedTrackObject[]>('favoriteTracks')
  return storedTracks || []
}

const initFavoriteTracksDate = () => {
  const storedDate = LocalStorageService.loadItem<number>('localstorageCacheDate')
  return storedDate || null
}

const initArtists = () => {
  const storedArtists = LocalStorageService.loadItem<Artist[]>('artists')
  return storedArtists || []
}

const useMusicStore = create<State & Action>((set, get) => ({
  favoriteTracks: initFavoriteTracks(),
  localstorageCacheDate: initFavoriteTracksDate(),
  artists: initArtists(),

  updateTracks: (tracks: SavedTrackObject[]) => {
    localStorage.setItem('favoriteTracks', JSON.stringify(tracks))
    const now = Date.now()
    localStorage.setItem('localstorageCacheDate', JSON.stringify(now))
    set({ localstorageCacheDate: now })
    set({ favoriteTracks: tracks })
  },
  updateArtists: (artists: Artist[]) => {
    localStorage.setItem('artists', JSON.stringify(artists))
    const now = Date.now()
    localStorage.setItem('localstorageCacheDate', JSON.stringify(now))
    set({ localstorageCacheDate: now })
    set({ artists: artists })
  },
}))

export { useMusicStore }
