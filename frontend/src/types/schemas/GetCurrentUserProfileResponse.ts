import { z } from 'zod'
import { ExternalSpotifyUrlSchema } from './ExternalSpotifyUrls'
import { FollowersSchema } from './Followers'
import { ImageObjectSchema } from './Images'

const GetCurrentUserProfileResponseSchema = z.object({
    country: z.optional(z.string()),
    display_name: z.optional(z.string()),
    email: z.optional(z.string()),
    explicit_content: z.optional(z.object({
        filter_enabled: z.optional(z.boolean()),
        filter_locked: z.optional(z.boolean()),
    })),
    external_urls: z.optional(ExternalSpotifyUrlSchema),
    followers: z.optional(FollowersSchema),

    href: z.optional(z.string()),
    id: z.string(),
    images: z.optional(z.array(ImageObjectSchema)),
    product: z.optional(z.enum(["premium", "free", "open"])),
    type: z.optional(z.enum(["user"])),
    uri: z.optional(z.string()),
})

export type GetCurrentUserProfileResponse = z.infer<typeof GetCurrentUserProfileResponseSchema>

export { GetCurrentUserProfileResponseSchema }
