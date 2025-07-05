import { z } from 'zod'
import { TrackSchema } from './Track'

const EpisodeObjectSchema = z.object({
  href: z.string(),
  id: z.string(),
  name: z.string(),
})

const PlaylistTrackObjectSchema = z.object({
  track: TrackSchema.or(EpisodeObjectSchema),
})

const UserPlaylistItemsResponseSchema = z.object({
  href: z.string(),
  limit: z.number(),
  next: z.string().nullable(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number(),
  items: z.array(PlaylistTrackObjectSchema),
})

export type PlaylistTrackObject = z.infer<typeof PlaylistTrackObjectSchema>
export type UserPlaylistItemsResponse = z.infer<typeof UserPlaylistItemsResponseSchema>
export { UserPlaylistItemsResponseSchema }
