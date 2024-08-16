import { z } from 'zod'
import { TrackSchema } from './Track'

const GetSeveralTracksSchema = z.object({
    tracks: z.array(TrackSchema),
})

export { GetSeveralTracksSchema }
