import { FC, useEffect, useState } from 'react'
import { PlaylistService } from '../services/playlist-service'
import SpotifyApiService from '../services/spotify-api-service'
import useSpotifyAuthStore from '../stores/authStore'
import usePlaylistStore from '../stores/playlistStore'
import { PlaylistHandle } from './components/PlaylistHandle'

export const ExportPlaylists: FC = () => {
  const authStore = useSpotifyAuthStore()
  const playlists = usePlaylistStore((state) => state.playlists)

  const [existingPlaylists, setExistingPlaylists] = useState<{ name: string; id: string }[]>([])
  const [newPlaylistPrefix, setNewPlaylistPrefix] = useState<string>('jiggle_')

  useEffect(() => {
    const load = async () => {
      const playlists = await SpotifyApiService.getAllUserPlaylists(authStore.userId!, authStore.authDetails!.accessToken)
      const simplePlaylists = playlists.map((playlist) => ({ name: playlist.name, id: playlist.id, tracks: playlist.tracks }))
      setExistingPlaylists(simplePlaylists)
    }

    load()
  }, [])

  const saveAll = async () => {
    const authDetails = authStore.authDetails!
    const userId = authStore.userId!
    for (const [playlistName, tracks] of Object.entries(playlists)) {
      const addTracksInfo = tracks.map((track) => ({ uri: `spotify:track:${track.id}` }))
      const finalName = newPlaylistPrefix + playlistName

      const existingPlaylist = existingPlaylists.find((playlist) => playlist.name === finalName)
      console.log('processing playlist', finalName, 'existing:', existingPlaylist)
      if (existingPlaylist) {
        console.log('playlist already exists', finalName, 'overwriting its content...')
        console.log('getting old tracks')
        const oldTracks = (await PlaylistService.getPlaylistTracks(existingPlaylist.id, authDetails.accessToken)).map((track) => ({
          uri: `spotify:track:${track.id}`,
        }))
        await PlaylistService.overridePlaylist(existingPlaylist.id, '', oldTracks, addTracksInfo, authDetails.accessToken)
      } else {
        console.log('creating new playlist', finalName)
        await PlaylistService.createNewPlaylist(userId, finalName, addTracksInfo, authDetails.accessToken)
      }
    }
  }

  return (
    <div>
      <h1>Export Playlists</h1>
      <p>existing playlists:</p>
      <ul>
        {existingPlaylists.map((playlistDetails) => (
          <li key={playlistDetails.id}>{JSON.stringify(playlistDetails)}</li>
        ))}
      </ul>
      <button
        onClick={() => {
          PlaylistService.getPlaylistTracks('6oC24OwBlCdSfQ6NAsC6hk', authStore.authDetails!.accessToken)
        }}
      >
        Get Playlist Tracks 🐸
      </button>

      <p>new playlists:</p>
      <p> {Object.keys(playlists).join(', ')} </p>
      <p>Playlist name prefix:</p>
      <input value={newPlaylistPrefix} onChange={(e) => setNewPlaylistPrefix(e.target.value)} />
      <button onClick={saveAll}>SAVE ALL 🐸</button>
      <ul>
        {Object.keys(playlists).map((playlistName: string) => (
          <li key={playlistName}>
            <PlaylistHandle name={playlistName} content={playlists[playlistName]} />
          </li>
        ))}
      </ul>
    </div>
  )
}
