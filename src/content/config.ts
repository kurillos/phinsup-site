import { defineCollection, z } from "astro:content";

const blog = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        heroImage: z.string().optional(),
        category: z.enum(['Actu', 'Analyse', 'Draft', 'Histoire', 'Breaking News']),
        author: z.string().default('Cyril pour PhinsUp Staff'),
        isDraft: z.boolean().default(false),
    }),
});

export const collections = { blog };