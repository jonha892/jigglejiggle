import { z } from 'zod'

const GetCurrentUserProfileResponseSchema = z.object({
  id: z.string(),
})

export type GetCurrentUserProfileResponse = z.infer<typeof GetCurrentUserProfileResponseSchema>

export { GetCurrentUserProfileResponseSchema }
