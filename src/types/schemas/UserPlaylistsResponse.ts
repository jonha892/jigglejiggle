import { z } from 'zod'
import { ExternalSpotifyUrlSchema } from './ExternalSpotifyUrls'

const SimplifiedPlaylistSchema = z.object({
  collaborative: z.optional(z.boolean()),
  description: z.optional(z.string()),
  external_urls: z.optional(ExternalSpotifyUrlSchema),
  href: z.optional(z.string()),
  id: z.string(),
  images: z
    .array(
      z.object({
        url: z.string(),
        height: z.number().nullable(),
        width: z.number().nullable(),
      })
    )
    .nullable(),
  name: z.string(),
  owner: z.optional(
    z.object({
      external_urls: z.optional(ExternalSpotifyUrlSchema),
      followers: z.optional(
        z.object({
          href: z.optional(z.string().nullable()),
          total: z.optional(z.number()),
        })
      ),
      href: z.optional(z.string()),
      id: z.optional(z.string()),
      type: z.optional(z.enum(['user'])),
      uri: z.optional(z.string()),
      display_name: z.optional(z.string().nullable()),
    })
  ),
  public: z.optional(z.boolean()),
  snapshot_id: z.optional(z.string()),
  tracks: z.object({
    href: z.string(),
    total: z.number(),
  }),
  type: z.optional(z.enum(['playlist'])),
  uri: z.optional(z.string()),
})

const UserPlaylistsResponseSchema = z.object({
  href: z.string(),
  limit: z.number(),
  next: z.string().nullable(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number(),
  items: z.array(SimplifiedPlaylistSchema),
})

export type UserPlaylistResponse = z.infer<typeof UserPlaylistsResponseSchema>
export type SimplifiedPlaylist = z.infer<typeof SimplifiedPlaylistSchema>

export { UserPlaylistsResponseSchema }
