import { existsSync, readFileSync } from 'fs';

export function getSecret(name: string): string | undefined {
  const secretPath = `/run/secrets/${name}`;
  console.log('name', name);

  if (existsSync(secretPath)) {
    return readFileSync(secretPath, 'utf8').trim();
  }

  return process.env[name];
}
