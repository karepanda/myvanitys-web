import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'node',
		globals: true,
		setupFiles: ['src/test/setupTests.js'],
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
		include: ['**/*.test.js', '**/*.test.jsx', '**/*.spec.js'],
	},
});
