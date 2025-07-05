import { z } from 'zod'

type Cluster = string[]
export type ClusterMapping = { clusters: { [key: string]: Cluster } }

const ClusterResponseSchema = z.object({
  clusters: z.record(z.array(z.string())),
  total_tokens: z.number(),
})

const JiggleAPIErrorSchema = z.object({
  detail: z.string(),
})

export type JiggleAPIError = z.infer<typeof JiggleAPIErrorSchema>

export default class JiggleApiService {
  private static readonly baseUrl = 'http://localhost:8000'
  private static readonly defaultHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }

  private constructor() {}

  // public static async initAuth(code: string, redirectUri: string): Promise<AuthDetails> {
  //   console.log('fetching token with code', code, 'redirectUri', redirectUri)

  //   const url = `${this.baseUrl}/api/token`
  //   const body = {
  //     redirect_uri: redirectUri,
  //     code: code,
  //   }
  //   const response = await fetch(url, {
  //     method: 'POST',
  //     headers: this.defaultHeaders,
  //     body: JSON.stringify(body),
  //     mode: 'cors',
  //   })
  //   const json = await response.json()
  //   console.log('get token response', json)

  //   return {
  //     accessToken: json.access_token,
  //     refreshToken: json.refresh_token,
  //     expiresTimestampInSeconds: json.expires_at,
  //   }
  // }

  // public static async refreshAuthToken(refreshToken: string): Promise<AuthDetails> {
  //   const url = `${this.baseUrl}/api/token/${refreshToken}`
  //   const headers = this.defaultHeaders
  //   const response = await fetch(url, {
  //     method: 'POST',
  //     headers,
  //     mode: 'cors',
  //   })

  //   const json = await response.json()
  //   console.log('refresh token response', json)

  //   return {
  //     accessToken: json.access_token,
  //     refreshToken: json.refresh_token,
  //     expiresTimestampInSeconds: json.expires_at,
  //   }
  // }

  public static async getClusters(genres: string[], nClusters: number): Promise<ClusterMapping | JiggleAPIError> {
    const url = `${JiggleApiService.baseUrl}/api/clusters`

    const requestString = JSON.stringify({ genres: genres, n_clusters: nClusters })
    console.log('requesting clusters with', requestString)

    const response = await fetch(url, {
      method: 'POST',
      headers: this.defaultHeaders,
      mode: 'cors',
      body: requestString,
    })

    const json = await response.json()
    if (!response.ok) {
      console.error('error', json)
      return JiggleAPIErrorSchema.parse(json)
    }

    console.log('get clusters response', json)

    const result = ClusterResponseSchema.parse(json)

    return {
      clusters: result.clusters,
    }
  }
}
