import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	test: {
		environment: 'node',
		globals: true,
		setupFiles: ['src/test/setupTests.js'],
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
		include: ['**/*.test.js', '**/*.spec.js'],
	},
});
