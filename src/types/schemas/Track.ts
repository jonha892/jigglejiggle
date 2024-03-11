import { z } from 'zod'

const ExternalUrls = z.object({
    spotify: z.string().optional(),
})

const Followers = z.object({
    href: z.string().nullable().optional(),
    total: z.number().optional(),
})

const ImageObject = z.object({})

const Restrictions = z.object({
    reason: z.enum(['market', 'product', 'explicit']).optional(),
})

const ExternalIds = z.object({
    isrc: z.string().optional(),
    ean: z.string().optional(),
    upc: z.string().optional(),
})

const SimplifiedArtist = z.object({
    external_urls: ExternalUrls.optional(),
    href: z.string().optional(),
    id: z.string().optional(),
    name: z.string().optional(),
    type: z.enum(['artist']).optional(),
    uri: z.string().optional(),
})

const AlbumSchema = z.object({
    album_type: z.string(),
    total_tracks: z.number(),
    available_markets: z.array(z.string()),
    external_urls: ExternalUrls,
    href: z.string(),
    id: z.string(),
    images: z.array(ImageObject),
    name: z.string(),
    release_date: z.string(),
    release_date_precision: z.enum(['year', 'month', 'day']),
    restrictions: Restrictions.optional(),
    type: z.enum(['album']),
    uri: z.string(),
    external_ids: ExternalIds.optional(),
    genres: z.array(z.string()).optional(),
    label: z.string().optional(),
    popularity: z.number().optional(),
    album_group: z.enum(['album', 'single', 'compilation', 'appears_on']).optional(),
    artists: z.array(SimplifiedArtist),
})

const ArtistSchema = z.object({
    external_urls: ExternalUrls.optional(),
    followers: Followers.optional(),
    genres: z.array(z.string()).optional(),
    href: z.string().optional(),
    id: z.string(),
    images: z.array(ImageObject).optional(),
    name: z.string().optional(),
    popularity: z.number().optional(),
    type: z.enum(['artist']).optional(),
    uri: z.string().optional(),
})

const TrackSchema = z.object({
    album: AlbumSchema.optional(),
    artists: z.array(ArtistSchema).optional(),
    available_markets: z.array(z.string()).optional(),
    disc_number: z.number().optional(),
    duration_ms: z.number().optional(),
    explicit: z.boolean().optional(),
    external_ids: ExternalIds.optional(),
    external_urls: ExternalUrls.optional(),
    href: z.string(),
    id: z.string(),
    is_playable: z.boolean().optional(),
    linked_from: z.any().optional(),
    restrictions: Restrictions.optional(),
    name: z.string(),
    popularity: z.number().optional(),
    preview_url: z.string().nullable(),
    track_number: z.number().optional(),
    type: z.enum(['track']).optional(),
    uri: z.string().optional(),
    is_local: z.boolean().optional(),
})

type Track = z.infer<typeof TrackSchema>
type Album = z.infer<typeof AlbumSchema>
type Artist = z.infer<typeof ArtistSchema>

export { AlbumSchema, ArtistSchema, TrackSchema }
export type { Album, Artist, Track }

