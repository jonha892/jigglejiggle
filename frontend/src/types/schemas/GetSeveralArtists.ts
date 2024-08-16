import { z } from 'zod'
import { ArtistSchema } from './Track'

const GetSeveralArtistsSchema = z.object({
    artists: z.array(ArtistSchema),
})

export default GetSeveralArtistsSchema
