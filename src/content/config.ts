import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		// On utilise .catch() pour éviter que le build plante si une catégorie est mal écrite
		category: z.string().catch('Actu'), 
		author: z.string().default('Cyril'),
		// On rend les tags et isDraft totalement optionnels
		tags: z.array(z.string()).optional().default(["Miami Dolphins"]),
		isDraft: z.boolean().optional().default(false),
	}),
});

export const collections = { blog };