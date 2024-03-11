import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import JiggleApiService, { ClusterMapping } from '../services/jiggle-api-service'
import SpotifyApiService from '../services/spotify-api-service'
import useSpotifyAuthStore from '../stores/authStore'
import { useMusicStore } from '../stores/musicStore'
import usePlaylistStore, { PlaylistTrackInfo, Playlists } from '../stores/playlistStore'
import { AuthDetails } from '../types/SpotifyAuth'
import { Artist } from '../types/schemas/Track'
import { SavedTrackObject } from '../types/schemas/UserSavedTracksResponse'
import { Spotify } from '../util/constants'

async function getAccessToken(authDetails: AuthDetails): Promise<AuthDetails> {
  if (authDetails.accessToken === '') {
    throw Error('No access token')
  }
  console.log('authDetails', authDetails)

  const now = Math.floor(Date.now() / 1000)
  if (now > authDetails.expiresTimestampInSeconds - 60) {
    const newDetails = await SpotifyApiService.refreshAuthToken(authDetails.refreshToken, Spotify.clientId, Spotify.clientSecret)
    return newDetails
  }
  return authDetails
}

function buildPlaylists(
  tracks: SavedTrackObject[],
  artists: Artist[],
  mapping: ClusterMapping
): { playlists: Playlists; tracksWithoutPlaylist: SavedTrackObject[] } {
  const reversedClusterMapping = new Map<string, string>()
  for (const [clusterName, genres] of Object.entries(mapping)) {
    for (const genre of genres) {
      reversedClusterMapping.set(genre, clusterName)
    }
  }
  console.log('reversedClusterMapping', reversedClusterMapping)

  const artistIdGenreMapping = new Map<string, string[]>()
  artists.forEach((artist) => {
    artistIdGenreMapping.set(artist.id, artist.genres || [])
  })
  //console.log('artistGenreMapping', artistIdGenreMapping)

  const tracksWithoutPlaylist = []
  const playlists: Playlists = {}
  for (const track of tracks) {
    const artistIds = track.track.artists?.map((artist) => artist.id) || []
    if (artistIds.length === 0) {
      tracksWithoutPlaylist.push(track)
      continue
    }

    const genres = new Set<string>()
    for (const artistId of artistIds) {
      const artistGenres = artistIdGenreMapping.get(artistId)
      if (artistGenres) {
        artistGenres.forEach((genre) => genres.add(genre))
      }
      //console.log('genres', genres)
    }

    const clustersForTrack = Array.from(genres)
      .map((genre) => reversedClusterMapping.get(genre))
      .filter((x) => x !== undefined) as string[]

    // filter unique cluster names, add track to all clusters
    const matchingClusters = clustersForTrack.filter((value, index, self) => self.indexOf(value) === index)

    const trackInfo: PlaylistTrackInfo = { name: track.track.name, id: track.track.id, href: track.track.href }
    for (const clusterName of matchingClusters) {
      if (clusterName in playlists) {
        playlists[clusterName].push(trackInfo)
      } else {
        playlists[clusterName] = [trackInfo]
      }
    }
  }
  return {
    playlists,
    tracksWithoutPlaylist,
  }
}

export const Home: React.FC = () => {
  const authStore = useSpotifyAuthStore()
  const musicStore = useMusicStore()
  const setPlaylists = usePlaylistStore((state) => state.setPlaylists)

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [genres, setGenres] = useState<string[]>([])

  const loadFavoriteSongs = async () => {
    const authDetails = authStore.authDetails

    const newDetails = await getAccessToken(authDetails!)
    authStore.updateAuth(newDetails)
    const loadedSavedTracks = await SpotifyApiService.getAllUserSavedTracks(newDetails.accessToken)
    musicStore.updateTracks(loadedSavedTracks)
    window.localStorage.setItem('savedTracks', JSON.stringify(loadedSavedTracks))

    return loadedSavedTracks
  }

  const loadArtists = async (artistIds: string[]) => {
    const authDetails = authStore.authDetails

    const newDetails = await getAccessToken(authDetails!)
    authStore.updateAuth(newDetails)
    const loadedArtists = await SpotifyApiService.getArtists(artistIds, newDetails.accessToken)
    musicStore.updateArtists(loadedArtists)
    window.localStorage.setItem('artists', JSON.stringify(loadedArtists))

    return loadedArtists
  }

  const loadAll = async () => {
    setLoading(true)
    const songs = await loadFavoriteSongs()

    const artistIds = new Set<string>()
    songs.forEach((track) => {
      track.track.artists?.forEach((artist) => {
        if (artist.id) {
          artistIds.add(artist.id)
        }
      })
    })

    const artists = await loadArtists([...artistIds])
    const genres = new Set<string>()
    artists.forEach((artist) => {
      artist.genres?.forEach((genre) => {
        genres.add(genre)
      })
    })
    setGenres(Array.from(genres))
    setLoading(false)
  }

  const generateClusters = async () => {
    setLoading(true)
    console.log('loading clusters for', genres.length, 'genres')
    try {
      const r = await JiggleApiService.getClusters(genres)
      console.log('clusters', r)

      console.log('building playlists')
      const { playlists, tracksWithoutPlaylist } = buildPlaylists(musicStore.favoriteTracks, musicStore.artists, r)
      console.log('playlists', playlists)
      console.log('tracksWithoutPlaylist', tracksWithoutPlaylist)
      setPlaylists(playlists)
      setLoading(false)
      navigate('/playlists')
    } catch (e) {
      console.error('error', e)
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Home</h1>
      <p>Spotify-connected: {authStore.isLoggedIn() ? 'connected' : 'not connected'} </p>
      <p>Loaded favorite songs: {musicStore.favoriteTracks.length}</p>
      <p>Loaded Artists: {musicStore.artists.length}</p>
      <p>Loaded Genres: {genres.length} </p>
      {loading && <p>Loading...</p>}
      <button onClick={loadAll} disabled={loading}>
        Load Data
      </button>
      <button onClick={generateClusters} disabled={genres.length === 0 || loading}>
        Generate Clusters
      </button>

      <p>Genres:</p>
      <ul>
        {genres.map((genre) => (
          <li key={genre}>{genre}</li>
        ))}
      </ul>
    </div>
  )
}
