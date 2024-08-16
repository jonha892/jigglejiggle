import { z } from 'zod'

const ImageObjectSchema = z.object({
    url: z.string(),
    height: z.number().nullable(),
    width: z.number().nullable()
})

export type ImageObject = z.infer<typeof ImageObjectSchema>
export { ImageObjectSchema }
