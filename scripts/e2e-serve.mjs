import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Builds the app with VITE_API_URL baked in, then serves it with `vite preview`
// on localhost:5173 (the backend CORS only allows http://localhost:5173).
// Setting process.env before spawning `vite build` overrides any .env file value.

const API_URL =
  process.env.VITE_API_URL || 'http://localhost:8080/myvanitys/api/v1';
process.env.VITE_API_URL = API_URL;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
      }
    });
  });
}

async function main() {
  await run('npx', ['vite', 'build']);

  // Keep serving until Playwright stops the web server process.
  await new Promise((resolve, reject) => {
    const child = spawn(
      'npx',
      ['vite', 'preview', '--host', 'localhost', '--port', '5173', '--strictPort'],
      {
        cwd: root,
        stdio: 'inherit',
        shell: process.platform === 'win32',
      }
    );
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`vite preview exited with code ${code}`));
      }
    });
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
