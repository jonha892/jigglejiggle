import { create } from 'zustand';
import { Artist } from '../types/schemas/Track';
import { SavedTrackObject } from '../types/schemas/UserSavedTracksResponse';

type State = {
  favoriteTracks: SavedTrackObject[]
  artists: Artist[]
}

type Action = {
  updateTracks: (tracks: SavedTrackObject[]) => void
  updateArtists: (artists: Artist[]) => void
}

const useMusicStore = create<State & Action>((set, get) => ({
  favoriteTracks: [],
  artists: [],

  updateTracks: (tracks: SavedTrackObject[]) => {
    set({ favoriteTracks: tracks });
  },
  updateArtists: (artists: Artist[]) => {
    set({ artists: artists });
  }
}))

export { useMusicStore };
