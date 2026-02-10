import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		category: z.enum(['Actu', 'Analyse', 'Draft', 'Histoire', 'Breaking News']),
		author: z.string(),
		// Ajoute ces deux lignes ici :
		tags: z.array(z.string()).default(["Miami Dolphins"]), 
		isDraft: z.boolean().default(false),
	}),
});

export const collections = { blog };