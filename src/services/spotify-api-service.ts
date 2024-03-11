import { Buffer } from 'buffer'
import { Schema } from 'zod'
import { AuthDetails } from '../types/SpotifyAuth'
import { GetCurrentUserProfileResponse, GetCurrentUserProfileResponseSchema } from '../types/schemas/GetCurrentUserProfileResponse'
import { GetSeveralAlbumsSchema } from '../types/schemas/GetSeveralAlbums'
import GetSeveralArtistsSchema from '../types/schemas/GetSeveralArtists'
import { GetSeveralTracksSchema } from '../types/schemas/GetSeveralTracks'
import { Album, AlbumSchema, Artist, ArtistSchema, Track } from '../types/schemas/Track'
import { PlaylistTrackObject, UserPlaylistItemsResponseSchema } from '../types/schemas/UserPlaylistItemsResponse'
import { SimplifiedPlaylist, UserPlaylistsResponseSchema } from '../types/schemas/UserPlaylistsResponse'
import UserSavedTracksResponseSchema, { SavedTrackObject, UserSavedTracksResponse } from '../types/schemas/UserSavedTracksResponse'
import { splitIntoBatches } from '../util/util'

export default class SpotifyApiService {
  private static baseUrl = 'https://api.spotify.com/v1'

  private constructor() {}

  public static async initAuth(code: string, redirectUri: string, clientId: string, codeVerifier: string): Promise<AuthDetails> {
    const url = 'https://accounts.spotify.com/api/token'
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
    const body = new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    })
    const nowTimestamp = Math.floor(Date.now() / 1000)

    console.log('fetching token with code', code)

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    })
    const json = await response.json()
    console.log('get token response', json)

    return {
      accessToken: json.access_token,
      refreshToken: json.refresh_token,
      expiresTimestampInSeconds: nowTimestamp + json.expires_in,
    }
  }

  public static async refreshAuthToken(refreshToken: string, clientId: string, clientSecret: string): Promise<AuthDetails> {
    const url = 'https://accounts.spotify.com/api/token'
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(clientId + ':' + clientSecret).toString('base64')}`,
    }
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    })

    const nowTimestamp = Math.floor(Date.now() / 1000)

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    })

    const json = await response.json()
    console.log('refresh token response', json)

    return {
      accessToken: json.access_token,
      refreshToken: refreshToken,
      expiresTimestampInSeconds: nowTimestamp + json.expires_in,
    }
  }

  private static async getDefaultHeaders(accessToken: string) {
    return {
      Authorization: `Bearer ${accessToken}`,
    }
  }

  private static async get<T>(url: string, accessToken: string, type: Schema<T>): Promise<T> {
    const headers = await SpotifyApiService.getDefaultHeaders(accessToken)

    const response = await fetch(url, { headers })
    if (!response.ok) {
      throw new Error(`failed execute request against spotify api ${url} with status ${response.status} and message ${response.statusText}`)
    }

    const json = await response.json()
    console.log('json', json)
    const parsed = type.parse(json)
    return parsed
  }

  public static async getUserDetails(accessToken: string): Promise<GetCurrentUserProfileResponse> {
    const url = `${SpotifyApiService.baseUrl}/me`
    const resp = await SpotifyApiService.get(url, accessToken, GetCurrentUserProfileResponseSchema)
    return resp
  }

  public static async getAllUserSavedTracks(accessToken: string): Promise<SavedTrackObject[]> {
    let offset = 0
    let finished = false

    const tracks: SavedTrackObject[] = []
    while (!finished) {
      const savedTracksResponse = await SpotifyApiService.getUserSavedTracks(offset, accessToken)
      offset += savedTracksResponse.items.length
      finished = !savedTracksResponse.next
      tracks.push(...savedTracksResponse.items)
    }
    return tracks
  }

  public static async getUserSavedTracks(offset: number, accessToken: string): Promise<UserSavedTracksResponse> {
    const url = `${SpotifyApiService.baseUrl}/me/tracks?offset=${offset}`
    const parsed = await SpotifyApiService.get(url, accessToken, UserSavedTracksResponseSchema)
    return parsed
  }

  public static async getArtist(artistId: string, accessToken: string): Promise<Artist> {
    const url = `${SpotifyApiService.baseUrl}/artists/${artistId}`
    const parsed = await SpotifyApiService.get(url, accessToken, ArtistSchema)
    return parsed
  }

  public static async getAlbum(albumId: string, accessToken: string): Promise<Album> {
    const url = `${SpotifyApiService.baseUrl}/albums/${albumId}`
    const parsed = await SpotifyApiService.get(url, accessToken, AlbumSchema)
    return parsed
  }

  public static async getArtists(artistIds: string[], accessToken: string): Promise<Artist[]> {
    const batches = splitIntoBatches(artistIds)

    const artistPromises = batches.map(async (batch) => {
      return SpotifyApiService.getArtistBatch(batch, accessToken)
    })

    const artists = await Promise.all(artistPromises)
    return artists.flat()
  }

  public static async getArtistBatch(artistIds: string[], accessToken: string): Promise<Artist[]> {
    const url = `${SpotifyApiService.baseUrl}/artists?ids=${artistIds.join(',')}`
    const parsed = await SpotifyApiService.get(url, accessToken, GetSeveralArtistsSchema)
    return parsed.artists
  }

  public static async getAlbums(albumIds: string[], accessToken: string): Promise<Album[]> {
    const batches = splitIntoBatches(albumIds)

    const albumPromises = batches.map(async (batch) => {
      return SpotifyApiService.getAlbumBatch(batch, accessToken)
    })

    const albums = await Promise.all(albumPromises)
    return albums.flat()
  }

  public static async getAlbumBatch(albumIds: string[], accessToken: string): Promise<Album[]> {
    const url = `${SpotifyApiService.baseUrl}/albums?ids=${albumIds.join(',')}`
    const parsed = await SpotifyApiService.get(url, accessToken, GetSeveralAlbumsSchema)
    return parsed.albums
  }

  public static async getTracks(trackIds: string[], accessToken: string): Promise<Track[]> {
    const batches = splitIntoBatches(trackIds, 50)

    const trackPromises = batches.map(async (batch) => {
      return SpotifyApiService.getTrackBatch(batch, accessToken)
    })

    const tracks = await Promise.all(trackPromises)
    return tracks.flat()
  }

  public static async getTrackBatch(trackIds: string[], accessToken: string): Promise<Track[]> {
    const url = `${SpotifyApiService.baseUrl}/tracks?ids=${trackIds.join(',')}`
    const parsed = await SpotifyApiService.get(url, accessToken, GetSeveralTracksSchema)
    return parsed.tracks
  }

  public static async getAllUserPlaylists(userId: string, accessToken: string): Promise<SimplifiedPlaylist[]> {
    console.log('getting all user playlists for', userId)
    const url = `${SpotifyApiService.baseUrl}/users/${userId}/playlists`

    const playlists: SimplifiedPlaylist[] = []
    const intResp = await SpotifyApiService.get(url, accessToken, UserPlaylistsResponseSchema)
    playlists.push(...intResp.items)

    let nextUrl = intResp.next
    while (nextUrl) {
      const resp = await SpotifyApiService.get(nextUrl, accessToken, UserPlaylistsResponseSchema)
      playlists.push(...resp.items)
      nextUrl = resp.next
    }
    return playlists
  }

  public static async createPlaylist(userId: string, name: string, accessToken: string) {
    const url = `${SpotifyApiService.baseUrl}/users/${userId}/playlists`
    const headers = await SpotifyApiService.getDefaultHeaders(accessToken)
    const body = JSON.stringify({ name: name })
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    })
    const responseBody = await response.json()
    return responseBody
  }

  public static async deleteTracksFromPlaylist(playlistId: string, tracks: { uri: string }[], accessToken: string) {
    const url = `${SpotifyApiService.baseUrl}/playlists/${playlistId}/tracks`
    const headers = await SpotifyApiService.getDefaultHeaders(accessToken)
    const body = JSON.stringify({ tracks: tracks })
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
      body,
    })
    const responseBody = await response.json()
    console.log('delete response', response, responseBody)

    return responseBody
  }

  public static async addTracksToPlaylist(playlistId: string, tracks: { uri: string }[], accessToken: string) {
    const url = `${SpotifyApiService.baseUrl}/playlists/${playlistId}/tracks`
    const headers = await SpotifyApiService.getDefaultHeaders(accessToken)
    const body = JSON.stringify({ uris: tracks.map((track) => track.uri) })
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
      mode: 'cors',
    })
    const responseBody = await response.json()
    console.log('add response', responseBody)
    return responseBody
  }

  public static async getPlaylistContent(playlistId: string, accessToken: string) {
    const baseUrl = `${SpotifyApiService.baseUrl}/playlists/${playlistId}/tracks`

    // filtering seems annoying
    //const searchParams = new URLSearchParams({ fields: 'items(track(name,id,href))', limit: '100' })
    //const fullUrl = `${baseUrl}?${searchParams.toString()}`

    const playlistTracks: { name: string; id: string; href: string }[] = []
    const firstResponse = await SpotifyApiService.get(baseUrl, accessToken, UserPlaylistItemsResponseSchema)

    const extractInfo = (item: PlaylistTrackObject) => ({ name: item.track.name, id: item.track.id, href: item.track.href })

    playlistTracks.push(...firstResponse.items.map(extractInfo))

    let nextUrl = firstResponse.next
    while (nextUrl) {
      const resp = await SpotifyApiService.get(nextUrl, accessToken, UserPlaylistItemsResponseSchema)
      playlistTracks.push(...resp.items.map(extractInfo))
      nextUrl = resp.next
    }
    return playlistTracks
  }
}
