import { z } from 'zod'
import { ImageObjectSchema } from './Images'
import { TrackSchema } from './Track'


const EpisodeObjectSchema = z.object({
  audio_preview_url: z.string().nullable(),
  description: z.string(),
  html_description: z.string(),
  duration_ms: z.number(),
  explicit: z.boolean(),
  external_urls: z.object({
    spotify: z.string()
  }),
  href: z.string(),
  id: z.string(),
  images: z.array(ImageObjectSchema),
  is_externally_hosted: z.boolean(),
  is_playable: z.boolean(),
  language: z.string(),
  languages: z.array(z.string()),
  name: z.string(),
  release_date: z.string(),
  release_date_precision: z.string(),
  resume_point: z.object({
    fully_played: z.boolean(),
    resume_position_ms: z.number()
  }),
  type: z.string(),
  uri: z.string(),
  restrictions: z.object({
    reason: z.string()
  }).optional(),
  show: z.object({
    available_markets: z.array(z.string()),
    copyrights: z.array(z.object({
      text: z.string(),
      type: z.string()
    })),
    description: z.string(),
    html_description: z.string(),
    explicit: z.boolean(),
    external_urls: z.object({
      spotify: z.string()
    }),
    href: z.string(),
    images: z.array(ImageObjectSchema),
    is_externally_hosted: z.boolean(),
    languages: z.array(z.string()),
    media_type: z.string(),
    name: z.string(),
    publisher: z.string(),
    type: z.string(),
    uri: z.string(),
    total_episodes: z.number()
  })
})


const PlaylistTrackObjectSchema = z.object({
  added_at: z.string(),
  added_by: z.object({
    external_urls: z.object({
      spotify: z.string()
    }),
    followers: z.object({
      href: z.string().nullable(),
      total: z.number()
    }).optional(),
    href: z.string(),
    id: z.string(),
    type: z.string(),
    uri: z.string()
  }).nullable(),
  is_local: z.boolean(),
  track: TrackSchema.or(EpisodeObjectSchema)
})

const UserPlaylistItemsResponseSchema = z.object({
  href: z.string(),
  limit: z.number(),
  next: z.string().nullable(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number(),
  items: z.array(PlaylistTrackObjectSchema)
})

export type PlaylistTrackObject = z.infer<typeof PlaylistTrackObjectSchema>
export type UserPlaylistItemsResponse = z.infer<typeof UserPlaylistItemsResponseSchema>
export { UserPlaylistItemsResponseSchema }
