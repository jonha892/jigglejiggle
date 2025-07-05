import { z } from 'zod'

const SimplifiedArtist = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
})

const AlbumSchema = z.object({
  id: z.string(),
  name: z.string(),
  artists: z.array(SimplifiedArtist),
})

const ArtistSchema = z.object({
  genres: z.array(z.string()).optional(),
  id: z.string(),
  name: z.string().optional(),
})

const TrackSchema = z.object({
  album: AlbumSchema.optional(),
  artists: z.array(ArtistSchema).optional(),
  href: z.string(),
  id: z.string(),
  name: z.string(),
})

type Track = z.infer<typeof TrackSchema>
type Album = z.infer<typeof AlbumSchema>
type Artist = z.infer<typeof ArtistSchema>

export { AlbumSchema, ArtistSchema, TrackSchema }
export type { Album, Artist, Track }
