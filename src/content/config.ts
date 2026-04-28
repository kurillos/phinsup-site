import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		category: z.string().catch('Actu'), 
		author: z.enum([
            "The French Fins Staff", 
            "Cyril", 
            "Lucas", 
            "Patrick",
			"Erwan",
			"Hugo",
			"James",
			"Jessy",
			"Yohan"
        ]).catch('The French Fins Staff'),
		tags: z.array(z.string()).optional().default(["Miami Dolphins"]),
		isDraft: z.boolean().optional().default(false),
	}),
});

const podcasts = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		pubDate: z.coerce.date(),
		description: z.string().optional(),
		spotifyUrl: z.string().url(),
		cover: z.string().optional(),
		episode: z.string().optional(),
	}),
});

export const collections = { blog, podcasts };
