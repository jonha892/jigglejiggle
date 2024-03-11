import { create } from "zustand"
import { LocalStorageService } from "../services/localstorage-service"

export type PlaylistTrackInfo = {
  name: string,
  id: string
  href: string
}

export type Playlists = { [key: string]: PlaylistTrackInfo[] }

type State = {
  playlists: { [key: string]: PlaylistTrackInfo[]}
  count: number
}

type Actions = {
  setPlaylists: (playlists: Playlists) => void
  renamePlaylist: (oldName: string, newName: string) => void
  addCount: () => void
}


const usePlaylistStore = create<State & Actions>((set, get) => ({
  playlists: LocalStorageService.loadItem<Playlists>('playlists') || {},
  count: 0,
  setPlaylists: (playlists: Playlists ) => {
    set({ playlists })
    LocalStorageService.saveItem('playlists', JSON.stringify(playlists))
  },
  renamePlaylist: (oldName: string, newName: string) => 
    set(state => {
      const newPlaylists = {...state.playlists}
      if (oldName in newPlaylists && !(newName in newPlaylists)) {
        const content = newPlaylists[oldName]
        delete newPlaylists[oldName]
        newPlaylists[newName] = content
        LocalStorageService.saveItem('playlists', newPlaylists)
      }
      return { playlists: newPlaylists }
    })
  ,
  addCount: () => {
    set((state) => ({ count: state.count + 1 }))
  }
}))

export default usePlaylistStore
export const usePlaylists = () => usePlaylistStore((state) => state.playlists)