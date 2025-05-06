// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from "@tailwindcss/vite";
import path from 'path';
import node from '@astrojs/node';

const ApiBaseUrl = import.meta.env.PUBLIC_API_BASE_URL;

export default defineConfig({
	site: ApiBaseUrl,
	integrations: [mdx(), sitemap(), react()],
	output: 'server',
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				'@root': path.resolve('./src'),
				'@components': path.resolve('./src/components'),
				'@api': path.resolve('./src/pages/api'),
				'@utils': path.resolve('./src/utils'),
				'@styles': path.resolve('./src/styles'),
			}
		}
	},
	adapter: node({
		mode: 'standalone'
	  })
});
