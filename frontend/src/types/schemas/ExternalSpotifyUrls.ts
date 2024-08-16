import { z } from 'zod'

const ExternalSpotifyUrlSchema = z.object({
    spotify: z.optional(z.string())
})

export type ExternalSpotifyUrl = z.infer<typeof ExternalSpotifyUrlSchema>
export { ExternalSpotifyUrlSchema }
