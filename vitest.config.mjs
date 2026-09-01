import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'node',
		globals: true,
		setupFiles: ['src/test/setupTests.js'],
		alias: {
			'@': path.resolve(currentDirectory, './src'),
		},
		include: ['**/*.test.js', '**/*.test.jsx', '**/*.spec.js'],
	},
});
