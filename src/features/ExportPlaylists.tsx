import { Button, Col, Input, Row } from 'antd'
import { FC, useEffect, useState } from 'react'
import { PlaylistService } from '../services/playlist-service'
import SpotifyApiService from '../services/spotify-api-service'
import useSpotifyAuthStore from '../stores/authStore'
import usePlaylistStore from '../stores/playlistStore'
import { Spotify } from '../util/constants'
import { PlaylistHandle } from './components/PlaylistHandle'

export const ExportPlaylists: FC = () => {
  const authStore = useSpotifyAuthStore()
  const playlists = usePlaylistStore((state) => state.playlists)

  const [existingPlaylists, setExistingPlaylists] = useState<{ name: string; id: string }[]>([])
  const [newPlaylistPrefix, setNewPlaylistPrefix] = useState<string>('jiggle_')

  useEffect(() => {
    const load = async () => {
      const authDetails = await SpotifyApiService.getUpdatedAuthDetails(authStore.authDetails!, Spotify.clientId, authStore.updateAuth)
      console.log('export playlists authDetails', authDetails)
      const playlists = await SpotifyApiService.getAllUserPlaylists(authStore.userId!, authDetails.accessToken)
      const simplePlaylists = playlists.map((playlist) => ({ name: playlist.name, id: playlist.id, tracks: playlist.tracks }))
      console.log('export playlists playlists', simplePlaylists)
      setExistingPlaylists(simplePlaylists)
    }
    console.log('export playlists effect')
    load()
  }, [])

  const saveAll = async () => {
    const authDetails = await SpotifyApiService.getUpdatedAuthDetails(authStore.authDetails!, Spotify.clientId, authStore.updateAuth)
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

  console.log('playlists', playlists, Object.keys(playlists))

  return (
    <div>
      <h1>Export Playlists</h1>
      <p>existing playlists:</p>
      <ul>
        {existingPlaylists.map((playlistDetails) => (
          <li key={playlistDetails.id}>
            {playlistDetails.name} ({playlistDetails.id})
          </li>
        ))}
      </ul>
      <Button
        onClick={async () => {
          const authDetails = await SpotifyApiService.getUpdatedAuthDetails(authStore.authDetails!, Spotify.clientId, authStore.updateAuth)
          PlaylistService.getPlaylistTracks('6oC24OwBlCdSfQ6NAsC6hk', authDetails.accessToken)
        }}
      >
        Get Playlist Tracks 🐸
      </Button>

      <p>new playlists:</p>
      <p> {Object.keys(playlists).join(', ')} </p>
      <p>Playlist name prefix:</p>
      <Input value={newPlaylistPrefix} onChange={(e) => setNewPlaylistPrefix(e.target.value)} />
      <Button onClick={saveAll}>SAVE ALL 🐸</Button>
      <Row gutter={20}>
        {Object.keys(playlists)
          .sort()
          .map((playlistName: string) => (
            <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
              <PlaylistHandle name={playlistName} content={playlists[playlistName]} />
            </Col>
          ))}
      </Row>
    </div>
  )
}
