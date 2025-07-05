import { z } from 'zod'
import { TrackSchema } from './Track'

const SavedTrackObjectSchema = z.object({
  track: TrackSchema,
})

const UserSavedTracksResponseSchema = z.object({
  items: z.array(SavedTrackObjectSchema),
  next: z.string().nullable(),
})

export default UserSavedTracksResponseSchema
export type UserSavedTracksResponse = z.infer<typeof UserSavedTracksResponseSchema>
export type SavedTrackObject = z.infer<typeof SavedTrackObjectSchema>
