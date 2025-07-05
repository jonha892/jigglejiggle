import { z } from 'zod'

const SimplifiedPlaylistSchema = z.object({
  id: z.string(),
  name: z.string(),
  tracks: z.object({
    href: z.string(),
    total: z.number(),
  }),
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
