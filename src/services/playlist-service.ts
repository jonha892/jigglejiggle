import { splitIntoBatches } from "../util/util";
import SpotifyApiService from "./spotify-api-service";



export class PlaylistService {


  private constructor() {}

  public static async createNewPlaylist(userId: string, name: string, tracks: { uri: string }[], access_token: string) {
    const playlist = await SpotifyApiService.createPlaylist(userId, name, access_token)
    await SpotifyApiService.addTracksToPlaylist(playlist.id, tracks, access_token)
  }

  public static async overridePlaylist(
    id: string,
    snapshotId: string,
    oldTracks: { uri: string }[],
    newTracks: { uri: string }[],
    access_token: string
  ) {
    console.log('deleting old tracks')
    const deleteBatches = splitIntoBatches(oldTracks, 100)
    for (const batch of deleteBatches) {
      await SpotifyApiService.deleteTracksFromPlaylist(id, batch, access_token)
    }

    console.log('adding new tracks')
    const addBatches = splitIntoBatches(newTracks, 100)
    for (const batch of addBatches) {
      await SpotifyApiService.addTracksToPlaylist(id, batch, access_token)
    }
  }

  public static async getPlaylistTracks(playlistId: string, accessToken: string) {
    console.log('getting playlist tracks', playlistId)
    const tracks = await SpotifyApiService.getPlaylistContent(playlistId, accessToken)
    console.log('tracks', tracks)
    return tracks
  }

}