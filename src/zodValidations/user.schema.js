import { z } from 'zod';

export const updateUserBodySchema = z.object({
    name: z.string().min(1).optional(),
    profile_img: z.url("Must be a valid URL").optional(),
});
