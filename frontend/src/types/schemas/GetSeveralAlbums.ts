import { z } from 'zod'
import { AlbumSchema } from './Track'

const GetSeveralAlbumsSchema = z.object({
    albums: z.array(AlbumSchema),
})

export { GetSeveralAlbumsSchema }
