import {z} from 'zod'
 export const ValidationSchema = z.object({
   email:z.string().email(),
   password: z.string().trim()
 });
export type validateSchema = z.infer<typeof ValidationSchema>;