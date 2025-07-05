import { Button, Col, Collapse, Flex, List, Modal, Row, Slider, Spin, Statistic, Typography } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import JiggleApiService, { ClusterMapping } from '../services/jiggle-api-service'
import SpotifyApiService from '../services/spotify-api-service'
import useSpotifyAuthStore from '../stores/authStore'
import { useMusicStore } from '../stores/musicStore'
import usePlaylistStore, { PlaylistTrackInfo, Playlists } from '../stores/playlistStore'
import { Artist } from '../types/schemas/Track'
import { SavedTrackObject } from '../types/schemas/UserSavedTracksResponse'
import { Spotify } from '../util/constants'

import { LoadingOutlined } from '@ant-design/icons'
import CountUp from 'react-countup'

const statisticFormatter = (value: number | string) => <CountUp end={value as number} separator="," />

function buildPlaylists(
  tracks: SavedTrackObject[],
  artists: Artist[],
  mapping: ClusterMapping
): { playlists: Playlists; tracksWithoutPlaylist: SavedTrackObject[] } {
  const reversedClusterMapping = new Map<string, string>()
  for (const [clusterName, genres] of Object.entries(mapping.clusters)) {
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

function getGenres(artists: Artist[]): string[] {
  const genres = new Set<string>()
  artists.forEach((artist) => {
    artist.genres?.forEach((genre) => {
      genres.add(genre)
    })
  })
  return Array.from(genres)
}

export const Home: React.FC = () => {
  const authStore = useSpotifyAuthStore()
  const setPlaylists = usePlaylistStore((state) => state.setPlaylists)

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [n_clusters, setNClusters] = useState(5)

  const musicStore = useMusicStore()
  const localstorageCacheDate = musicStore.localstorageCacheDate
  const [genres, setGenres] = useState<string[]>(getGenres(musicStore.artists))

  const loadFavoriteSongs = async () => {
    const authDetails = authStore.authDetails

    const newDetails = await SpotifyApiService.getUpdatedAuthDetails(authDetails!, Spotify.clientId, authStore.updateAuth)
    authStore.updateAuth(newDetails)
    const loadedSavedTracks = await SpotifyApiService.getAllUserSavedTracks(newDetails.accessToken)
    musicStore.updateTracks(loadedSavedTracks)

    return loadedSavedTracks
  }

  const loadArtists = async (artistIds: string[]) => {
    const authDetails = authStore.authDetails

    const newDetails = await SpotifyApiService.getUpdatedAuthDetails(authDetails!, Spotify.clientId, authStore.updateAuth)
    authStore.updateAuth(newDetails)
    const loadedArtists = await SpotifyApiService.getArtists(artistIds, newDetails.accessToken)
    musicStore.updateArtists(loadedArtists)

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

    const genres = getGenres(artists)
    setGenres(Array.from(genres))
    setLoading(false)
  }

  const generateClusters = async () => {
    setLoading(true)
    console.log('loading clusters for', genres.length, 'genres')
    try {
      const r = await JiggleApiService.getClusters(genres, n_clusters)
      if ('detail' in r) {
        setLoading(false)
        setErrorMessage(r.detail)
        setErrorOpen(true)
        return
      }

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
      <Modal
        title="Error"
        open={errorOpen}
        onOk={() => {
          setErrorOpen(false)
        }}
        onCancel={() => {
          setErrorOpen(false)
        }}
      >
        <p>Some error occurred: {errorMessage}</p>
      </Modal>
      <h1>Home</h1>
      <Flex justify="space-around">
        <Statistic title="Data from" loading={loading} value={localstorageCacheDate ? new Date(localstorageCacheDate!).toLocaleString() : '-'} />
        <Statistic title="# Songs" loading={loading} value={musicStore.favoriteTracks.length} formatter={statisticFormatter} />
        <Statistic title="# Artists" loading={loading} value={musicStore.artists.length} formatter={statisticFormatter} />
        <Statistic title="# Genres" loading={loading} value={genres.length} formatter={statisticFormatter} />
      </Flex>
      <Row>
        <Col span={8}></Col>
        <Col span={5}></Col>
        <Col span={8}></Col>
      </Row>

      {loading && <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />}
      <Button onClick={loadAll} disabled={loading}>
        Load Data
      </Button>

      <Row>
        <Col span={8}>
          <p># Clusters: {n_clusters}</p>
        </Col>
        <Col span={16}>
          <Slider min={2} max={15} aria-label="cluser-slider" value={n_clusters} onChange={(newValue: number) => setNClusters(newValue)} disabled={loading} />
        </Col>
      </Row>
      <Button onClick={generateClusters} disabled={genres.length === 0 || loading}>
        Generate Clusters
      </Button>

      {genres && genres.length > 0 && (
        <>
          <Collapse
            items={[
              {
                key: '1',
                label: 'Your Genres',
                children: (
                  <List
                    dataSource={genres}
                    renderItem={(item) => (
                      <List.Item>
                        <Typography.Text>{item}</Typography.Text>
                      </List.Item>
                    )}
                  ></List>
                ),
              },
            ]}
          ></Collapse>
        </>
      )}
    </div>
  )
}
