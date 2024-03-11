import {z} from 'zod'

const FollowersSchema = z.object({
    href: z.optional(z.string().nullable()),
    total: z.optional(z.number())
})

export type Followers = z.infer<typeof FollowersSchema>

export { FollowersSchema }